import { Migration } from '@mikro-orm/migrations';

export class Migration20250804170432 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "book" ("id" text not null, "title" text not null, "author" integer not null, "cover" text not null, "series" text not null, "series_num" integer not null, "summary" text not null, "genres" text[] not null, "tags" text[] not null, "cws" text[] not null, "price" real not null, "status" text not null, "slug" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "book_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_book_deleted_at" ON "book" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "book_order" ("id" text not null, "status" text check ("status" in ('pending', 'sent')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "book_order_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_book_order_deleted_at" ON "book_order" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "book_bookorders" ("book_order_id" text not null, "book_id" text not null, constraint "book_bookorders_pkey" primary key ("book_order_id", "book_id"));`);

    this.addSql(`create table if not exists "digital_product_media" ("id" text not null, "type" text check ("type" in ('cover', 'preview', 'epub', 'pdf')) not null, "fileId" text not null, "mimeType" text not null, "book_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_product_media_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_product_media_book_id" ON "digital_product_media" (book_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_product_media_deleted_at" ON "digital_product_media" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "book_bookorders" add constraint "book_bookorders_book_order_id_foreign" foreign key ("book_order_id") references "book_order" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "book_bookorders" add constraint "book_bookorders_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "digital_product_media" add constraint "digital_product_media_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "book_bookorders" drop constraint if exists "book_bookorders_book_id_foreign";`);

    this.addSql(`alter table if exists "digital_product_media" drop constraint if exists "digital_product_media_book_id_foreign";`);

    this.addSql(`alter table if exists "book_bookorders" drop constraint if exists "book_bookorders_book_order_id_foreign";`);

    this.addSql(`drop table if exists "book" cascade;`);

    this.addSql(`drop table if exists "book_order" cascade;`);

    this.addSql(`drop table if exists "book_bookorders" cascade;`);

    this.addSql(`drop table if exists "digital_product_media" cascade;`);
  }

}
