import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import crypto from 'crypto'
import { extractID } from '@/utilities/extractID'

const getEventType = (
  operation: string,
  doc: any,
): string | null => {
  if (operation === 'create') return 'onCreate'
  if (operation === 'update') {
    if (doc._status === 'published') return 'onPublish'
    return 'onUpdate'
  }
  return null
}

const triggerWebhooksForDoc = async (
  req: any,
  collection: string,
  event: string,
  doc: any,
  previousDoc?: any,
) => {
  const tenantID = extractID(doc?.tenant)
  if (!tenantID) return

  try {
    const webhooks = await req.payload.find({
      collection: 'webhooks',
      where: {
        and: [
          { enabled: { equals: true } },
          { tenant: { equals: tenantID } },
          { events: { contains: event } },
          { collections: { contains: collection } },
        ],
      },
      depth: 0,
      limit: 100,
      overrideAccess: true,
    })

    if (webhooks.docs.length === 0) return

    const payload = JSON.stringify({
      event,
      collection,
      doc: {
        id: doc.id,
        slug: doc.slug,
        title: doc.title,
        _status: doc._status,
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt,
      },
      previousDoc: previousDoc
        ? {
            id: previousDoc.id,
            slug: previousDoc.slug,
            title: previousDoc.title,
            _status: previousDoc._status,
          }
        : undefined,
      timestamp: new Date().toISOString(),
    })

    for (const webhook of webhooks.docs) {
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(payload)
        .digest('hex')

      fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event,
        },
        body: payload,
      }).catch(() => {
        // Fire-and-forget: log failures silently
      })
    }
  } catch {
    // Silently handle webhook trigger errors
  }
}

export const triggerWebhookAfterChange: CollectionAfterChangeHook = async ({
  req,
  operation,
  doc,
  previousDoc,
}) => {
  const event = getEventType(operation, doc)
  if (!event) return

  const collection = (req as any)?.collection?.config?.slug as string | undefined
  if (!collection) return

  if (collection === 'webhooks' || collection === 'audit-logs') return

  triggerWebhooksForDoc(req, collection, event, doc, previousDoc)
}

export const triggerWebhookAfterDelete: CollectionAfterDeleteHook = async ({
  req,
  doc,
}) => {
  const collection = (req as any)?.collection?.config?.slug as string | undefined
  if (!collection) return
  if (collection === 'webhooks' || collection === 'audit-logs') return

  triggerWebhooksForDoc(req, collection, 'onDelete', doc)
}
