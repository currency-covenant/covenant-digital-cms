import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDsByRoles } from '@/access/hasRole'
import { setTenantFromUser } from '@/hooks/setTenantFromUser'
import { triggerWebhookAfterChange, triggerWebhookAfterDelete } from '@/hooks/triggerWebhooks'
import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'
import { revalidateProfileLinks, revalidateDelete } from './hooks/revalidateProfileLinks'

export const ProfileLinks: CollectionConfig = {
  slug: 'profile-links',
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
    defaultColumns: ['title', 'linkType', 'order', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Card Title',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Link URL',
    },
    {
      name: 'linkType',
      type: 'select',
      required: true,
      options: [
        { label: 'Large Card', value: 'lg' },
        { label: 'Small Card', value: 'sm' },
      ],
      label: 'Card Size',
      admin: {
        width: '50%',
      },
    },
    {
      name: 'iconSet',
      type: 'select',
      defaultValue: 'si',
      options: [
        { label: 'Simple Icons (Si)', value: 'si' },
        { label: 'Simple Line Icons (Sl)', value: 'sl' },
        { label: 'Lucide Icons', value: 'lucide' },
      ],
      label: 'Icon Library',
      admin: {
        width: '50%',
      },
    },
    {
      name: 'iconName',
      type: 'text',
      label: 'Icon Name (Si/Sl: e.g. SiInstagram, SlBag | Lucide: e.g. Instagram, Mail)',
    },
    {
      name: 'hexColor',
      type: 'text',
      defaultValue: '#FFFFFF',
      label: 'Icon Hex Color',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
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
    afterChange: [revalidateProfileLinks, triggerWebhookAfterChange, logAuditAfterChange],
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
