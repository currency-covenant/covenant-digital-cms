import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_tenants_permissions" ADD VALUE IF NOT EXISTS 'content-network' BEFORE 'media';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_tenants_permissions" DROP VALUE IF EXISTS 'content-network';
  `)
}
