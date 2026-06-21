ALTER TABLE "chickens" ADD COLUMN "fed_at" timestamp;--> statement-breakpoint
ALTER TABLE "chickens" ADD COLUMN "watered_at" timestamp;--> statement-breakpoint
UPDATE "chickens" SET "fed_at" = NOW(), "watered_at" = NOW() WHERE "level" = 2;