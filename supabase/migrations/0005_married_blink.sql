CREATE TABLE "shpe-website-2025_reset_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"code" varchar(6) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone NOT NULL,
	"used" boolean DEFAULT false,
	CONSTRAINT "shpe-website-2025_reset_codes_email_unique" UNIQUE("email")
);
