import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDsByRoles } from '@/access/hasRole'
import { setTenantFromUser } from '@/hooks/setTenantFromUser'
import { triggerWebhookAfterChange, triggerWebhookAfterDelete } from '@/hooks/triggerWebhooks'
import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'
import { link } from '@/fields/link'

export const Footer: CollectionConfig = {
  slug: 'footer',
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
    defaultColumns: ['title', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal label for this footer config (e.g. "Main Footer").',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Optional logo image shown in the footer.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Short tagline shown under the logo.',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      admin: {
        initCollapsed: true,
        description: 'Social media icons shown in the footer.',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'GitHub', value: 'github' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Profile URL',
        },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      required: true,
      admin: {
        initCollapsed: true,
        description: 'Footer link columns. Each column has a title and a list of links.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Column Title',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },
    {
      name: 'newsletterHeading',
      type: 'text',
      required: false,
      defaultValue: 'Stay up to date',
      label: 'Newsletter Heading',
    },
    {
      name: 'newsletterPlaceholder',
      type: 'text',
      required: false,
      defaultValue: 'Enter your email',
      label: 'Newsletter Placeholder',
    },
    {
      name: 'newsletterButtonLabel',
      type: 'text',
      required: false,
      defaultValue: 'Subscribe',
      label: 'Newsletter Button Label',
    },
    {
      name: 'copyrightText',
      type: 'text',
      required: false,
      label: 'Copyright Text',
      admin: {
        description: 'e.g. © 2024 Lbdluxe. All rights reserved.',
      },
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal Links',
      admin: {
        initCollapsed: true,
        description: 'Links shown in the bottom-right of the footer (Terms, Privacy, etc.).',
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
  ],
  hooks: {
    beforeValidate: [setTenantFromUser],
    afterChange: [triggerWebhookAfterChange, logAuditAfterChange],
    afterDelete: [triggerWebhookAfterDelete, logAuditAfterDelete],
  },
}
