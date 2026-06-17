import type { CollectionBeforeValidateHook } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import { extractID } from '@/utilities/extractID'

export const setTenantFromUser: CollectionBeforeValidateHook = async ({ data, req, operation }) => {
  if (operation !== 'create') {
    return data
  }

  if (data?.tenant) {
    return data
  }

  // Try to derive tenant from the user's tenant associations
  const userTenants = req.user?.tenants
  if (userTenants && userTenants.length > 0) {
    const firstTenantID = extractID(userTenants[0].tenant)
    if (firstTenantID) {
      return { ...data, tenant: firstTenantID }
    }
  }

  // Fallback for super admins: assign the first available tenant
  if (isSuperAdmin(req.user)) {
    const tenants = await req.payload.find({
      collection: 'tenants',
      depth: 0,
      limit: 1,
      pagination: false,
    })
    if (tenants.docs.length > 0) {
      return { ...data, tenant: tenants.docs[0].id }
    }
  }

  return data
}
