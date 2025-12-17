/**
 * Event Store
 *
 * Central state management for calendar events.
 * Uses Pinia with Composition API pattern.
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Event, EventWithGenres } from "@/lib/database.types";
import {
  fetchAllEvents,
  fetchUpcomingEvents,
  fetchPastEvents,
  fetchEventById,
  fetchEventsByDateRange,
  fetchNextEvent,
} from "@/lib/eventQueries";

export const useEventStore = defineStore("event", () => {
  // ============================================================================
  // STATE (reactive data)
  // ============================================================================

  // All events (with genres populated)
  const events = ref<EventWithGenres[]>([]);

  // Currently selected event (for detail view)
  const selectedEvent = ref<EventWithGenres | null>(null);

  const hasLoaded = ref(false);

  // Loading states
  const loading = ref({
    events: false,
    selectedEvent: false,
  });

  // Error states
  const error = ref<string | null>(null);

  // ============================================================================
  // GETTERS (computed/derived state)
  // ============================================================================

  /**
   * Get only upcoming events (date >= today)
   */
  const upcomingEvents = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return events.value.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  });

  /**
   * Get only past events (date < today)
   */
  const pastEvents = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return events.value.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date)); // Most recent first
  });

  /**
   * Get the next upcoming event
   */
  const nextEvent = computed(() => {
    return upcomingEvents.value[0] ?? null;
  });

  /**
   * Find an event by ID
   */
  const getEventById = computed(() => {
    return (id: string) => events.value.find((e) => e.id === id);
  });

  /**
   * Get events for a specific date
   */
  const getEventsByDate = computed(() => {
    return (date: string) => {
      return events.value.filter((e) => e.date === date);
    };
  });

  /**
   * Get events within a date range
   */
  const getEventsByDateRange = computed(() => {
    return (startDate: string, endDate: string) => {
      return events.value.filter((e) => e.date >= startDate && e.date <= endDate);
    };
  });

  // ============================================================================
  // ACTIONS (methods that modify state)
  // ============================================================================

  /**
   * Fetch all events from Supabase
   */
  async function loadEvents() {
    loading.value.events = true;
    error.value = null;

    try {
      console.log("Loading events...");
      const fetchedEvents = await fetchAllEvents();
      console.log("Fetched events:", fetchedEvents.length);
      events.value = fetchedEvents;
      hasLoaded.value = true;
    } catch (e) {
      error.value = "Failed to load events";
      console.error("Error loading events:", e);
    } finally {
      loading.value.events = false;
      console.log("Loading complete, loading state:", loading.value.events);
    }
  }

  /**
   * Select an event (when clicking on card or calendar day)
   */
  async function selectEvent(eventId: string) {
    loading.value.selectedEvent = true;
    error.value = null;

    try {
      // First try to find in already-loaded events
      let event: EventWithGenres | null | undefined = events.value.find((e) => e.id === eventId);

      // If not found, fetch from database
      if (!event) {
        event = await fetchEventById(eventId);
      }

      selectedEvent.value = event ?? null;
    } catch (e) {
      error.value = "Failed to load event details";
      console.error(e);
    } finally {
      loading.value.selectedEvent = false;
    }
  }

  /**
   * Clear selected event
   */
  function clearSelection() {
    selectedEvent.value = null;
  }

  /**
   * Load events for a specific date range (for calendar view)
   */
  async function loadEventsByDateRange(startDate: string, endDate: string): Promise<void> {
    // Don't set loading state here to avoid conflicts with main loadEvents
    error.value = null;

    try {
      const rangeEvents = await fetchEventsByDateRange(startDate, endDate);
      // Merge with existing events, avoiding duplicates
      const existingIds = new Set(events.value.map((e) => e.id));
      const newEvents = rangeEvents.filter((e) => !existingIds.has(e.id));
      events.value = [...events.value, ...newEvents].sort((a, b) => a.date.localeCompare(b.date));
    } catch (e) {
      error.value = "Failed to load events for date range";
      console.error("Error loading events by date range:", e);
      throw e; // Re-throw so caller can handle it
    }
  }

  // ============================================================================
  // RETURN (expose state and methods to components)
  // ============================================================================

  return {
    // State
    events,
    selectedEvent,
    hasLoaded,
    loading,
    error,

    // Getters
    upcomingEvents,
    pastEvents,
    nextEvent,
    getEventById,
    getEventsByDate,
    getEventsByDateRange,

    // Actions
    loadEvents,
    selectEvent,
    clearSelection,
    loadEventsByDateRange,
  };
});
