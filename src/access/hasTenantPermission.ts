import type { AccessResult } from 'payload'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'

import { isSuperAdmin } from './isSuperAdmin'
import { extractID } from '@/utilities/extractID'
import { getCollectionIDType } from '@/utilities/getCollectionIDType'

export const hasTenantPermission = async ({
  req,
  collectionSlug,
  accessResult,
}: {
  req: any
  collectionSlug: string
  accessResult: AccessResult
}): Promise<AccessResult> => {
  if (!req.user) return accessResult
  if (isSuperAdmin(req.user)) return accessResult

  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({ payload: req.payload, collectionSlug: 'tenants' }),
  )

  const tenantIDsToCheck: (string | number)[] = []
  if (selectedTenant) {
    tenantIDsToCheck.push(selectedTenant)
  } else {
    const userTenants = req.user?.tenants || []
    for (const t of userTenants) {
      const id = extractID(t.tenant)
      if (id) tenantIDsToCheck.push(id)
    }
  }

  if (tenantIDsToCheck.length === 0) return false

  if (!req.context) req.context = {}
  if (!req.context.tenantPermissions) req.context.tenantPermissions = {}

  for (const tenantId of tenantIDsToCheck) {
    if (req.context.tenantPermissions[tenantId] === undefined) {
      const tenant = await req.payload.findByID({
        collection: 'tenants',
        id: tenantId,
        depth: 0,
        select: { permissions: true },
      })
      req.context.tenantPermissions[tenantId] = (tenant?.permissions as string[]) || []
    }

    if (req.context.tenantPermissions[tenantId].includes(collectionSlug)) {
      return accessResult
    }
  }

  return false
}
