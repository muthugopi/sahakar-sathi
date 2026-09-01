-- Switch the knowledge-chunk embedding column from 384 to 512 dimensions to
-- match Voyage's voyage-3-lite (its only supported output size). Existing
-- 384-dim vectors cannot be cast in place, so they're cleared here; the
-- ingestion scripts re-embed and repopulate every chunk on next run.
TRUNCATE TABLE "DocumentChunk";
ALTER TABLE "DocumentChunk" ALTER COLUMN "embedding" TYPE vector(512);
