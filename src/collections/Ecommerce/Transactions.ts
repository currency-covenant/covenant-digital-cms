import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

import { setTenantFromUser } from '@/hooks/setTenantFromUser'
import { triggerWebhookAfterChange, triggerWebhookAfterDelete } from '@/hooks/triggerWebhooks'
import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'

export const TransactionsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection?.admin,
    group: 'Ecommerce',
  },
  hooks: {
    beforeValidate: [setTenantFromUser],
    afterChange: [triggerWebhookAfterChange, logAuditAfterChange],
    afterDelete: [triggerWebhookAfterDelete, logAuditAfterDelete],
  },
})
