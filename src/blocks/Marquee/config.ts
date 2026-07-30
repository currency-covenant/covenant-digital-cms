import type { Block } from 'payload'

export const Marquee: Block = {
  slug: 'marquee',
  interfaceName: 'MarqueeBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      labels: {
        plural: 'Marquee Items',
        singular: 'Marquee Item',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (simple-icons slug)',
          admin: {
            placeholder: 'e.g. react, nextdotjs, typescript, tailwindcss',
            description:
              'Enter a simple-icons slug (lowercase, no spaces). Find icons at https://simpleicons.org',
          },
        },
        {
          name: 'uploadIcon',
          type: 'upload',
          relationTo: 'media',
          label: 'Uploaded Icon',
          admin: {
            description:
              'Upload a custom icon image (PNG, SVG, etc.). If provided, this takes precedence over the simple-icons slug.',
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Marquees',
    singular: 'Marquee',
  },
}
