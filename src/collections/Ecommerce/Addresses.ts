import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

import { setTenantFromUser } from '@/hooks/setTenantFromUser'
import { logAuditAfterChange, logAuditAfterDelete } from '@/hooks/logAuditEvent'

export const AddressesCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection?.admin,
    group: 'Ecommerce',
  },
  hooks: {
    beforeValidate: [setTenantFromUser],
    afterChange: [logAuditAfterChange],
    afterDelete: [logAuditAfterDelete],
  },
})
