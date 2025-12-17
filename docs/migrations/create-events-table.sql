-- Create events table for DJ sets and calendar events
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_description TEXT,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  set_description TEXT,
  venue TEXT,
  venue_address TEXT,
  event_link TEXT, -- URL to event page/tickets
  cover_image TEXT, -- URL to cover image
  status TEXT DEFAULT 'confirmed', -- 'confirmed', 'tentative', 'cancelled'
  genre_ids INTEGER[], -- Array of genre IDs referencing genres table
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date_status ON events(date, status);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_events_updated_at();

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (events are public)
CREATE POLICY "Anyone can read events" 
  ON events FOR SELECT 
  TO public 
  USING (true);

-- Create policy for authenticated users to manage events
CREATE POLICY "Authenticated users can manage events" 
  ON events FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Optional: Add comments for documentation
COMMENT ON TABLE events IS 'Stores DJ sets and calendar events';
COMMENT ON COLUMN events.status IS 'Event status: confirmed, tentative, cancelled';
COMMENT ON COLUMN events.genre_ids IS 'Array of genre IDs referencing the genres table';

