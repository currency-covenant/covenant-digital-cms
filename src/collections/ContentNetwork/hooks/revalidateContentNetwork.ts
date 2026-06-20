import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateContentNetwork: CollectionAfterChangeHook = ({
  doc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    payload.logger.info('Revalidating content-network')
    revalidateTag('content-network-sitemap')
  }
}

export const revalidateDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload },
}) => {
  payload.logger.info('Revalidating content-network')
  revalidateTag('content-network-sitemap')
}
