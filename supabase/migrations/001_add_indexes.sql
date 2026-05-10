-- Performance indexes for the CNPI URL shortener
-- Run via: Supabase dashboard > SQL editor, or `supabase db push`

-- Fast lookup of short/custom URLs during redirect
CREATE INDEX IF NOT EXISTS idx_urls_short_url ON urls (short_url);
CREATE INDEX IF NOT EXISTS idx_urls_custom_url ON urls (custom_url) WHERE custom_url IS NOT NULL;

-- Fast dashboard load: user's links sorted by newest
CREATE INDEX IF NOT EXISTS idx_urls_user_id_created_at ON urls (user_id, created_at DESC);

-- Fast analytics queries per link
CREATE INDEX IF NOT EXISTS idx_clicks_url_id_created_at ON clicks (url_id, created_at DESC);

-- Cascade delete: remove clicks when a URL is deleted.
-- Only run this if the FK constraint does not already exist.
-- Check first: SELECT conname FROM pg_constraint WHERE conname = 'fk_clicks_url_id';
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_clicks_url_id'
  ) THEN
    ALTER TABLE clicks
      ADD CONSTRAINT fk_clicks_url_id
      FOREIGN KEY (url_id) REFERENCES urls (id) ON DELETE CASCADE;
  END IF;
END;
$$;
