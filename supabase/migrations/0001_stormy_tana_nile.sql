
DROP TABLE IF EXISTS "shpe-website-2025_members" CASCADE;

--> statement-breakpoint
CREATE TABLE "shpe-website-2025_members" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"ucf_id" integer NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"email" varchar(100) NOT NULL,
	"image" varchar(2048),
	"bio" text,
	"resume" varchar(2048),
	"is_member" boolean DEFAULT false,
	CONSTRAINT "shpe-website-2025_members_ucf_id_unique" UNIQUE("ucf_id"),
	CONSTRAINT "shpe-website-2025_members_email_unique" UNIQUE("email")
);