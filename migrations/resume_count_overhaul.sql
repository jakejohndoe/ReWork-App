-- Resume Count Business Logic Overhaul
-- Changes from active count to lifetime tracking with monthly resets

-- Add new columns to users table
ALTER TABLE "users" ADD COLUMN "totalResumesCreated" INTEGER DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "monthlyResumesCreated" INTEGER DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "resumeCountResetAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Migrate existing data: set totalResumesCreated to current resumesCreated
UPDATE "users" SET "totalResumesCreated" = "resumesCreated";
UPDATE "users" SET "monthlyResumesCreated" = "resumesCreated";
UPDATE "users" SET "resumeCountResetAt" = DATE_TRUNC('month', CURRENT_TIMESTAMP);

-- Note: After migration, update application logic to:
-- 1. Increment both totalResumesCreated and monthlyResumesCreated on new resume
-- 2. Check monthlyResumesCreated against plan limits (FREE=3, PREMIUM=unlimited)
-- 3. Reset monthlyResumesCreated to 0 on first resume creation each month
-- 4. Keep resumesCreated for backward compatibility (can remove later)