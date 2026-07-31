import type { Block } from 'payload'

export const TechStack: Block = {
  slug: 'techStack',
  interfaceName: 'TechStackBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'row',
          type: 'number',
          defaultValue: 1,
          admin: {
            description: 'Which row this item appears in',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'react-icons/si slug, e.g. "React" or "Nextdotjs"',
          },
        },
        {
          name: 'devicon',
          type: 'text',
          admin: {
            description: 'Devicon class, e.g. "devicon-react-original colored"',
          },
        },
        {
          name: 'uploadIcon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
  labels: {
    plural: 'Tech Stacks',
    singular: 'Tech Stack',
  },
}
