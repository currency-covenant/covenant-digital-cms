import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import crypto from 'crypto'
import { isSuperAdmin, isSuperAdminAccess } from '@/access/isSuperAdmin'
import { hashAPIKey } from '@/utilities/hashKey'
import { generateKey } from './hooks/generateKey'

export const APIKeys: CollectionConfig = {
  slug: 'api-keys',
  admin: {
    useAsTitle: 'name',
    group: 'System',
  },
  access: {
    create: isSuperAdminAccess,
    read: isSuperAdminAccess,
    update: isSuperAdminAccess,
    delete: isSuperAdminAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [generateKey],
      },
      access: {
        read: () => false,
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lastUsedAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  endpoints: [
    {
      path: '/generate',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('Unauthorized', 401)
        }

        if (!isSuperAdmin(req.user)) {
          throw new APIError('Only super admins can generate API keys', 403)
        }

        let data: { [key: string]: any } = {}
        if (typeof req.json === 'function') {
          data = await req.json()
        }
        const { name } = data

        if (!name) {
          throw new APIError('Name is required', 400)
        }

        const rawKey = `cms_${crypto.randomBytes(32).toString('hex')}`
        const hashedKey = hashAPIKey(rawKey)

        const doc = await req.payload.create({
          collection: 'api-keys',
          data: {
            name,
            key: hashedKey,
          },
          req,
          overrideAccess: true,
        })

        return Response.json({
          id: doc.id,
          name: doc.name,
          rawKey,
        })
      },
    },
    {
      path: '/authenticate',
      method: 'post',
      handler: async (req) => {
        let data: { [key: string]: any } = {}
        if (typeof req.json === 'function') {
          data = await req.json()
        }
        const { apiKey } = data

        if (!apiKey) {
          throw new APIError('API key is required', 400)
        }

        const hashedKey = hashAPIKey(apiKey)

        const result = await req.payload.find({
          collection: 'api-keys',
          where: {
            key: {
              equals: hashedKey,
            },
          },
          depth: 1,
          limit: 1,
          overrideAccess: true,
        })

        const keyDoc = result.docs[0]
        if (!keyDoc) {
          throw new APIError('Invalid API key', 401)
        }

        if (keyDoc.expiresAt && new Date(keyDoc.expiresAt) < new Date()) {
          throw new APIError('API key has expired', 401)
        }

        await req.payload.update({
          collection: 'api-keys',
          id: keyDoc.id,
          data: {
            lastUsedAt: new Date().toISOString(),
          },
          overrideAccess: true,
        })

        return Response.json({
          valid: true,
          keyId: keyDoc.id,
          name: keyDoc.name,
        })
      },
    },
  ],
}