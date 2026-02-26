-- Migration: Add avatar selection to users
-- This adds an avatarId field to allow users to choose from preset avatar options
-- DO NOT RUN THIS MIGRATION YET - REVIEW FIRST

ALTER TABLE "users"
ADD COLUMN "avatarId" TEXT DEFAULT 'dev';

-- Update existing users to have default avatar
UPDATE "users" SET "avatarId" = 'dev' WHERE "avatarId" IS NULL;