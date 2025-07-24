UPDATE "shpe-website-2025_alumni"
SET "position" = 'Member'
WHERE "position" NOT IN (
  'President','Internal Vice President','Corporate Vice President',
  'Secretary','Marketing Vice President','Treasurer','Technology Chair',
  'Professional Development Chair','Projects Chair','Mentorship Chair',
  'Outreach Chair','Shpetinas Chair','Social Chair','Member'
);

ALTER TABLE "shpe-website-2025_alumni"
  ALTER COLUMN "position" TYPE "position"
    USING "position"::text::"position",
  ALTER COLUMN "position" SET DEFAULT 'Member';

ALTER TABLE "shpe-website-2025_members"
  ADD COLUMN "position" "position" NOT NULL DEFAULT 'Member';