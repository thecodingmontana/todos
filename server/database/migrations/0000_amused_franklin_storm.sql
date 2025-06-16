-- ✅ Safe enum creation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'syncStatusEnum') THEN
    CREATE TYPE "public"."syncStatusEnum" AS ENUM('PENDING', 'SYNCED', 'FAILED', 'DIRTY');
  END IF;
END$$;
-- statement-breakpoint

-- cron_jobs table
CREATE TABLE "cron_jobs" (
  "id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);
-- statement-breakpoint

-- oauth_account table
CREATE TABLE "oauth_account" (
  "id" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL,
  "provider" text NOT NULL,
  "provider_user_id" text NOT NULL,
  "createdAt" timestamp (3) DEFAULT now() NOT NULL,
  "updated_at" timestamp (3)
);
-- statement-breakpoint

-- session table
CREATE TABLE "session" (
  "id" varchar(255) PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "expires_at" timestamp with time zone NOT NULL
);
-- statement-breakpoint

-- todos table
CREATE TABLE "todos" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "is_completed" boolean DEFAULT false NOT NULL,
  "user_id" text NOT NULL,
  "syncStatus" "syncStatusEnum" DEFAULT 'PENDING' NOT NULL,
  "createdAt" timestamp (3) DEFAULT now() NOT NULL,
  "updated_at" timestamp (3)
);
-- statement-breakpoint

-- user table
CREATE TABLE "user" (
  "id" text PRIMARY KEY NOT NULL,
  "email" varchar(255) NOT NULL,
  "username" varchar(255) NOT NULL,
  "avatar" text NOT NULL,
  "createdAt" timestamp (3) DEFAULT now() NOT NULL,
  "updated_at" timestamp (3),
  CONSTRAINT "user_email_unique" UNIQUE("email")
);
-- statement-breakpoint

-- foreign keys
ALTER TABLE "oauth_account"
  ADD CONSTRAINT "oauth_account_userId_user_id_fk"
  FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
-- statement-breakpoint

ALTER TABLE "session"
  ADD CONSTRAINT "session_user_id_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
-- statement-breakpoint

ALTER TABLE "todos"
  ADD CONSTRAINT "todos_user_id_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
-- statement-breakpoint

-- indexes
CREATE INDEX "name_index" ON "todos" USING btree ("name");
-- statement-breakpoint

CREATE INDEX "email_index" ON "user" USING btree ("email");
