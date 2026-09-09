import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE TYPE "public"."enum__pages_v_blocks_work_grid_items_link_display" AS ENUM('both', 'website', 'repo')`)
  await db.execute(
    sql`ALTER TABLE "_pages_v_blocks_work_grid_items" ADD COLUMN "link_display" "public"."enum__pages_v_blocks_work_grid_items_link_display" DEFAULT 'both' NOT NULL`
  )

  await db.execute(sql`CREATE TYPE "public"."enum_pages_blocks_work_grid_items_link_display" AS ENUM('both', 'website', 'repo')`)
  await db.execute(
    sql`ALTER TABLE "pages_blocks_work_grid_items" ADD COLUMN "link_display" "public"."enum_pages_blocks_work_grid_items_link_display" DEFAULT 'both' NOT NULL`
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_work_grid_items" DROP COLUMN "link_display"`)
  await db.execute(sql`DROP TYPE "public"."enum__pages_v_blocks_work_grid_items_link_display"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_work_grid_items" DROP COLUMN "link_display"`)
  await db.execute(sql`DROP TYPE "public"."enum_pages_blocks_work_grid_items_link_display"`)
}