import type { FieldHook } from 'payload'

import { ValidationError } from 'payload'

export const ensureUniqueUsername: FieldHook = async ({ data, originalDoc, req, value }) => {
  // if value is unchanged, skip validation
  if (originalDoc.username === value) {
    return value
  }

  const findDuplicateUsers = await req.payload.find({
    collection: 'users',
    where: {
      username: {
        equals: value,
      },
    },
  })

  if (findDuplicateUsers.docs.length > 0 && data?.username !== originalDoc.username) {
    throw new ValidationError({
      errors: [
        {
          message: `A user with the username "${value}" already exists.`,
          path: 'username',
        },
      ],
    })
  }

  return value
}