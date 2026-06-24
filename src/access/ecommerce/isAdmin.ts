import type { Access } from 'payload'

import { isEcommerceAdmin } from './utilities'

/**
 * Atomic access checker that verifies if the user has admin privileges.
 * Super-admins and tenant-admins are considered ecommerce admins.
 */
export const isAdmin: Access = ({ req }) => {
  return isEcommerceAdmin(req.user)
}
