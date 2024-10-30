CREATE TABLE IF NOT EXISTS "user_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"stripe_product_id" text,
	"stripe_product_name" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_products" ADD CONSTRAINT "user_products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
