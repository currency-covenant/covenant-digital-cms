import type { FieldHook } from 'payload'
import crypto from 'crypto'
import { hashAPIKey } from '@/utilities/hashKey'

export const generateKey: FieldHook = ({ value, operation, req }) => {
  if (operation === 'create') {
    const rawKey = `cms_${crypto.randomBytes(32).toString('hex')}`
    req.context.rawKey = rawKey
    return hashAPIKey(rawKey)
  }
  return value
}
