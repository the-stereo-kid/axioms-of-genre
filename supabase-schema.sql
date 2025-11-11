/**
 * 🎯 SUPABASE DATABASE SCHEMA
 * 
 * Copy and paste this entire file into your Supabase SQL Editor to create all tables.
 * Go to: Supabase Dashboard → SQL Editor → New Query
 * 
 * What's happening here:
 * 1. Creating tables with relationships (foreign keys)
 * 2. Enabling Row Level Security (RLS) - Supabase's security model
 * 3. Creating policies to allow anonymous reads
 * 4. Inserting sample data to get you started
 * 
 * Learn more about RLS: https://supabase.com/docs/guides/auth/row-level-security
 */

-- ============================================================================
-- TABLE 1: GENRES
-- ============================================================================
-- Main and sub genres (both stored here, differentiated by is_root)
CREATE TABLE IF NOT EXISTS genres (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  bpm_min INTEGER NOT NULL,
  bpm_max INTEGER NOT NULL,
  description TEXT NOT NULL,
  color TEXT, -- Hex color for visualization
  is_root BOOLEAN DEFAULT false, -- True for main genres like "Techno"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 2: GENRE ELEMENTS
-- ============================================================================
-- The building blocks of genres (e.g., "acid sound", "breakbeat", "sub bass")
CREATE TABLE IF NOT EXISTS genre_elements (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 3: GENRE ELEMENT RELATIONS
-- ============================================================================
-- How elements relate to genres with influence strength
CREATE TABLE IF NOT EXISTS genre_element_relations (
  id BIGSERIAL PRIMARY KEY,
  genre_id BIGINT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  element_id BIGINT NOT NULL REFERENCES genre_elements(id) ON DELETE CASCADE,
  influence_strength INTEGER CHECK (influence_strength >= 1 AND influence_strength <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(genre_id, element_id) -- Prevent duplicate relations
);

-- ============================================================================
-- TABLE 4: GENRE RELATIONSHIPS
-- ============================================================================
-- How genres relate to each other (for graph visualization)
CREATE TABLE IF NOT EXISTS genre_relationships (
  id BIGSERIAL PRIMARY KEY,
  parent_genre_id BIGINT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  child_genre_id BIGINT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (
    relationship_type IN ('subgenre', 'influenced_by', 'fusion', 'evolution')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_genre_id, child_genre_id, relationship_type)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Enable RLS on all tables (security first!)
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE genre_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE genre_element_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE genre_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public reads (but no writes without auth)
CREATE POLICY "Public can read genres" 
  ON genres FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Public can read genre_elements" 
  ON genre_elements FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Public can read genre_element_relations" 
  ON genre_element_relations FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Public can read genre_relationships" 
  ON genre_relationships FOR SELECT 
  TO anon 
  USING (true);

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================
-- Insert root genres (the main 5 from your original data)
INSERT INTO genres (name, bpm_min, bpm_max, description, color, is_root) VALUES
  ('Techno', 120, 140, 'Techno music is driven by a dependable kick and repetitive patterns', '#ee7129', true),
  ('House', 110, 130, 'House music is driven by a syncopated baseline and soulful grooves', '#4287f5', true),
  ('Trance', 130, 150, 'Trance music is driven by a galloping baseline and euphoric melodies', '#9c27b0', true),
  ('DnB', 160, 180, 'Drum and Bass music is driven by a kick-snare drum pattern and rolling basslines', '#00ff00', true),
  ('Dub', 70, 90, 'Dub music is driven by minimal elements and a deep baseline with heavy reverb', '#ff5722', true);

-- TODO: Add your subgenres here! Examples:
-- INSERT INTO genres (name, bpm_min, bpm_max, description, color, is_root) VALUES
--   ('Acid House', 118, 128, 'House with Roland TB-303 acid basslines', '#ff6b6b', false),
--   ('Psy-Trance', 135, 145, 'Trance with psychedelic elements and rolling basslines', '#ae63e4', false),
--   ('Minimal Techno', 125, 135, 'Stripped-back techno with focus on groove and texture', '#ff9e64', false);

-- Insert some genre elements (the building blocks)
INSERT INTO genre_elements (name, description) VALUES
  ('Acid Sound', 'Roland TB-303 squelchy basslines, signature of acid house'),
  ('Breakbeat', 'Syncopated drum patterns, often sampled from funk'),
  ('Sub Bass', 'Deep low-frequency basslines felt more than heard'),
  ('Rolling Bass', 'Continuous moving bassline pattern common in DnB and Psy'),
  ('Four-to-floor', 'Steady kick on every beat, foundation of house and techno');

-- TODO: Connect elements to genres with influence strength (1-10)
-- Examples:
-- INSERT INTO genre_element_relations (genre_id, element_id, influence_strength, notes) VALUES
--   (1, 5, 10, 'Four-to-floor is THE defining element of Techno'),
--   (2, 1, 8, 'Acid sound created the acid house subgenre'),
--   (2, 5, 9, 'Four-to-floor is essential to house music');

-- TODO: Create genre relationships (for the graph!)
-- Examples:
-- INSERT INTO genre_relationships (parent_genre_id, child_genre_id, relationship_type) VALUES
--   (2, <acid_house_id>, 'subgenre'),  -- House → Acid House
--   (3, <psy_trance_id>, 'subgenre');  -- Trance → Psy-Trance

/**
 * 🎯 YOUR LEARNING TASKS:
 * 
 * 1. Run this SQL in Supabase SQL Editor
 * 2. Check the Table Editor to see your data
 * 3. Add 2-3 subgenres you know well
 * 4. Add connections between elements and genres
 * 5. Create parent-child relationships for the graph
 * 
 * 💡 TIP: Start simple! Add just a couple subgenres first, 
 *    then expand as you get comfortable with the relationships.
 */

