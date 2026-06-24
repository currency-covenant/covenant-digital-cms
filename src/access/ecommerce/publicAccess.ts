import type { Access } from 'payload'

/**
 * Entirely public access. Defaults to returning true.
 */
export const publicAccess: Access = () => true
