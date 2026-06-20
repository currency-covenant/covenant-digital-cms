import type { Migration } from 'payload'

export const up: Migration = async ({ sql }) => {
  await sql.query`
    ALTER TYPE "public"."enum_tenants_permissions" ADD VALUE IF NOT EXISTS 'content-network' BEFORE 'media';
  `
}

export const down: Migration = async ({ sql }) => {
  await sql.query`
    ALTER TYPE "public"."enum_tenants_permissions" DROP VALUE IF EXISTS 'content-network';
  `
}
