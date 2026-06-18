CREATE TABLE "scratch_card_plays" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"grid" json NOT NULL,
	"won" boolean DEFAULT false NOT NULL,
	"played_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scratch_card_plays" ADD CONSTRAINT "scratch_card_plays_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;