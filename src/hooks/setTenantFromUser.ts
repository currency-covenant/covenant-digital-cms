import type { CollectionBeforeChangeHook } from 'payload'

import { extractID } from '@/utilities/extractID'

export const setTenantFromUser: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (operation !== 'create') {
    return data
  }

  if (data?.tenant) {
    return data
  }

  const userTenants = req.user?.tenants
  if (!userTenants || userTenants.length === 0) {
    return data
  }

  const firstTenantID = extractID(userTenants[0].tenant)
  if (!firstTenantID) {
    return data
  }

  return {
    ...data,
    tenant: firstTenantID,
  }
}
