import type { Access } from 'payload'

import type { User } from '@/payload-types'

import { isSuperAdmin } from './isSuperAdmin'

type Role = NonNullable<User['roles']>[number]

export const hasRole = (user: User | null | undefined, role: Role): boolean => {
  return Boolean(user?.roles?.includes(role))
}

export const hasAnyRole = (user: User | null | undefined, roles: Role[]): boolean => {
  if (!user) return false
  return roles.some((role) => user.roles?.includes(role))
}

/**
 * Requires an authenticated user with one of the given roles. Super-admins
 * always pass. Access scope is global since the CMS manages a single tenant
 * (lbdluxe), so the same rule applies to create, update, and delete.
 */
export const requireRoles = (roles: Role[] = ['user']): Access => {
  return ({ req }) => {
    const { user } = req
    if (!user) return false
    if (isSuperAdmin(user)) return true
    return hasAnyRole(user, roles)
  }
}