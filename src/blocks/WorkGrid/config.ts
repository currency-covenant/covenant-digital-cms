import type { Block } from 'payload'

export const WorkGrid: Block = {
  slug: 'workGrid',
  interfaceName: 'WorkGridBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      labels: {
        plural: 'Works',
        singular: 'Work',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'projectLink',
          type: 'text',
        },
        {
          name: 'repoLink',
          type: 'text',
        },
        {
          name: 'linkDisplay',
          type: 'select',
          defaultValue: 'both',
          options: [
            {
              label: 'Both',
              value: 'both',
            },
            {
              label: 'Website only',
              value: 'website',
            },
            {
              label: 'Repo only',
              value: 'repo',
            },
          ],
          admin: {
            description: 'Which links to show on the card.',
          },
        },
        {
          name: 'directory',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'beta',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'iconImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Work Grids',
    singular: 'Work Grid',
  },
}
