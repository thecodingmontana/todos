ALTER TABLE "user" RENAME COLUMN "profile_picture_url" TO "avatar";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "email_verified";