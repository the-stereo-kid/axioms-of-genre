/**
 * Database Types & Interfaces
 *
 * These TypeScript types match your Supabase schema.
 * In production, you'd generate these automatically with:
 * `supabase gen types typescript --project-id YOUR_PROJECT_ID`
 *
 * For learning, we're writing them manually to understand the structure.
 *
 * Learn more: https://supabase.com/docs/guides/api/rest/generating-types
 */

// Main genre type (root genres like Techno, House, etc.)
export interface Genre {
  id: number;
  name: string;
  bpm_min: number;
  bpm_max: number;
  description: string;
  color?: string;
  is_root: boolean; // True for main genres, false for subgenres
  soundcloud_links?: string[]; // Array of SoundCloud URLs (tracks, playlists, profiles)
  created_at?: string;
}

// Elements that define genres (e.g., "acid sound", "breakbeat", "sub bass")
export interface GenreElement {
  id: number;
  name: string;
  description: string;
  created_at?: string;
}

// How elements relate to genres (with influence strength)
export interface GenreElementRelation {
  id: number;
  genre_id: number;
  element_id: number;
  influence_strength: number; // 1-10 scale, how defining is this element?
  notes?: string;
  created_at?: string;
}

// How genres relate to each other (parent-child, influenced-by, etc.)
export interface GenreRelationship {
  id: number;
  parent_genre_id: number;
  child_genre_id: number;
  relationship_type: "subgenre" | "influenced_by" | "fusion" | "evolution";
  created_at?: string;
}

// Supabase Database type (used for type-safe queries)
export interface Database {
  public: {
    Tables: {
      genres: {
        Row: Genre;
        Insert: Omit<Genre, "id" | "created_at">;
        Update: Partial<Omit<Genre, "id" | "created_at">>;
      };
      genre_elements: {
        Row: GenreElement;
        Insert: Omit<GenreElement, "id" | "created_at">;
        Update: Partial<Omit<GenreElement, "id" | "created_at">>;
      };
      genre_element_relations: {
        Row: GenreElementRelation;
        Insert: Omit<GenreElementRelation, "id" | "created_at">;
        Update: Partial<Omit<GenreElementRelation, "id" | "created_at">>;
      };
      genre_relationships: {
        Row: GenreRelationship;
        Insert: Omit<GenreRelationship, "id" | "created_at">;
        Update: Partial<Omit<GenreRelationship, "id" | "created_at">>;
      };
    };
  };
}

/**
 * 🎯 LEARNING NOTE:
 * The Row/Insert/Update pattern is Supabase's type safety system:
 * - Row: What you GET from the database
 * - Insert: What you SEND to create new rows
 * - Update: What you SEND to modify existing rows
 *
 * Notice how Insert/Update omit 'id' and 'created_at'?
 * That's because the database generates these automatically!
 */
