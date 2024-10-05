ALTER TABLE "user_answers" DROP CONSTRAINT "user_answers_question_id_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "user_answers" ALTER COLUMN "question_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
