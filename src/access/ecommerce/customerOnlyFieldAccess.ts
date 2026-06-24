import type { FieldAccess } from 'payload'

import { checkPlatformRole } from './utilities'

/**
 * Field-level access: only customers (authenticated users with the `customer` role).
 */
export const customerOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (user) return checkPlatformRole(['customer'], user)

  return false
}
