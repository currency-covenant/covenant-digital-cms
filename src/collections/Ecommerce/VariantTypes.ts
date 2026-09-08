import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'

export const VariantTypesCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection?.admin,
    group: 'Ecommerce',
  },
  hooks: {
    afterChange: [logAuditAfterChange],
    afterDelete: [logAuditAfterDelete],
  },
})
