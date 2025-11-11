/**
 * 🎯 SUPABASE QUERY FUNCTIONS
 *
 * This file contains reusable functions for fetching data from Supabase.
 * These are the building blocks you'll use in your Pinia store.
 *
 * LEARNING PATTERN:
 * 1. supabase.from('table') - selects a table
 * 2. .select('columns') - what to fetch (* = everything)
 * 3. .eq('column', value) - filter by exact match
 * 4. Returns { data, error } - ALWAYS check for errors!
 *
 * Learn more: https://supabase.com/docs/reference/javascript/select
 */

import { supabase } from "./supabaseClient";
import type {
  Genre,
  GenreElement,
  GenreElementRelation,
  GenreRelationship,
} from "./database.types";

/**
 * Fetch all root genres (main genres like Techno, House, etc.)
 * These will be the first nodes in your graph visualization
 */
export async function fetchRootGenres() {
  const { data, error } = await supabase
    .from("genres")
    .select("*")
    .eq("is_root", true)
    .order("name");

  if (error) {
    console.error("Error fetching root genres:", error);
    return [];
  }

  return data as Genre[];
}

/**
 * Fetch all genres (both root and subgenres)
 */
export async function fetchAllGenres() {
  const { data, error } = await supabase.from("genres").select("*").order("name");

  if (error) {
    console.error("Error fetching all genres:", error);
    return [];
  }

  return data as Genre[];
}

/**
 * Fetch a single genre by ID
 * Used when you click on a node in the graph
 * 
 * 🎯 LEARNING: Type Safety with Nullable Returns
 * 
 * This function returns `Genre | null` because:
 * - Supabase might not find the genre (returns null)
 * - There could be a database error (we return null)
 * 
 * Why not throw errors instead?
 * - Returning null is more flexible for the caller
 * - They can decide how to handle missing data
 * - Throwing would require try/catch everywhere
 */
export async function fetchGenreById(id: number): Promise<Genre | null> {
  const { data, error } = await supabase.from("genres").select("*").eq("id", id).single(); // .single() expects exactly 1 result

  if (error) {
    console.error(`Error fetching genre ${id}:`, error);
    return null;
  }

  // data can be null if not found, so we handle it explicitly
  return data ? (data as Genre) : null;
}

/**
 * 🎯 TODO: Implement this function!
 *
 * Fetch all subgenres for a given parent genre ID
 * HINT: You'll need to:
 * 1. Query genre_relationships where parent_genre_id = parentId
 * 2. Join with genres table to get the actual genre data
 * 3. Use .select('genres(*), relationship_type') for the join
 *
 * Supabase JOIN syntax:
 * .select('relationship_type, genres!child_genre_id(*)')
 *
 * Learn about joins: https://supabase.com/docs/guides/database/joins-and-nesting
 */
export async function fetchSubgenres(parentId: number) {
  // TODO: Implement this query
  // const { data, error } = await supabase
  //   .from('genre_relationships')
  //   .select('relationship_type, genres!child_genre_id(*)')
  //   .eq('parent_genre_id', parentId)

  console.warn("TODO: Implement fetchSubgenres()");
  return [];
}

/**
 * Fetch all genre relationships (for building the graph)
 * Returns the edges/connections between nodes
 */
export async function fetchGenreRelationships() {
  const { data, error } = await supabase.from("genre_relationships").select("*");

  if (error) {
    console.error("Error fetching genre relationships:", error);
    return [];
  }

  return data as GenreRelationship[];
}

/**
 * Fetch all genre elements (acid, breakbeat, etc.)
 */
export async function fetchGenreElements() {
  const { data, error } = await supabase.from("genre_elements").select("*").order("name");

  if (error) {
    console.error("Error fetching genre elements:", error);
    return [];
  }

  return data as GenreElement[];
}

/**
 * 🎯 TODO: Implement this function!
 *
 * Fetch elements for a specific genre with their influence strength
 * HINT: Query genre_element_relations and join with genre_elements
 *
 * You want to return something like:
 * [
 *   { element: { name: 'Acid Sound', description: '...' }, influence_strength: 8 },
 *   { element: { name: 'Four-to-floor', description: '...' }, influence_strength: 10 }
 * ]
 */
export async function fetchGenreElementsByGenreId(genreId: number) {
  // TODO: Implement this query
  // const { data, error } = await supabase
  //   .from('genre_element_relations')
  //   .select('influence_strength, notes, genre_elements(*)')
  //   .eq('genre_id', genreId)
  //   .order('influence_strength', { ascending: false })

  console.warn("TODO: Implement fetchGenreElementsByGenreId()");
  return [];
}

/**
 * 🎯 LEARNING CHECKPOINT:
 * Once you've run the SQL schema, test these functions in your browser console:
 *
 * import { fetchRootGenres } from './lib/genreQueries'
 * const genres = await fetchRootGenres()
 * console.log(genres) // Should show your 5 root genres!
 */
