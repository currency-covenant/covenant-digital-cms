import type { Block } from 'payload'

export const ProductGrid: Block = {
  slug: 'productGrid',
  interfaceName: 'ProductGridBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      labels: {
        plural: 'Products',
        singular: 'Product',
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
          name: 'beta',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'iconImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
  labels: {
    plural: 'Product Grids',
    singular: 'Product Grid',
  },
}
