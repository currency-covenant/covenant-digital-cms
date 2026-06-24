import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'
import type { Plugin } from 'payload'

import { ProductsCollection } from '@/collections/Products'
import { OrdersCollection } from '@/collections/Orders'
import { CartsCollection } from '@/collections/Ecommerce/Carts'
import { TransactionsCollection } from '@/collections/Ecommerce/Transactions'
import { AddressesCollection } from '@/collections/Ecommerce/Addresses'
import { VariantsCollection } from '@/collections/Ecommerce/Variants'
import { VariantTypesCollection } from '@/collections/Ecommerce/VariantTypes'
import { VariantOptionsCollection } from '@/collections/Ecommerce/VariantOptions'

import { adminOnlyFieldAccess } from '@/access/ecommerce/adminOnlyFieldAccess'
import { adminOrPublishedStatus } from '@/access/ecommerce/adminOrPublishedStatus'
import { customerOnlyFieldAccess } from '@/access/ecommerce/customerOnlyFieldAccess'
import { isAdmin } from '@/access/ecommerce/isAdmin'
import { isCustomer } from '@/access/ecommerce/isCustomer'
import { isDocumentOwner } from '@/access/ecommerce/isDocumentOwner'
import { publicAccess } from '@/access/ecommerce/publicAccess'

export const ecommercePluginConfig: Plugin = ecommercePlugin({
  access: {
    adminOnlyFieldAccess,
    adminOrPublishedStatus,
    customerOnlyFieldAccess,
    isAdmin,
    isCustomer,
    isDocumentOwner,
    publicAccess,
  },
  customers: {
    slug: 'users',
  },
  orders: {
    ordersCollectionOverride: OrdersCollection,
  },
  products: {
    productsCollectionOverride: ProductsCollection,
    variants: {
      variantsCollectionOverride: VariantsCollection,
      variantTypesCollectionOverride: VariantTypesCollection,
      variantOptionsCollectionOverride: VariantOptionsCollection,
    },
  },
  carts: {
    cartsCollectionOverride: CartsCollection,
  },
  transactions: {
    transactionsCollectionOverride: TransactionsCollection,
  },
  addresses: {
    addressesCollectionOverride: AddressesCollection,
  },
  payments: {
    paymentMethods: [
      stripeAdapter({
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET || '',
      }),
    ],
  },
})
