import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateShelfItem: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/shelf-items/${doc.slug}`

      payload.logger.info(`Revalidating shelf item at path: ${path}`)

      revalidatePath(path)
      revalidateTag('shelf-items-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/shelf-items/${previousDoc.slug}`

      payload.logger.info(`Revalidating old shelf item at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('shelf-items-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/shelf-items/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('shelf-items-sitemap')
  }

  return doc
}
