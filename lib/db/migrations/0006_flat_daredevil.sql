ALTER TABLE "test_history" RENAME COLUMN "type" TO "questionmode";--> statement-breakpoint
ALTER TABLE "test_history" ALTER COLUMN "questionmode" SET DATA TYPE varchar(50);