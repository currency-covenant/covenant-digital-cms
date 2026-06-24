import type { FieldAccess } from 'payload'

import { checkPlatformRole, isEcommerceAdmin } from './utilities'

/**
 * Checks if the user is a customer (authenticated but not an ecommerce admin).
 * Used internally by the ecommerce plugin to auto-assign customer ID when
 * creating addresses.
 */
export const isCustomer: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  if (isEcommerceAdmin(user)) return false
  return checkPlatformRole(['customer'], user)
}
