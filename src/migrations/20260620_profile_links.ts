import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_profile_links_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__profile_links_v_version_status" AS ENUM('draft', 'published');
    ALTER TYPE "public"."enum_tenants_permissions" ADD VALUE IF NOT EXISTS 'profile-links' BEFORE 'media';

    CREATE TABLE "profile_links" (
      "id" serial PRIMARY KEY NOT NULL,
      "tenant_id" integer,
      "title" varchar NOT NULL,
      "url" varchar NOT NULL,
      "link_type" varchar NOT NULL,
      "icon_set" varchar DEFAULT 'si',
      "icon_name" varchar,
      "hex_color" varchar DEFAULT '#FFFFFF',
      "cover_image_id" integer,
      "order" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_profile_links_status" DEFAULT 'draft'
    );

    CREATE TABLE "_profile_links_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_tenant_id" integer,
      "version_title" varchar,
      "version_url" varchar,
      "version_link_type" varchar,
      "version_icon_set" varchar DEFAULT 'si',
      "version_icon_name" varchar,
      "version_hex_color" varchar DEFAULT '#FFFFFF',
      "version_cover_image_id" integer,
      "version_order" numeric DEFAULT 0,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__profile_links_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean
    );

    ALTER TABLE "profile_links" ADD CONSTRAINT "profile_links_tenant_id_tenants_id_fk"
      FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "profile_links" ADD CONSTRAINT "profile_links_cover_image_id_media_id_fk"
      FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_profile_links_v" ADD CONSTRAINT "_profile_links_v_parent_id_profile_links_id_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."profile_links"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_profile_links_v" ADD CONSTRAINT "_profile_links_v_version_tenant_id_tenants_id_fk"
      FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_profile_links_v" ADD CONSTRAINT "_profile_links_v_version_cover_image_id_media_id_fk"
      FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "profile_links_id" integer;

    CREATE INDEX "profile_links_tenant_idx" ON "profile_links" USING btree ("tenant_id");
    CREATE INDEX "profile_links_cover_image_idx" ON "profile_links" USING btree ("cover_image_id");
    CREATE INDEX "profile_links_updated_at_idx" ON "profile_links" USING btree ("updated_at");
    CREATE INDEX "profile_links_created_at_idx" ON "profile_links" USING btree ("created_at");
    CREATE INDEX "profile_links__status_idx" ON "profile_links" USING btree ("_status");

    CREATE INDEX "_profile_links_v_parent_idx" ON "_profile_links_v" USING btree ("parent_id");
    CREATE INDEX "_profile_links_v_version_version_tenant_idx" ON "_profile_links_v" USING btree ("version_tenant_id");
    CREATE INDEX "_profile_links_v_version_version_cover_image_idx" ON "_profile_links_v" USING btree ("version_cover_image_id");
    CREATE INDEX "_profile_links_v_version_version_updated_at_idx" ON "_profile_links_v" USING btree ("version_updated_at");
    CREATE INDEX "_profile_links_v_version_version_created_at_idx" ON "_profile_links_v" USING btree ("version_created_at");
    CREATE INDEX "_profile_links_v_version_version__status_idx" ON "_profile_links_v" USING btree ("version__status");
    CREATE INDEX "_profile_links_v_created_at_idx" ON "_profile_links_v" USING btree ("created_at");
    CREATE INDEX "_profile_links_v_updated_at_idx" ON "_profile_links_v" USING btree ("updated_at");
    CREATE INDEX "_profile_links_v_latest_idx" ON "_profile_links_v" USING btree ("latest");

    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_profile_links_fk"
      FOREIGN KEY ("profile_links_id") REFERENCES "public"."profile_links"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_profile_links_id_idx"
      ON "payload_locked_documents_rels" USING btree ("profile_links_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_profile_links_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_profile_links_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "profile_links_id";
    DROP TABLE "_profile_links_v" CASCADE;
    DROP TABLE "profile_links" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__profile_links_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_profile_links_status";
  `)
}
