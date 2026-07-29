import type { Block } from 'payload'

import { link } from '../../fields/link'

export const CTAButton: Block = {
  slug: 'ctaButton',
  interfaceName: 'CTAButtonBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    link({
      appearances: ['default', 'outline'],
    }),
  ],
  labels: {
    plural: 'CTA Buttons',
    singular: 'CTA Button',
  },
}
