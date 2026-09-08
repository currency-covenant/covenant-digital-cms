import type { User } from '@/payload-types'

/**
 * Checks if a user has any of the given platform-level roles.
 * Platform roles live on `user.roles` (`super-admin`, `user`, `customer`).
 */
export const checkPlatformRole = (
  allRoles: User['roles'] = [],
  user?: User | null,
): boolean => {
  if (user && allRoles) {
    return allRoles.some((role) => {
      return user?.roles?.some((individualRole) => {
        return individualRole === role
      })
    })
  }

  return false
}

/**
 * Checks if a user is an ecommerce admin: either a super-admin
 * or a content editor (`user` role).
 */
export const isEcommerceAdmin = (user?: User | null): boolean => {
  if (!user) return false
  if (checkPlatformRole(['super-admin'], user)) return true
  return checkPlatformRole(['user'], user)
}
