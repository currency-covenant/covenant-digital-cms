import type { Access } from 'payload'

import { isEcommerceAdmin } from './utilities'

/**
 * Atomic access checker that verifies if the user has admin privileges.
 * Super-admins and content editors (`user` role) are considered ecommerce admins.
 */
export const isAdmin: Access = ({ req }) => {
  return isEcommerceAdmin(req.user)
}
