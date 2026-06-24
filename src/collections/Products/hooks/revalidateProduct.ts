import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Product } from '../../../payload-types'

export const revalidateProduct: CollectionAfterChangeHook<Product> = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/products/${doc.slug}`

      revalidatePath(path)
      revalidateTag('products')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/products/${previousDoc.slug}`

      revalidatePath(oldPath)
      revalidateTag('products')
    }
  }
  return doc
}

export const revalidateProductDelete: CollectionAfterDeleteHook<Product> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    if (doc?.slug) {
      revalidatePath(`/products/${doc.slug}`)
      revalidateTag('products')
    }
  }

  return doc
}
