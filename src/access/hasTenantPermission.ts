import type { AccessResult } from 'payload'

import { isSuperAdmin } from './isSuperAdmin'
import { extractID } from '@/utilities/extractID'

export const hasTenantPermission = async ({
  req,
  collectionSlug,
  accessResult,
}: {
  req: any
  collectionSlug: string
  accessResult: AccessResult
}): Promise<AccessResult> => {
  // Public API (BFF proxy) — always allow
  if (!req.user) return accessResult

  // Super admins bypass
  if (isSuperAdmin(req.user)) return accessResult

  // Get user's first tenant
  const tenantId = extractID(req.user?.tenants?.[0]?.tenant)
  if (!tenantId) return false

  // Cache permissions per request
  if (!req.context?.tenantPermissions) {
    const tenant = await req.payload.findByID({
      collection: 'tenants',
      id: tenantId,
      depth: 0,
      select: { permissions: true },
    })
    req.context.tenantPermissions = (tenant?.permissions as string[]) || []
  }

  if (!req.context.tenantPermissions.includes(collectionSlug)) return false

  return accessResult
}
