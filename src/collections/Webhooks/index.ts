import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'

export const Webhooks: CollectionConfig = {
  slug: 'webhooks',
  admin: {
    useAsTitle: 'label',
    group: 'System',
  },
  access: {
    create: ({ req }) => {
      if (!req.user) return false
      if (isSuperAdmin(req.user)) return true
      return getUserTenantIDs(req.user, 'tenant-admin').length > 0
    },
    read: ({ req }) => {
      if (!req.user) return false
      if (isSuperAdmin(req.user)) return true
      return {
        tenant: {
          in: getUserTenantIDs(req.user),
        },
      }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (isSuperAdmin(req.user)) return true
      return {
        tenant: {
          in: getUserTenantIDs(req.user, 'tenant-admin'),
        },
      }
    },
    delete: ({ req }) => {
      if (!req.user) return false
      if (isSuperAdmin(req.user)) return true
      return {
        tenant: {
          in: getUserTenantIDs(req.user, 'tenant-admin'),
        },
      }
    },
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'secret',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'events',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'On Create', value: 'onCreate' },
        { label: 'On Update', value: 'onUpdate' },
        { label: 'On Delete', value: 'onDelete' },
        { label: 'On Publish', value: 'onPublish' },
      ],
    },
    {
      name: 'collections',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Pages', value: 'pages' },
        { label: 'Posts', value: 'posts' },
        { label: 'Media', value: 'media' },
        { label: 'Categories', value: 'categories' },
      ],
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
