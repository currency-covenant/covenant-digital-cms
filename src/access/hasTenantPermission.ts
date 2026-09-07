import type { AccessResult } from 'payload'

import { isSuperAdmin } from './isSuperAdmin'
import { extractID } from '@/utilities/extractID'

/**
 * Grants tenant-scoped access to any user assigned to at least one tenant.
 *
 * Per-tenant document scoping is enforced by the multi-tenant plugin, and each
 * collection's own access control enforces role requirements. This function
 * no longer consults a per-collection permission allow-list.
 */
export const hasTenantPermission = async ({
  req,
  accessResult,
}: {
  req: any
  collectionSlug?: string
  accessResult: AccessResult
}): Promise<AccessResult> => {
  if (!req.user) return accessResult
  if (isSuperAdmin(req.user)) return accessResult

  const hasAnyTenant = (req.user?.tenants || []).some(
    (t: any) => extractID(t.tenant) !== null && extractID(t.tenant) !== undefined,
  )

  if (!hasAnyTenant) return false

  return accessResult
}