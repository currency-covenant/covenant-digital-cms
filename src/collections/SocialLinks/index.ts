import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDsByRoles } from '@/access/hasRole'
import { setTenantFromUser } from '@/hooks/setTenantFromUser'
import { triggerWebhookAfterChange, triggerWebhookAfterDelete } from '@/hooks/triggerWebhooks'
import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'
import { revalidateSocialLink, revalidateDelete } from './hooks/revalidateSocialLinks'

export const SocialLinks: CollectionConfig = {
  slug: 'social-links',
  access: {
    create: ({ req, data }) => {
      if (!req.user) return false
      if (isSuperAdmin(req.user)) return true
      const tenantId = data?.tenant
      if (tenantId) {
        const allowed = getUserTenantIDsByRoles(req.user, ['tenant-admin', 'tenant-publisher'])
        return allowed.includes(tenantId)
      }
      return getUserTenantIDsByRoles(req.user, ['tenant-admin', 'tenant-publisher']).length > 0
    },
    read: () => true,
    update: ({ req }) => {
      if (!req.user) return false
      if (isSuperAdmin(req.user)) return true
      const tenantIDs = getUserTenantIDsByRoles(req.user, ['tenant-admin', 'tenant-publisher', 'tenant-editor'])
      if (tenantIDs.length === 0) return false
      return { tenant: { in: tenantIDs } }
    },
    delete: ({ req }) => {
      if (!req.user) return false
      if (isSuperAdmin(req.user)) return true
      const tenantIDs = getUserTenantIDsByRoles(req.user, ['tenant-admin'])
      if (tenantIDs.length === 0) return false
      return { tenant: { in: tenantIDs } }
    },
  },
  admin: {
    defaultColumns: ['title', 'url', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'iconType',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (from URL)', value: 'auto' },
        { label: 'Custom upload', value: 'custom' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.iconType === 'custom',
      },
    },
  ],
  hooks: {
    beforeValidate: [setTenantFromUser],
    afterChange: [revalidateSocialLink, triggerWebhookAfterChange, logAuditAfterChange],
    afterDelete: [revalidateDelete, triggerWebhookAfterDelete, logAuditAfterDelete],
  },
  versions: {
    drafts: {
      schedulePublish: true,
      validate: true,
    },
    maxPerDoc: 50,
  },
}
