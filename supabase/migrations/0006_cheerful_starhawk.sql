CREATE TYPE "public"."active_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TABLE "shpe-website-2025_clothes_sizes" (
	"id" integer PRIMARY KEY NOT NULL,
	"S" integer DEFAULT 0,
	"M" integer DEFAULT 0,
	"L" integer DEFAULT 0,
	"XL" integer DEFAULT 0,
	"XXL" integer DEFAULT 0,
	"XXXL" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" DROP CONSTRAINT "shpe-website-2025_products_category_unique";--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" ALTER COLUMN "category" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" ALTER COLUMN "category" SET DEFAULT 'Accessories';--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" ALTER COLUMN "image" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" ALTER COLUMN "description" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" ALTER COLUMN "stock" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shpe-website-2025_members" ADD COLUMN "square_customer_id" varchar(100);--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" ADD COLUMN "status" "active_status" DEFAULT 'Active' NOT NULL;--> statement-breakpoint
ALTER TABLE "shpe-website-2025_products" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "shpe-website-2025_clothes_sizes" ADD CONSTRAINT "shpe-website-2025_clothes_sizes_id_shpe-website-2025_products_id_fk" FOREIGN KEY ("id") REFERENCES "public"."shpe-website-2025_products"("id") ON DELETE cascade ON UPDATE no action;