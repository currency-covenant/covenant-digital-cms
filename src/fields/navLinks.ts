import type { ArrayField, Field } from 'payload'

import { link } from './link'
import deepMerge from '@/utilities/deepMerge'

type NavLinkOptions = {
  name?: string
  label?: string
  allowChildren?: boolean
  overrides?: Partial<ArrayField>
}

function navLinkArray({
  name,
  label,
  allowChildren = false,
  overrides = {},
}: NavLinkOptions): ArrayField {
  const fields: Field[] = [
    link({
      appearances: false,
    }),
  ]

  if (allowChildren) {
    fields.push(
      navLinkArray({
        name: 'children',
        label: 'Sub-items',
        allowChildren: false,
      }) as unknown as Field,
    )
  }

  return deepMerge(
    {
      type: 'array',
      name,
      label,
      fields,
      admin: {
        initCollapsed: true,
        description: allowChildren
          ? 'Add a link or a dropdown group. Items with sub-items will appear as a dropdown menu.'
          : undefined,
      },
    } as ArrayField,
    overrides,
  )
}

type NavLinksFieldOptions = {
  overrides?: Partial<ArrayField>
}

export function navLinks({ overrides = {} } = {}): Field {
  return navLinkArray({
    name: 'navLinks',
    label: 'Navigation Links',
    allowChildren: true,
    overrides,
  }) as unknown as Field
}
