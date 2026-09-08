import type { Access } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'

import type { User } from '@/payload-types'

// Only super-admins can create users. This also guarantees only a super-admin
// can assign the `super-admin` role.
export const createAccess: Access<User> = ({ req }) => {
  return isSuperAdmin(req.user)
}