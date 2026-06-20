import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Fix versions array table: wrong column types (id should be serial, missing _uuid)
    DROP TABLE IF EXISTS "_links_profile_v_version_social_links" CASCADE;

    CREATE TABLE "_links_profile_v_version_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "url" varchar NOT NULL,
      "icon_type" "enum__links_profile_v_version_social_links_icon_type" DEFAULT 'auto',
      "icon_id" integer,
      "_uuid" varchar
    );

    ALTER TABLE "_links_profile_v_version_social_links"
      ADD CONSTRAINT "_links_profile_v_version_social_links_parent_id__links_profile_v_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_links_profile_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_links_profile_v_version_social_links"
      ADD CONSTRAINT "_links_profile_v_version_social_links_icon_id_media_id_fk"
      FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX "_links_profile_v_version_social_links_parent_idx"
      ON "_links_profile_v_version_social_links" USING btree ("_parent_id");
    CREATE INDEX "_links_profile_v_version_social_links_icon_idx"
      ON "_links_profile_v_version_social_links" USING btree ("icon_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No-op: the dev server will create the correct version
}
