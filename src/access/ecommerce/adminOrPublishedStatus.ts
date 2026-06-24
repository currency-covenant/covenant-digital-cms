import type { Access } from 'payload'

import { isEcommerceAdmin } from './utilities'

/**
 * Product read access: ecommerce admins see all, everyone else sees only published.
 */
export const adminOrPublishedStatus: Access = ({ req: { user } }) => {
  if (isEcommerceAdmin(user)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
