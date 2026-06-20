import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "products_id" integer;
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "works_id" integer;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_products_id_idx"
    ON "payload_locked_documents_rels" USING btree ("products_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_works_id_idx"
    ON "payload_locked_documents_rels" USING btree ("works_id");
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_products_fk"
    FOREIGN KEY ("products_id")
    REFERENCES "public"."products"("id")
    ON DELETE cascade ON UPDATE no action;
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_works_fk"
    FOREIGN KEY ("works_id")
    REFERENCES "public"."works"("id")
    ON DELETE cascade ON UPDATE no action;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_products_fk";
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_works_fk";
  `)

  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_products_id_idx";
  `)

  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_works_id_idx";
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "products_id";
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "works_id";
  `)
}
