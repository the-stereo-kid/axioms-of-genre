<template>
  <div class="detail-container">
    <!-- Loading state -->
    <div v-if="genreStore.loading.selectedGenre" class="loading">Loading genre details...</div>

    <!-- Genre details -->
    <div v-else-if="genreStore.selectedGenre" class="genre-detail">
      <h2 class="genre-title">{{ genreStore.selectedGenre.name }}</h2>

      <!-- BPM Range -->
      <div class="bpm-range">
        <span class="label">BPM Range:</span>
        <span class="value">
          {{ genreStore.selectedGenre.bpm_min }} - {{ genreStore.selectedGenre.bpm_max }}
        </span>
      </div>

      <!-- Description -->
      <p class="description">{{ genreStore.selectedGenre.description }}</p>

      <!-- Genre Elements Section -->
      <div v-if="genreElements.length > 0" class="elements-section">
        <h3>Genre Elements</h3>
        <div class="elements-grid">
          <div
            v-for="(element, index) in genreElements"
            :key="`${element.genre_elements?.id ?? element.genre_elements?.name ?? index}`"
            class="element-card"
          >
            <div class="element-name">
              {{ element.genre_elements?.name ?? "Element" }}
            </div>
            <div class="element-details">
              <p class="element-description">
                {{ element.genre_elements?.description ?? "No description yet." }}
              </p>
              <div class="influence-row" v-if="element.influence_strength != null">
                <div
                  class="influence-bar"
                  :style="{
                    width: Math.min(Math.max(element.influence_strength, 0), 10) * 10 + '%',
                  }"
                ></div>
                <span class="influence-value">{{ element.influence_strength }}/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Genres Section -->
      <div class="related-genres-section">
        <h3>Related Genres</h3>
        <div v-if="!hasRelatedGenres" class="todo-note">
          No direct parent or subgenres linked yet. Add relationships to see them here.
        </div>
        <div v-else class="related-grid">
          <div v-if="parentGenres.length" class="related-column">
            <h4>Parent Genres</h4>
            <ul>
              <li v-for="genre in parentGenres" :key="genre.id">
                {{ genre.name }}
              </li>
            </ul>
          </div>
          <div v-if="subgenres.length" class="related-column">
            <h4>Subgenres</h4>
            <ul>
              <li v-for="genre in subgenres" :key="genre.id">
                {{ genre.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <p>Click on a genre node to see details</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 🎯 COMPOSITION API - GenresDetail Component
 *
 * KEY CONCEPTS:
 * - <script setup>: Simplified syntax, no need for export default
 * - No props definition needed, use defineProps() if you have props
 * - Direct access to store via useGenreStore()
 * - Template has direct access to store without "this."
 *
 * Learn more: https://vuejs.org/api/sfc-script-setup.html
 */

import { computed } from "vue";
import { useGenreStore } from "@/stores/genreStore";

// Get the genre store instance
const genreStore = useGenreStore();

const genreElements = computed(() => genreStore.selectedGenreElements ?? []);

const subgenres = computed(() => {
  if (!genreStore.selectedGenre) return [];
  return genreStore.getSubgenresByParentId(genreStore.selectedGenre.id);
});

const parentGenres = computed(() => {
  if (!genreStore.selectedGenre) return [];
  return genreStore.getParentGenresByChildId(genreStore.selectedGenre.id);
});

const hasRelatedGenres = computed(() => {
  return subgenres.value.length + parentGenres.value.length > 0;
});

/**
 * 🎯 LEARNING NOTE:
 * Notice how much simpler this is than the class-based component!
 * - No "this" keyword
 * - No Options API ceremony (data, methods, computed)
 * - Store data is directly reactive in the template
 * - TypeScript works perfectly with auto-completion
 */
</script>

<style scoped>
.detail-container {
  width: 50%;
  margin: 2rem auto;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  min-height: 300px;
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.genre-detail {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.genre-title {
  color: #ee7129;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.bpm-range {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.label {
  font-weight: bold;
  color: #999;
  margin-right: 0.5rem;
}

.value {
  color: #ddd;
  font-family: "Courier New", monospace;
}

.description {
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #ccc;
}

/* TODO Styles */
.elements-section,
.related-genres-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.elements-section h3,
.related-genres-section h3 {
  color: #ee7129;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.todo-note {
  color: #666;
  font-style: italic;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-left: 3px solid #ee7129;
  margin: 1rem 0;
}

/* Element card styles (for when you implement it) */
.elements-grid {
  display: grid;
  gap: 1rem;
}

.element-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.element-name {
  flex: 0 0 150px;
  font-weight: bold;
}

.influence-bar {
  height: 8px;
  background: linear-gradient(90deg, #ee7129, #ff9e64);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.influence-value {
  color: #999;
  font-size: 0.9rem;
}
</style>
