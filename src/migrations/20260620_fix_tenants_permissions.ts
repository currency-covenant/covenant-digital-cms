import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "tenants_permissions" SET "value" = 'links-profile' WHERE "value" = 'social-links';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "tenants_permissions" SET "value" = 'social-links' WHERE "value" = 'links-profile';
  `)
}
