import type { CollectionConfig } from 'payload'
import { isSuperAdminAccess } from '@/access/isSuperAdmin'

export const Webhooks: CollectionConfig = {
  slug: 'webhooks',
  admin: {
    useAsTitle: 'label',
    group: 'System',
  },
  access: {
    create: isSuperAdminAccess,
    read: isSuperAdminAccess,
    update: isSuperAdminAccess,
    delete: isSuperAdminAccess,
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
        { label: 'Products', value: 'products' },
        { label: 'Orders', value: 'orders' },
        { label: 'Carts', value: 'carts' },
        { label: 'Transactions', value: 'transactions' },
        { label: 'Header', value: 'header' },
      ],
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
