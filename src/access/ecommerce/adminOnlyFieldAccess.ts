import type { FieldAccess } from 'payload'

import { isEcommerceAdmin } from './utilities'

/**
 * Field-level access: only ecommerce admins (super-admin or tenant-admin).
 */
export const adminOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  return isEcommerceAdmin(user)
}
