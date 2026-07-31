import type { Block } from 'payload'

import { link } from '../../fields/link'

export const LinkList: Block = {
  slug: 'linkList',
  interfaceName: 'LinkListBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'links',
      type: 'array',
      required: true,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        link(),
      ],
    },
  ],
  labels: {
    plural: 'Link Lists',
    singular: 'Link List',
  },
}
