CREATE TABLE "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"item" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "inventory_user_id_item_unique" UNIQUE("user_id","item")
);
--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
INSERT INTO "inventory" ("user_id", "item", "quantity") SELECT "id", 'water', "water" FROM "users";--> statement-breakpoint
INSERT INTO "inventory" ("user_id", "item", "quantity") SELECT "id", 'flour', "flour" FROM "users";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "water";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "flour";