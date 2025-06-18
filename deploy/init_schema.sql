CREATE TABLE IF NOT EXISTS "test_history" (
  id SERIAL NOT NULL,

  PRIMARY KEY ("id")
);

ALTER TABLE "test_history" ADD COLUMN "data" JSONB NOT NULL DEFAULT '{}'::jsonb;
