/**
 * Event Query Functions
 *
 * Reusable functions for fetching event data from Supabase.
 * Used by the event store and components.
 */

import { supabase } from "./supabaseClient";
import type { Event, EventWithGenres, Genre } from "./database.types";

/**
 * Helper function to populate genres for events
 */
async function populateEventGenres(events: Event[]): Promise<EventWithGenres[]> {
  try {
    if (events.length === 0) return [];

    // Collect all unique genre IDs
    const genreIds = new Set<number>();
    events.forEach((event) => {
      if (event.genre_ids && Array.isArray(event.genre_ids)) {
        event.genre_ids.forEach((id) => genreIds.add(id));
      }
    });

    if (genreIds.size === 0) {
      return events.map((e) => ({ ...e, genres: [] }));
    }

    // Fetch all genres
    const { data: genres, error } = await supabase
      .from("genres")
      .select("id, name, color")
      .in("id", Array.from(genreIds));

    if (error) {
      console.error("Error fetching genres for events:", error);
      return events.map((e) => ({ ...e, genres: [] }));
    }

    // Create a map of genre ID to genre object
    const genreMap = new Map<number, Genre>();
    if (genres && Array.isArray(genres)) {
      genres.forEach((genre: any) => {
        if (genre && genre.id) {
          genreMap.set(genre.id, genre as Genre);
        }
      });
    }

    // Populate genres for each event
    return events.map((event) => ({
      ...event,
      genres:
        event.genre_ids && Array.isArray(event.genre_ids)
          ? event.genre_ids.map((id) => genreMap.get(id)).filter((g): g is Genre => g !== undefined)
          : [],
    }));
  } catch (e) {
    console.error("Exception in populateEventGenres:", e);
    // Return events without genres if there's an error
    return events.map((e) => ({ ...e, genres: [] }));
  }
}

/**
 * Fetch all events ordered by date (ascending) with genres populated
 */
export async function fetchAllEvents(): Promise<EventWithGenres[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching all events:", error);
      return [];
    }

    const events = (data as Event[]) ?? [];
    return await populateEventGenres(events);
  } catch (e) {
    console.error("Exception in fetchAllEvents:", e);
    return [];
  }
}

/**
 * Fetch upcoming events (date >= today) with genres populated
 */
export async function fetchUpcomingEvents(): Promise<EventWithGenres[]> {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }

  const events = (data as Event[]) ?? [];
  return await populateEventGenres(events);
}

/**
 * Fetch past events (date < today) with genres populated
 */
export async function fetchPastEvents(): Promise<EventWithGenres[]> {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .lt("date", today)
    .order("date", { ascending: false }); // Most recent first

  if (error) {
    console.error("Error fetching past events:", error);
    return [];
  }

  const events = (data as Event[]) ?? [];
  return populateEventGenres(events);
}

/**
 * Fetch a single event by ID with genres populated
 */
export async function fetchEventById(id: string): Promise<EventWithGenres | null> {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single();

  if (error) {
    console.error(`Error fetching event ${id}:`, error);
    return null;
  }

  if (!data) return null;

  const events = await populateEventGenres([data as Event]);
  return events[0] ?? null;
}

/**
 * Fetch events within a date range (inclusive) with genres populated
 * Used for calendar week view
 */
export async function fetchEventsByDateRange(
  startDate: string,
  endDate: string
): Promise<EventWithGenres[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching events by date range:", error);
    return [];
  }

  const events = (data as Event[]) ?? [];
  return populateEventGenres(events);
}

/**
 * Get the next upcoming event (first event with date >= today) with genres populated
 */
export async function fetchNextEvent(): Promise<EventWithGenres | null> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .eq("status", "confirmed") // Only confirmed events
    .order("date", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    // Not found is okay, return null
    if (error.code !== "PGRST116") {
      console.error("Error fetching next event:", error);
    }
    return null;
  }

  if (!data) return null;

  const events = await populateEventGenres([data as Event]);
  return events[0] ?? null;
}
