import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDsByRoles } from '@/access/hasRole'
import { setTenantFromUser } from '@/hooks/setTenantFromUser'
import { triggerWebhookAfterChange, triggerWebhookAfterDelete } from '@/hooks/triggerWebhooks'
import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'
import { revalidateContentNetwork, revalidateDelete } from './hooks/revalidateContentNetwork'

export const ContentNetwork: CollectionConfig = {
  slug: 'content-network',
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
    defaultColumns: ['title', 'networkType', 'order', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Network Title',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Network URL',
    },
    {
      name: 'hexColor',
      type: 'text',
      defaultValue: '#FFFFFF',
      label: 'Icon Hex Color',
    },
    {
      name: 'networkType',
      type: 'select',
      required: true,
      options: [
        { label: 'Rumble', value: 'rumble' },
        { label: 'YouTube', value: 'youtube' },
      ],
      label: 'Network Type',
      admin: {
        width: '50%',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeValidate: [setTenantFromUser],
    afterChange: [revalidateContentNetwork, triggerWebhookAfterChange, logAuditAfterChange],
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
