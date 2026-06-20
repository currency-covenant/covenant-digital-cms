import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_social_links_icon_type" AS ENUM('auto', 'custom');
  CREATE TYPE "public"."enum_social_links_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__social_links_v_version_icon_type" AS ENUM('auto', 'custom');
  CREATE TYPE "public"."enum__social_links_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_tenants_permissions" ADD VALUE 'authors' BEFORE 'media';
  ALTER TYPE "public"."enum_tenants_permissions" ADD VALUE 'social-links' BEFORE 'media';
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  ALTER TABLE "shelf_items_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "_shelf_items_v_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "social_links_id" integer;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_links" ADD CONSTRAINT "social_links_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_links" ADD CONSTRAINT "social_links_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_links_v" ADD CONSTRAINT "_social_links_v_parent_id_social_links_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."social_links"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_links_v" ADD CONSTRAINT "_social_links_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_links_v" ADD CONSTRAINT "_social_links_v_version_icon_id_media_id_fk" FOREIGN KEY ("version_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "authors_tenant_idx" ON "authors" USING btree ("tenant_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
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
  ALTER TABLE "shelf_items_rels" ADD CONSTRAINT "shelf_items_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shelf_items_v_rels" ADD CONSTRAINT "_shelf_items_v_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_links_fk" FOREIGN KEY ("social_links_id") REFERENCES "public"."social_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "shelf_items_rels_authors_id_idx" ON "shelf_items_rels" USING btree ("authors_id");
  CREATE INDEX "_shelf_items_v_rels_authors_id_idx" ON "_shelf_items_v_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_social_links_id_idx" ON "payload_locked_documents_rels" USING btree ("social_links_id");
  ALTER TABLE "shelf_items" DROP COLUMN "type";
  ALTER TABLE "_shelf_items_v" DROP COLUMN "version_type";
  DROP TYPE "public"."enum_shelf_items_type";
  DROP TYPE "public"."enum__shelf_items_v_version_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_shelf_items_type" AS ENUM('book', 'movie', 'tv-show', 'album');
  CREATE TYPE "public"."enum__shelf_items_v_version_type" AS ENUM('book', 'movie', 'tv-show', 'album');
  ALTER TABLE "authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_social_links_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "social_links" CASCADE;
  DROP TABLE "_social_links_v" CASCADE;
  ALTER TABLE "shelf_items_rels" DROP CONSTRAINT "shelf_items_rels_authors_fk";
  
  ALTER TABLE "_shelf_items_v_rels" DROP CONSTRAINT "_shelf_items_v_rels_authors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_authors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_social_links_fk";
  
  ALTER TABLE "tenants_permissions" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_tenants_permissions";
  CREATE TYPE "public"."enum_tenants_permissions" AS ENUM('pages', 'posts', 'products', 'works', 'shelf-items', 'shelf-categories', 'media', 'categories');
  ALTER TABLE "tenants_permissions" ALTER COLUMN "value" SET DATA TYPE "public"."enum_tenants_permissions" USING "value"::"public"."enum_tenants_permissions";
  DROP INDEX "shelf_items_rels_authors_id_idx";
  DROP INDEX "_shelf_items_v_rels_authors_id_idx";
  DROP INDEX "payload_locked_documents_rels_authors_id_idx";
  DROP INDEX "payload_locked_documents_rels_social_links_id_idx";
  ALTER TABLE "shelf_items" ADD COLUMN "type" "enum_shelf_items_type";
  ALTER TABLE "_shelf_items_v" ADD COLUMN "version_type" "enum__shelf_items_v_version_type";
  ALTER TABLE "shelf_items_rels" DROP COLUMN "authors_id";
  ALTER TABLE "_shelf_items_v_rels" DROP COLUMN "authors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "authors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "social_links_id";
  DROP TYPE "public"."enum_social_links_icon_type";
  DROP TYPE "public"."enum_social_links_status";
  DROP TYPE "public"."enum__social_links_v_version_icon_type";
  DROP TYPE "public"."enum__social_links_v_version_status";`)
}
