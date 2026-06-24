import type { Access } from 'payload'

import { isEcommerceAdmin } from './utilities'

/**
 * Atomic access checker that verifies if the user owns the document being accessed.
 * Returns a Where query to filter documents by the customer field.
 *
 * Ecommerce admins have full access, authenticated customers get filtered by
 * the customer field, and unauthenticated users are denied access.
 */
export const isDocumentOwner: Access = ({ req }) => {
  if (isEcommerceAdmin(req.user)) {
    return true
  }

  if (req.user?.id) {
    return {
      customer: {
        equals: req.user.id,
      },
    }
  }

  return false
}
