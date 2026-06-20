import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_links_profile_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum_links_profile_social_links_icon_type" AS ENUM('auto', 'custom');
    CREATE TYPE "public"."enum__links_profile_v_version_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__links_profile_v_version_social_links_icon_type" AS ENUM('auto', 'custom');
    ALTER TYPE "public"."enum_tenants_permissions" ADD VALUE IF NOT EXISTS 'links-profile' BEFORE 'media';

    CREATE TABLE "links_profile" (
      "id" serial PRIMARY KEY NOT NULL,
      "tenant_id" integer,
      "name" varchar NOT NULL,
      "handle" varchar,
      "bio" varchar,
      "profile_image_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_links_profile_status" DEFAULT 'draft'
    );

    CREATE TABLE "links_profile_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "url" varchar NOT NULL,
      "icon_type" "enum_links_profile_social_links_icon_type" DEFAULT 'auto',
      "icon_id" integer
    );

    CREATE TABLE "_links_profile_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_tenant_id" integer,
      "version_name" varchar,
      "version_handle" varchar,
      "version_bio" varchar,
      "version_profile_image_id" integer,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__links_profile_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean
    );

    CREATE TABLE "_links_profile_v_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "url" varchar NOT NULL,
      "icon_type" "enum__links_profile_v_version_social_links_icon_type" DEFAULT 'auto',
      "icon_id" integer,
      "_uuid" varchar
    );

    ALTER TABLE "links_profile" ADD CONSTRAINT "links_profile_tenant_id_tenants_id_fk"
      FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "links_profile" ADD CONSTRAINT "links_profile_profile_image_id_media_id_fk"
      FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "links_profile_social_links" ADD CONSTRAINT "links_profile_social_links_parent_id_links_profile_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."links_profile"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "links_profile_social_links" ADD CONSTRAINT "links_profile_social_links_icon_id_media_id_fk"
      FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_links_profile_v" ADD CONSTRAINT "_links_profile_v_parent_id_links_profile_id_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."links_profile"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_links_profile_v" ADD CONSTRAINT "_links_profile_v_version_tenant_id_tenants_id_fk"
      FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_links_profile_v" ADD CONSTRAINT "_links_profile_v_version_profile_image_id_media_id_fk"
      FOREIGN KEY ("version_profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_links_profile_v_social_links" ADD CONSTRAINT "_links_profile_v_social_links_parent_id__links_profile_v_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_links_profile_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_links_profile_v_social_links" ADD CONSTRAINT "_links_profile_v_social_links_icon_id_media_id_fk"
      FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "links_profile_id" integer;

    CREATE INDEX "links_profile_tenant_idx" ON "links_profile" USING btree ("tenant_id");
    CREATE INDEX "links_profile_profile_image_idx" ON "links_profile" USING btree ("profile_image_id");
    CREATE INDEX "links_profile_updated_at_idx" ON "links_profile" USING btree ("updated_at");
    CREATE INDEX "links_profile_created_at_idx" ON "links_profile" USING btree ("created_at");
    CREATE INDEX "links_profile__status_idx" ON "links_profile" USING btree ("_status");

    CREATE INDEX "links_profile_social_links_parent_idx" ON "links_profile_social_links" USING btree ("_parent_id");
    CREATE INDEX "links_profile_social_links_icon_idx" ON "links_profile_social_links" USING btree ("icon_id");

    CREATE INDEX "_links_profile_v_parent_idx" ON "_links_profile_v" USING btree ("parent_id");
    CREATE INDEX "_links_profile_v_version_version_tenant_idx" ON "_links_profile_v" USING btree ("version_tenant_id");
    CREATE INDEX "_links_profile_v_version_version_profile_image_idx" ON "_links_profile_v" USING btree ("version_profile_image_id");
    CREATE INDEX "_links_profile_v_version_version_updated_at_idx" ON "_links_profile_v" USING btree ("version_updated_at");
    CREATE INDEX "_links_profile_v_version_version_created_at_idx" ON "_links_profile_v" USING btree ("version_created_at");
    CREATE INDEX "_links_profile_v_version_version__status_idx" ON "_links_profile_v" USING btree ("version__status");
    CREATE INDEX "_links_profile_v_created_at_idx" ON "_links_profile_v" USING btree ("created_at");
    CREATE INDEX "_links_profile_v_updated_at_idx" ON "_links_profile_v" USING btree ("updated_at");
    CREATE INDEX "_links_profile_v_latest_idx" ON "_links_profile_v" USING btree ("latest");

    CREATE INDEX "_links_profile_v_social_links_parent_idx" ON "_links_profile_v_social_links" USING btree ("_parent_id");
    CREATE INDEX "_links_profile_v_social_links_icon_idx" ON "_links_profile_v_social_links" USING btree ("icon_id");

    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_links_profile_fk"
      FOREIGN KEY ("links_profile_id") REFERENCES "public"."links_profile"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_links_profile_id_idx"
      ON "payload_locked_documents_rels" USING btree ("links_profile_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_links_profile_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_links_profile_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "links_profile_id";
    DROP TABLE "_links_profile_v_social_links" CASCADE;
    DROP TABLE "_links_profile_v" CASCADE;
    DROP TABLE "links_profile_social_links" CASCADE;
    DROP TABLE "links_profile" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__links_profile_v_version_social_links_icon_type";
    DROP TYPE IF EXISTS "public"."enum__links_profile_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_links_profile_social_links_icon_type";
    DROP TYPE IF EXISTS "public"."enum_links_profile_status";
  `)
}
