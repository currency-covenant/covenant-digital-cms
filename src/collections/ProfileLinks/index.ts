import type { CollectionConfig } from 'payload'

import { requireRoles } from '@/access/roles'
import { triggerWebhookAfterChange, triggerWebhookAfterDelete } from '@/hooks/triggerWebhooks'
import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'
import { revalidateProfileLinks, revalidateDelete } from './hooks/revalidateProfileLinks'

export const ProfileLinks: CollectionConfig = {
  slug: 'profile-links',
  access: {
    create: requireRoles(['user']),
    read: () => true,
    update: requireRoles(['user']),
    delete: requireRoles(['user']),
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
      admin: {
        components: {
          Field: '/components/views/IconNameField',
        },
      },
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
