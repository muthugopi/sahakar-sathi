-- Add optional per-language overrides for content topics
ALTER TABLE "ContentTopic" ADD COLUMN "translations" JSONB;
