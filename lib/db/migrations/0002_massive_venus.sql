CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"question_text" text NOT NULL,
	"answer1" text NOT NULL,
	"answer2" text NOT NULL,
	"answer3" text NOT NULL,
	"answer4" text NOT NULL,
	"comments" text NOT NULL,
	"correct_answer" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
