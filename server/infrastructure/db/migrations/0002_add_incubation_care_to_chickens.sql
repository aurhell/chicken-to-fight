ALTER TABLE "chickens" ADD COLUMN "humidity_adjusted_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "chickens" ADD COLUMN "temperature_adjusted_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "chickens" ADD COLUMN "turned_at" timestamp DEFAULT now() NOT NULL;