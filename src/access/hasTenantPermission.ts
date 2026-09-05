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

  const userTenantIDs = (req.user?.tenants || [])
    .map((t: any) => extractID(t.tenant))
    .filter((id: any): id is string | number => id !== null && id !== undefined)

  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({ payload: req.payload, collectionSlug: 'tenants' }),
  )

  // Prefer the cookie-selected tenant, but only if it is actually assigned to this user.
  // Otherwise fall back to the user's own tenants (handles stale `payload-tenant` cookies).
  const tenantIDsToCheck: (string | number)[] = []
  if (selectedTenant && userTenantIDs.includes(selectedTenant)) {
    tenantIDsToCheck.push(selectedTenant)
  } else {
    tenantIDsToCheck.push(...userTenantIDs)
  }

  if (tenantIDsToCheck.length === 0) return false

  if (!req.context) req.context = {}
  if (!req.context.tenantPermissions) req.context.tenantPermissions = {}

  for (const tenantId of tenantIDsToCheck) {
    if (req.context.tenantPermissions[tenantId] === undefined) {
      let permissions: string[] | undefined
      try {
        const tenant = await req.payload.findByID({
          collection: 'tenants',
          id: tenantId,
          depth: 0,
          select: { permissions: true },
          req,
        })
        permissions = tenant?.permissions as string[] | undefined
      } catch {
        // Tenant lookup can fail (e.g. missing/stale reference); treat as unrestricted
        // so a failed permissions lookup does not silently block every operation.
        permissions = undefined
      }
      req.context.tenantPermissions[tenantId] = permissions ?? []
    }

    const tenantPermissions = req.context.tenantPermissions[tenantId]

    // A tenant with no configured permission list is unrestricted (legacy tenants).
    if (tenantPermissions.length === 0 || tenantPermissions.includes(collectionSlug)) {
      return accessResult
    }
  }

  return false
}
