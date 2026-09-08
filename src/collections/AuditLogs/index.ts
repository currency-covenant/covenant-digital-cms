import type { CollectionConfig } from 'payload'
import { isSuperAdminAccess } from '@/access/isSuperAdmin'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    group: 'System',
    defaultColumns: ['action', 'collection', 'user', 'timestamp'],
    description: 'Audit trail of all content changes',
  },
  access: {
    create: () => false,
    read: isSuperAdminAccess,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
      ],
    },
    {
      name: 'collection',
      type: 'text',
      required: true,
    },
    {
      name: 'docId',
      type: 'text',
      required: true,
    },
    {
      name: 'diff',
      type: 'json',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
}
