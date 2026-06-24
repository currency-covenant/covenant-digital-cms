import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

import { setTenantFromUser } from '@/hooks/setTenantFromUser'
import { triggerWebhookAfterChange, triggerWebhookAfterDelete } from '@/hooks/triggerWebhooks'
import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'

export const OrdersCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection?.admin,
    group: 'Ecommerce',
  },
  fields: [
    ...defaultCollection.fields,
    {
      name: 'accessToken',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' || !value) {
              return crypto.randomUUID()
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeValidate: [setTenantFromUser],
    afterChange: [triggerWebhookAfterChange, logAuditAfterChange],
    afterDelete: [triggerWebhookAfterDelete, logAuditAfterDelete],
  },
})
