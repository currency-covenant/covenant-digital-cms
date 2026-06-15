import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDsByRoles } from '@/access/hasRole'
import { triggerWebhookAfterChange, triggerWebhookAfterDelete } from '@/hooks/triggerWebhooks'
import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: ({ req, data }) => {
      if (!req.user) return false
      if (isSuperAdmin(req.user)) return true
      const tenantId = data?.tenant
      if (tenantId) {
        const allowed = getUserTenantIDsByRoles(req.user, ['tenant-admin', 'tenant-publisher', 'tenant-editor'])
        return allowed.includes(tenantId)
      }
      return getUserTenantIDsByRoles(req.user, ['tenant-admin', 'tenant-publisher', 'tenant-editor']).length > 0
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
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  hooks: {
    afterChange: [triggerWebhookAfterChange, logAuditAfterChange],
    afterDelete: [triggerWebhookAfterDelete, logAuditAfterDelete],
  },
  upload: {
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
