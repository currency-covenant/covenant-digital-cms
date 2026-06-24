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
 * Checks if a user has any of the given per-tenant roles across any of their tenants.
 * Tenant roles live on `user.tenants[].roles` (`tenant-admin`, `tenant-publisher`, etc.).
 */
export const checkTenantRole = (
  allRoles: string[] = [],
  user?: User | null,
): boolean => {
  if (user && allRoles) {
    return Boolean(
      user?.tenants?.some((t) => {
        return t?.roles?.some((role) => allRoles.includes(role))
      }),
    )
  }

  return false
}

/**
 * Checks if a user is an ecommerce admin: either a platform super-admin
 * or a user with a tenant-admin role on any tenant.
 */
export const isEcommerceAdmin = (user?: User | null): boolean => {
  if (!user) return false
  if (checkPlatformRole(['super-admin'], user)) return true
  return checkTenantRole(['tenant-admin'], user)
}
