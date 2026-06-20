import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_social_links_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_social_links_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "social_links_id";
    DROP TABLE IF EXISTS "_social_links_v" CASCADE;
    DROP TABLE IF EXISTS "social_links" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__social_links_v_version_icon_type";
    DROP TYPE IF EXISTS "public"."enum__social_links_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_social_links_icon_type";
    DROP TYPE IF EXISTS "public"."enum_social_links_status";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_social_links_icon_type" AS ENUM('auto', 'custom');
    CREATE TYPE "public"."enum_social_links_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__social_links_v_version_icon_type" AS ENUM('auto', 'custom');
    CREATE TYPE "public"."enum__social_links_v_version_status" AS ENUM('draft', 'published');
    CREATE TABLE "social_links" (
      "id" serial PRIMARY KEY NOT NULL,
      "tenant_id" integer,
      "title" varchar,
      "url" varchar,
      "icon_type" "enum_social_links_icon_type" DEFAULT 'auto',
      "icon_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_social_links_status" DEFAULT 'draft'
    );
    CREATE TABLE "_social_links_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_tenant_id" integer,
      "version_title" varchar,
      "version_url" varchar,
      "version_icon_type" "enum__social_links_v_version_icon_type" DEFAULT 'auto',
      "version_icon_id" integer,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__social_links_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean
    );
    ALTER TABLE "social_links" ADD CONSTRAINT "social_links_tenant_id_tenants_id_fk"
      FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "social_links" ADD CONSTRAINT "social_links_icon_id_media_id_fk"
      FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_social_links_v" ADD CONSTRAINT "_social_links_v_parent_id_social_links_id_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."social_links"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_social_links_v" ADD CONSTRAINT "_social_links_v_version_tenant_id_tenants_id_fk"
      FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_social_links_v" ADD CONSTRAINT "_social_links_v_version_icon_id_media_id_fk"
      FOREIGN KEY ("version_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "social_links_id" integer;
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_social_links_fk"
      FOREIGN KEY ("social_links_id") REFERENCES "public"."social_links"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "social_links_tenant_idx" ON "social_links" USING btree ("tenant_id");
    CREATE INDEX "social_links_icon_idx" ON "social_links" USING btree ("icon_id");
    CREATE INDEX "social_links_updated_at_idx" ON "social_links" USING btree ("updated_at");
    CREATE INDEX "social_links_created_at_idx" ON "social_links" USING btree ("created_at");
    CREATE INDEX "social_links__status_idx" ON "social_links" USING btree ("_status");
    CREATE INDEX "_social_links_v_parent_idx" ON "_social_links_v" USING btree ("parent_id");
    CREATE INDEX "_social_links_v_version_version_tenant_idx" ON "_social_links_v" USING btree ("version_tenant_id");
    CREATE INDEX "_social_links_v_version_version_icon_idx" ON "_social_links_v" USING btree ("version_icon_id");
    CREATE INDEX "_social_links_v_version_version_updated_at_idx" ON "_social_links_v" USING btree ("version_updated_at");
    CREATE INDEX "_social_links_v_version_version_created_at_idx" ON "_social_links_v" USING btree ("version_created_at");
    CREATE INDEX "_social_links_v_version_version__status_idx" ON "_social_links_v" USING btree ("version__status");
    CREATE INDEX "_social_links_v_created_at_idx" ON "_social_links_v" USING btree ("created_at");
    CREATE INDEX "_social_links_v_updated_at_idx" ON "_social_links_v" USING btree ("updated_at");
    CREATE INDEX "_social_links_v_latest_idx" ON "_social_links_v" USING btree ("latest");
    CREATE INDEX "payload_locked_documents_rels_social_links_id_idx" ON "payload_locked_documents_rels" USING btree ("social_links_id");
  `)
}
