CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';
CREATE DATABASE database;
GRANT ALL PRIVILEGES ON DATABASE database TO postgres;

\connect database

CREATE TABLE IF NOT EXISTS "test_history" (
  id SERIAL NOT NULL,

  PRIMARY KEY ("id")
);

ALTER TABLE "test_history" ADD COLUMN "data" JSONB NOT NULL DEFAULT '{}'::jsonb;
