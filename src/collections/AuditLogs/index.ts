import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    group: 'System',
    defaultColumns: ['action', 'collection', 'user', 'tenant', 'timestamp'],
    description: 'Audit trail of all content changes',
  },
  access: {
    create: () => false,
    read: ({ req }) => {
      if (!req.user) return false
      if (isSuperAdmin(req.user)) return true
      return {
        tenant: {
          in: getUserTenantIDs(req.user, 'tenant-admin'),
        },
      }
    },
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
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
}
