/**
 * 🎯 PINIA GENRE STORE
 * 
 * This is your central state management for all genre data.
 * Think of it as a reactive "database" on the frontend.
 * 
 * COMPOSITION API STORE PATTERN:
 * - ref() = state (reactive data)
 * - computed() = getters (derived state)
 * - function = actions (methods that modify state)
 * 
 * Learn more: https://pinia.vuejs.org/core-concepts/
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Genre, GenreElement, GenreRelationship } from '@/lib/database.types'
import { 
  fetchAllGenres, 
  fetchRootGenres,
  fetchGenreById,
  fetchGenreRelationships,
  fetchGenreElements,
  fetchGenreElementsByGenreId 
} from '@/lib/genreQueries'

export const useGenreStore = defineStore('genre', () => {
  // ============================================================================
  // STATE (reactive data)
  // ============================================================================
  
  // All genres (root + subgenres)
  const genres = ref<Genre[]>([])
  
  // All relationships between genres (for graph edges)
  const relationships = ref<GenreRelationship[]>([])
  
  // All genre elements (acid, breakbeat, etc.)
  const elements = ref<GenreElement[]>([])
  
  // Currently selected genre (for detail view)
  const selectedGenre = ref<Genre | null>(null)
  
  // Elements for the selected genre
  const selectedGenreElements = ref<any[]>([])
  
  // Loading states (for showing spinners)
  const loading = ref({
    genres: false,
    relationships: false,
    elements: false,
    selectedGenre: false
  })
  
  // Error states (for showing error messages)
  const error = ref<string | null>(null)
  
  // ============================================================================
  // GETTERS (computed/derived state)
  // ============================================================================
  
  /**
   * Get only root genres (is_root = true)
   * These are shown in the initial graph view
   */
  const rootGenres = computed(() => {
    return genres.value.filter(g => g.is_root)
  })
  
  /**
   * Get only subgenres (is_root = false)
   */
  const subgenres = computed(() => {
    return genres.value.filter(g => !g.is_root)
  })
  
  /**
   * Find a genre by ID
   * Useful for looking up genre details quickly
   */
  const getGenreById = computed(() => {
    return (id: number) => genres.value.find(g => g.id === id)
  })
  
  /**
   * 🎯 TODO: Create a getter that returns subgenres for a given parent ID
   * 
   * HINT: Use relationships array to find connections where parent_genre_id matches
   * Then map those to actual genre objects from the genres array
   * 
   * Example return:
   * getSubgenresByParentId.value(1) // Returns all subgenres of Techno
   */
  const getSubgenresByParentId = computed(() => {
    return (parentId: number) => {
      // TODO: Implement this
      console.warn('TODO: Implement getSubgenresByParentId getter')
      return []
    }
  })
  
  // ============================================================================
  // ACTIONS (methods that modify state)
  // ============================================================================
  
  /**
   * Fetch all genres from Supabase
   * Call this when the app loads
   */
  async function loadGenres() {
    loading.value.genres = true
    error.value = null
    
    try {
      genres.value = await fetchAllGenres()
    } catch (e) {
      error.value = 'Failed to load genres'
      console.error(e)
    } finally {
      loading.value.genres = false
    }
  }
  
  /**
   * Fetch all genre relationships (graph edges)
   */
  async function loadRelationships() {
    loading.value.relationships = true
    error.value = null
    
    try {
      relationships.value = await fetchGenreRelationships()
    } catch (e) {
      error.value = 'Failed to load relationships'
      console.error(e)
    } finally {
      loading.value.relationships = false
    }
  }
  
  /**
   * Fetch all genre elements
   */
  async function loadElements() {
    loading.value.elements = true
    error.value = null
    
    try {
      elements.value = await fetchGenreElements()
    } catch (e) {
      error.value = 'Failed to load elements'
      console.error(e)
    } finally {
      loading.value.elements = false
    }
  }
  
  /**
   * Load all data at once (convenience method)
   * Call this in your App.vue or router
   */
  async function loadAllData() {
    await Promise.all([
      loadGenres(),
      loadRelationships(),
      loadElements()
    ])
  }
  
  /**
   * Select a genre (when clicking on graph node)
   * This loads the genre details and its elements
   */
  async function selectGenre(genreId: number) {
    loading.value.selectedGenre = true
    error.value = null
    
    try {
      // First try to find in already-loaded genres
      let genre = genres.value.find(g => g.id === genreId)
      
      // If not found, fetch from database
      if (!genre) {
        genre = await fetchGenreById(genreId)
      }
      
      selectedGenre.value = genre || null
      
      // Load elements for this genre
      if (genre) {
        selectedGenreElements.value = await fetchGenreElementsByGenreId(genreId)
      }
    } catch (e) {
      error.value = 'Failed to load genre details'
      console.error(e)
    } finally {
      loading.value.selectedGenre = false
    }
  }
  
  /**
   * 🎯 TODO: Implement an action to select genre by NAME instead of ID
   * 
   * This is useful for the graph component where you emit node names.
   * HINT: Find the genre in genres array by name, then call selectGenre()
   */
  async function selectGenreByName(name: string) {
    // TODO: Implement this
    console.warn('TODO: Implement selectGenreByName action')
  }
  
  /**
   * Clear selected genre (when closing detail view)
   */
  function clearSelection() {
    selectedGenre.value = null
    selectedGenreElements.value = []
  }
  
  // ============================================================================
  // RETURN (expose state and methods to components)
  // ============================================================================
  
  return {
    // State
    genres,
    relationships,
    elements,
    selectedGenre,
    selectedGenreElements,
    loading,
    error,
    
    // Getters
    rootGenres,
    subgenres,
    getGenreById,
    getSubgenresByParentId,
    
    // Actions
    loadGenres,
    loadRelationships,
    loadElements,
    loadAllData,
    selectGenre,
    selectGenreByName,
    clearSelection
  }
})

/**
 * 🎯 LEARNING CHECKPOINT:
 * 
 * Using the store in a component (we'll do this next!):
 * 
 * <script setup lang="ts">
 * import { useGenreStore } from '@/stores/genreStore'
 * import { onMounted } from 'vue'
 * 
 * const genreStore = useGenreStore()
 * 
 * onMounted(() => {
 *   genreStore.loadAllData()
 * })
 * </script>
 * 
 * <template>
 *   <div v-if="genreStore.loading.genres">Loading...</div>
 *   <div v-else>
 *     <div v-for="genre in genreStore.rootGenres" :key="genre.id">
 *       {{ genre.name }}
 *     </div>
 *   </div>
 * </template>
 */

