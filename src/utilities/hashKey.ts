import crypto from 'crypto'

export const hashAPIKey = (key: string): string => {
  return crypto.createHash('sha256').update(key).digest('hex')
}
