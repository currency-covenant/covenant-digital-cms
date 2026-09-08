import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const logAuditAfterChange: CollectionAfterChangeHook = async ({
  req,
  operation,
  doc,
  previousDoc,
}) => {
  const collectionSlug = (req as any)?.collection?.config?.slug as string | undefined
  if (!collectionSlug) return

  if (collectionSlug === 'audit-logs' || collectionSlug === 'webhooks' || collectionSlug === 'api-keys') return

  if (operation !== 'create' && operation !== 'update') return

  const diff: Record<string, any> = {}
  if (previousDoc && operation === 'update') {
    for (const key of Object.keys(doc)) {
      if (key === 'updatedAt' || key === 'id') continue
      const oldVal = JSON.stringify(previousDoc[key])
      const newVal = JSON.stringify(doc[key])
      if (oldVal !== newVal) {
        diff[key] = { from: previousDoc[key], to: doc[key] }
      }
    }
  }

  try {
    await req.payload.create({
      collection: 'audit-logs',
      data: {
        action: operation,
        collection: collectionSlug,
        docId: doc.id as string,
        diff: Object.keys(diff).length > 0 ? diff : undefined,
        user: req.user?.id || undefined,
        timestamp: new Date().toISOString(),
      },
      req,
      overrideAccess: true,
    })
  } catch {
    // Silently handle audit log failures
  }
}

export const logAuditAfterDelete: CollectionAfterDeleteHook = async ({
  req,
  doc,
}) => {
  const collectionSlug = (req as any)?.collection?.config?.slug as string | undefined
  if (!collectionSlug) return

  if (collectionSlug === 'audit-logs' || collectionSlug === 'webhooks' || collectionSlug === 'api-keys') return

  try {
    await req.payload.create({
      collection: 'audit-logs',
      data: {
        action: 'delete',
        collection: collectionSlug,
        docId: doc.id as string,
        user: req.user?.id || undefined,
        timestamp: new Date().toISOString(),
      },
      req,
      overrideAccess: true,
    })
  } catch {
    // Silently handle audit log failures
  }
}
