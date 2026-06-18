import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateWork: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/works/${doc.slug}`

      payload.logger.info(`Revalidating work at path: ${path}`)

      revalidatePath(path)
      revalidateTag('works-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/works/${previousDoc.slug}`

      payload.logger.info(`Revalidating old work at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('works-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/works/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('works-sitemap')
  }

  return doc
}
