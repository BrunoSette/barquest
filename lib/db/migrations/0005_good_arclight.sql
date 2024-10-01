ALTER TABLE "questions" RENAME COLUMN "is_approved" TO "isapproved";--> statement-breakpoint
ALTER TABLE "test_history" ADD COLUMN "type" integer;