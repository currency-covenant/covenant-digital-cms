import type { CollectionConfig } from 'payload'

import { requireRoles } from '@/access/roles'
import { triggerWebhookAfterChange, triggerWebhookAfterDelete } from '@/hooks/triggerWebhooks'
import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'
import { revalidateContentNetwork, revalidateDelete } from './hooks/revalidateContentNetwork'

export const ContentNetwork: CollectionConfig = {
  slug: 'content-network',
  access: {
    create: requireRoles(['user']),
    read: () => true,
    update: requireRoles(['user']),
    delete: requireRoles(['user']),
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
