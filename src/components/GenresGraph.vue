<template>
  <div class="graph-container" ref="graphContainer">
    <!-- Loading state -->
    <div v-if="genreStore.loading.genres" class="loading-overlay">
      <p>Loading genres...</p>
    </div>
    
    <v-network-graph
      v-else
      class="graph"
      :nodes="nodes"
      :edges="edges"
      :layouts="layouts"
      :event-handlers="eventHandlers"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 🎯 COMPOSITION API - GenresGraph Component
 * 
 * This component builds a network graph from Supabase data dynamically.
 * 
 * KEY CONCEPTS:
 * - ref() for DOM references
 * - computed() for derived reactive data
 * - Watchers to rebuild graph when store data changes
 * 
 * GRAPH STRUCTURE:
 * - Central node (empty) connects to all root genres
 * - Root genres can expand to show subgenres (TODO for you!)
 * - Layout uses circular positioning
 */

import { ref, computed, watch, onMounted } from 'vue'
import { VNetworkGraph, type Nodes, type Edges, type Layouts } from 'v-network-graph'
import type * as vNG from 'v-network-graph'
import { useGenreStore } from '@/stores/genreStore'

// Get store instance
const genreStore = useGenreStore()

// DOM reference
const graphContainer = ref<HTMLElement | null>(null)

/**
 * 🎯 COMPUTED: Dynamic Nodes
 * 
 * Builds nodes object from Pinia store data.
 * Nodes include a central node + all root genres
 * 
 * TODO: Expand this to include subgenres when a genre is selected
 */
const nodes = computed<Nodes>(() => {
  const nodeMap: Nodes = {
    center: { name: '' } // Central node
  }
  
  // Add all root genres
  genreStore.rootGenres.forEach(genre => {
    nodeMap[genre.name] = { 
      name: genre.name,
      color: genre.color || '#ee7129'
    }
  })
  
  // TODO: If a genre is selected, add its subgenres
  // Hint: Use genreStore.selectedGenre and getSubgenresByParentId
  
  return nodeMap
})

/**
 * 🎯 COMPUTED: Dynamic Edges
 * 
 * Creates connections between nodes.
 * Currently connects center to all root genres.
 * 
 * TODO: Add edges for genre relationships (subgenres, influences, etc.)
 */
const edges = computed<Edges>(() => {
  const edgeMap: Edges = {}
  let edgeCount = 0
  
  // Connect center to all root genres
  genreStore.rootGenres.forEach(genre => {
    edgeMap[`edge${edgeCount++}`] = {
      source: 'center',
      target: genre.name
    }
  })
  
  // TODO: Add edges from genre_relationships table
  // genreStore.relationships.forEach(rel => { ... })
  
  return edgeMap
})

/**
 * 🎯 COMPUTED: Dynamic Layouts
 * 
 * Positions nodes in a circular pattern around the center.
 * Uses trigonometry for circular arrangement!
 */
const layouts = computed<Layouts>(() => {
  const layoutMap: Layouts = {
    nodes: {
      center: { x: 0, y: 0 }
    }
  }
  
  const rootGenres = genreStore.rootGenres
  const angleStep = (2 * Math.PI) / rootGenres.length
  const radius = 120
  
  rootGenres.forEach((genre, index) => {
    const angle = index * angleStep - Math.PI / 2 // Start at top
    layoutMap.nodes[genre.name] = {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    }
  })
  
  // TODO: Position subgenres in an outer ring or connected to parents
  
  return layoutMap
})

/**
 * 🎯 EVENT HANDLERS
 * 
 * Handle node clicks to select genres and show details
 */
const eventHandlers: vNG.EventHandlers = {
  'node:click': ({ node }) => {
    // Don't select the center node
    if (node === 'center') return
    
    // Find genre by name and select it in the store
    const genre = genreStore.genres.find(g => g.name === node)
    if (genre) {
      genreStore.selectGenre(genre.id)
    }
  },
  
  // TODO: Add hover tooltip showing BPM range and quick info
  // 'node:pointerover': ({ node }) => {
  //   // Show tooltip with genre.description
  // },
  // 'node:pointerout': ({ node }) => {
  //   // Hide tooltip
  // }
}

/**
 * Load data when component mounts
 */
onMounted(() => {
  genreStore.loadAllData()
})

/**
 * 🎯 LEARNING NOTE: Composition API Benefits
 * 
 * Compare this to the old class-based component:
 * ✓ All logic is grouped by feature (nodes, edges, layouts)
 * ✓ No "this" keyword confusion
 * ✓ TypeScript auto-complete works perfectly
 * ✓ Can extract logic into composables if needed
 * ✓ Easier to test (just functions!)
 */
</script>

<style>
/* Use some global styles outside of inline styles for container and backgrounds */
template {
  height: 100%;
}

.graph-container {
  position: relative;
  margin: auto;
  width: 600px;
  height: 400px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dddddd33;
  border-radius: 4%;
  color: #999;
}

.graph {
  width: 100%;
  height: 100%;
  background: #dddddd33;
  border-radius: 4%;
}

.graph-container circle {
  background-color: #ee7129dd;
  fill: #ee7129dd !important;
  opacity: 1;
  cursor: pointer;
  transition: opacity 0.2s;
}

.graph-container circle:hover {
  opacity: 0.8;
}

.graph-container path {
  stroke: #ee7129dd !important;
  stroke-width: 2 !important;
  opacity: 0.1;
}
</style>
