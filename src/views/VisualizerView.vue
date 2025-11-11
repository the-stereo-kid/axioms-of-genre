<template>
  <div class="visualizer-view">
    <div class="header">
      <h1>Genre Visualization</h1>
      <p class="subtitle">Explore the relationships between electronic music genres</p>
    </div>

    <!-- Graph visualization -->
    <GenresGraph />

    <!-- Genre detail view (controlled by Pinia store) -->
    <GenresDetail />
  </div>
</template>

<script setup lang="ts">
/**
 * 🎯 COMPOSITION API - VisualizerView
 *
 * This is now super simple! The complexity moved to:
 * - GenresGraph: Handles visualization and node selection
 * - GenresDetail: Displays selected genre from store
 * - genreStore: Manages all state
 *
 * BEFORE (Class Component):
 * - Hardcoded genre data in Map
 * - Manual event handling with @node-selected
 * - Prop drilling to detail component
 *
 * AFTER (Composition API + Pinia):
 * - Data comes from Supabase via store
 * - Components communicate through shared store
 * - No prop drilling needed!
 *
 * This is the power of centralized state management!
 */

import GenresGraph from "@/components/GenresGraph.vue";
import GenresDetail from "@/components/GenresDetail.vue";

/**
 * 🎯 LEARNING NOTE: Component Communication
 *
 * OLD WAY (Props & Events):
 * Parent ← @event ← Child ← props → Parent
 *
 * NEW WAY (Pinia Store):
 * Component A → Store ← Component B
 *
 * Benefits:
 * - No prop drilling through multiple levels
 * - No event chain management
 * - Single source of truth
 * - Easy to debug with DevTools
 */
</script>

<style scoped>
.visualizer-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #999;
  font-size: 1.1rem;
}
</style>
