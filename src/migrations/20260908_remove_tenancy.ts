import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const TENANT_TABLES = [
  'addresses',
  'api_keys',
  'audit_logs',
  'authors',
  'carts',
  'categories',
  'content_network',
  'footer',
  'header',
  'links_profile',
  'media',
  'orders',
  'pages',
  'posts',
  'products',
  'profile_links',
  'shelf_categories',
  'shelf_items',
  'transactions',
  'variant_options',
  'variant_types',
  'variants',
  'webhooks',
]

const VERSION_TABLES = [
  '_content_network_v',
  '_links_profile_v',
  '_pages_v',
  '_posts_v',
  '_products_v',
  '_profile_links_v',
  '_shelf_items_v',
  '_variants_v',
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Remove all content for tenants other than lbdluxe (tenant_id = 10)
  for (const table of TENANT_TABLES) {
    await db.execute(sql`DELETE FROM ${sql.identifier(table)} WHERE "tenant_id" <> 10`)
  }
  for (const table of VERSION_TABLES) {
    await db.execute(sql`DELETE FROM ${sql.identifier(table)} WHERE "version_tenant_id" <> 10`)
  }
  await db.execute(sql`DELETE FROM "payload_locked_documents_rels" WHERE "tenants_id" IS NOT NULL`)

  // Drop tenant columns
  for (const table of TENANT_TABLES) {
    await db.execute(sql`ALTER TABLE ${sql.identifier(table)} DROP COLUMN "tenant_id"`)
  }
  for (const table of VERSION_TABLES) {
    await db.execute(sql`ALTER TABLE ${sql.identifier(table)} DROP COLUMN "version_tenant_id"`)
  }
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tenants_id"`)

  // Drop tenant tables (order avoids FK conflicts)
  await db.execute(sql`DROP TABLE "users_tenants_roles"`)
  await db.execute(sql`DROP TABLE "users_tenants"`)
  await db.execute(sql`DROP TABLE "tenants_permissions"`)
  await db.execute(sql`DROP TABLE "api_keys_roles"`)
  await db.execute(sql`DROP TABLE "tenants"`)

  // Drop orphaned enum types
  await db.execute(sql`DROP TYPE "public"."enum_users_tenants_roles"`)
  await db.execute(sql`DROP TYPE "public"."enum_tenants_permissions"`)
  await db.execute(sql`DROP TYPE "public"."enum_api_keys_roles"`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Recreate enum types
  await db.execute(sql`CREATE TYPE "public"."enum_tenants_permissions" AS ENUM(
    'pages','posts','products','works','shelf-items','shelf-categories','authors','links-profile','profile-links',
    'content-network','media','categories','orders','carts','transactions','addresses','variants','variantTypes','variantOptions','header'
  )`)
  await db.execute(sql`CREATE TYPE "public"."enum_users_tenants_roles" AS ENUM('tenant-admin','tenant-publisher','tenant-editor','tenant-viewer')`)
  await db.execute(sql`CREATE TYPE "public"."enum_api_keys_roles" AS ENUM('tenant-viewer','tenant-editor','tenant-publisher','tenant-admin')`)

  // Recreate tenants table
  await db.execute(sql`
    CREATE TABLE "tenants" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "domain" varchar,
      "slug" varchar NOT NULL,
      "allow_public_read" boolean DEFAULT false,
      "updated_at" timestamptz DEFAULT now() NOT NULL,
      "created_at" timestamptz DEFAULT now() NOT NULL
    )
  `)
  await db.execute(sql`CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at")`)
  await db.execute(sql`CREATE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug")`)
  await db.execute(sql`CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at")`)
  await db.execute(sql`CREATE INDEX "tenants_allow_public_read_idx" ON "tenants" USING btree ("allow_public_read")`)

  // Recreate users_tenants
  await db.execute(sql`
    CREATE TABLE "users_tenants" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "tenant_id" integer NOT NULL
    )
  `)
  await db.execute(sql`CREATE INDEX "users_tenants_order_idx" ON "users_tenants" USING btree ("_order")`)
  await db.execute(sql`CREATE INDEX "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id")`)
  await db.execute(sql`CREATE INDEX "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id")`)
  await db.execute(sql`ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "users"("id") ON DELETE CASCADE`)
  await db.execute(sql`ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL`)

  // Recreate users_tenants_roles
  await db.execute(sql`
    CREATE TABLE "users_tenants_roles" (
      "order" integer NOT NULL,
      "parent_id" varchar NOT NULL,
      "value" "enum_users_tenants_roles",
      "id" serial PRIMARY KEY NOT NULL
    )
  `)
  await db.execute(sql`CREATE INDEX "users_tenants_roles_order_idx" ON "users_tenants_roles" USING btree ("order")`)
  await db.execute(sql`CREATE INDEX "users_tenants_roles_parent_idx" ON "users_tenants_roles" USING btree ("parent_id")`)
  await db.execute(sql`ALTER TABLE "users_tenants_roles" ADD CONSTRAINT "users_tenants_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "users_tenants"("id") ON DELETE CASCADE`)

  // Recreate tenants_permissions
  await db.execute(sql`
    CREATE TABLE "tenants_permissions" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum_tenants_permissions",
      "id" serial PRIMARY KEY NOT NULL
    )
  `)
  await db.execute(sql`CREATE INDEX "tenants_permissions_order_idx" ON "tenants_permissions" USING btree ("order")`)
  await db.execute(sql`CREATE INDEX "tenants_permissions_parent_idx" ON "tenants_permissions" USING btree ("parent_id")`)
  await db.execute(sql`ALTER TABLE "tenants_permissions" ADD CONSTRAINT "tenants_permissions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "tenants"("id") ON DELETE CASCADE`)

  // Recreate api_keys_roles
  await db.execute(sql`
    CREATE TABLE "api_keys_roles" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum_api_keys_roles",
      "id" serial PRIMARY KEY NOT NULL
    )
  `)
  await db.execute(sql`CREATE INDEX "api_keys_roles_order_idx" ON "api_keys_roles" USING btree ("order")`)
  await db.execute(sql`CREATE INDEX "api_keys_roles_parent_idx" ON "api_keys_roles" USING btree ("parent_id")`)
  await db.execute(sql`ALTER TABLE "api_keys_roles" ADD CONSTRAINT "api_keys_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "api_keys"("id") ON DELETE CASCADE`)

  // Re-add tenant columns
  for (const table of TENANT_TABLES) {
    await db.execute(sql`ALTER TABLE ${sql.identifier(table)} ADD COLUMN "tenant_id" integer`)
    await db.execute(sql`CREATE INDEX ${sql.identifier(`${table}_tenant_idx`)} ON ${sql.identifier(table)} USING btree ("tenant_id")`)
    await db.execute(sql`ALTER TABLE ${sql.identifier(table)} ADD CONSTRAINT ${sql.identifier(`${table}_tenant_id_tenants_id_fk`)} FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL`)
  }
  for (const table of VERSION_TABLES) {
    await db.execute(sql`ALTER TABLE ${sql.identifier(table)} ADD COLUMN "version_tenant_id" integer`)
    await db.execute(sql`CREATE INDEX ${sql.identifier(`${table}_version_version_tenant_idx`)} ON ${sql.identifier(table)} USING btree ("version_tenant_id")`)
    await db.execute(sql`ALTER TABLE ${sql.identifier(table)} ADD CONSTRAINT ${sql.identifier(`${table}_version_tenant_id_tenants_id_fk`)} FOREIGN KEY ("version_tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL`)
  }
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tenants_id" integer`)
  await db.execute(sql`CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id")`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "tenants"("id") ON DELETE CASCADE`)
}
