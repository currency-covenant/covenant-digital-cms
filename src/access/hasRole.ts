import type { User, Tenant } from '@/payload-types'
import { extractID } from '@/utilities/extractID'
import { isSuperAdmin } from './isSuperAdmin'

export const hasTenantRole = (
  user: User | null,
  tenantId: string | number | undefined,
  role: NonNullable<User['tenants']>[number]['roles'][number],
): boolean => {
  if (!user || !tenantId) return false
  return (
    user?.tenants?.some((t) => {
      const tId = extractID(t.tenant)
      return tId === tenantId && t.roles?.includes(role)
    }) ?? false
  )
}

export const hasAnyTenantRole = (
  user: User | null,
  role: NonNullable<User['tenants']>[number]['roles'][number],
): string | number | false => {
  if (!user) return false
  const match = user?.tenants?.find((t) => t.roles?.includes(role))
  return match ? extractID(match.tenant) : false
}

export const getUserTenantIDsByRoles = (
  user: User | null,
  roles: string[],
): Tenant['id'][] => {
  if (!user) return []
  return (
    user?.tenants?.reduce<Tenant['id'][]>((acc, { roles: userRoles, tenant }) => {
      const hasRole = userRoles.some((r) => roles.includes(r))
      if (!hasRole) return acc
      if (tenant) acc.push(extractID(tenant))
      return acc
    }, []) || []
  )
}

export const requireTenantRoles = (allowedRoles: string[]) => {
  const create = ({ req, data }: { req: any; data?: any }): boolean | any => {
    if (!req.user) return false
    if (isSuperAdmin(req.user)) return true
    const tenantId = data?.tenant
    if (tenantId) {
      return getUserTenantIDsByRoles(req.user, allowedRoles).includes(tenantId)
    }
    return getUserTenantIDsByRoles(req.user, allowedRoles).length > 0
  }

  const read = ({ req }: { req: any }): boolean | any => {
    return true
  }

  const update = ({ req }: { req: any }): boolean | any => {
    if (!req.user) return false
    if (isSuperAdmin(req.user)) return true
    const tenantIDs = getUserTenantIDsByRoles(req.user, allowedRoles)
    if (tenantIDs.length === 0) return false
    return {
      tenant: {
        in: tenantIDs,
      },
    }
  }

  const del = ({ req }: { req: any }): boolean | any => {
    if (!req.user) return false
    if (isSuperAdmin(req.user)) return true
    const tenantIDs = getUserTenantIDsByRoles(req.user, allowedRoles)
    if (tenantIDs.length === 0) return false
    return {
      tenant: {
        in: tenantIDs,
      },
    }
  }

  return { create, read, update, delete: del }
}
