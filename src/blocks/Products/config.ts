import type { Block } from 'payload'

export const Products: Block = {
  slug: 'products',
  interfaceName: 'ProductsBlock',
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
    plural: 'Products Blocks',
    singular: 'Products Block',
  },
}
