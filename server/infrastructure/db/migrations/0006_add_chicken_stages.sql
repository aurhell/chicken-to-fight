CREATE TABLE "chicken_stages" (
	"chicken_id" integer NOT NULL,
	"stage_id" text NOT NULL,
	"started_at" timestamp NOT NULL,
	CONSTRAINT "chicken_stages_chicken_id_stage_id_pk" PRIMARY KEY("chicken_id","stage_id")
);
--> statement-breakpoint
ALTER TABLE "chicken_stages" ADD CONSTRAINT "chicken_stages_chicken_id_chickens_id_fk" FOREIGN KEY ("chicken_id") REFERENCES "public"."chickens"("id") ON DELETE cascade ON UPDATE no action;