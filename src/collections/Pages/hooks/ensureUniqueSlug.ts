import type { FieldHook } from 'payload'

import { ValidationError } from 'payload'

export const ensureUniqueSlug: FieldHook = async ({ data, originalDoc, req, value }) => {
  // if value is unchanged, skip validation
  if (originalDoc.slug === value) {
    return value
  }

  const findDuplicatePages = await req.payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: value,
      },
    },
  })

  if (findDuplicatePages.docs.length > 0 && data?.slug !== originalDoc.slug) {
    throw new ValidationError({
      errors: [
        {
          message: `A page with the slug "${value}" already exists.`,
          path: 'slug',
        },
      ],
    })
  }

  return value
}