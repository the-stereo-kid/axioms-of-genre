<template>
  <div class="detail-container">
    <!-- Loading state -->
    <div v-if="genreStore.loading.selectedGenre" class="loading">Loading genre details...</div>

    <!-- Genre details -->
    <div v-else-if="displayGenre" class="genre-detail">
      <!-- Dictionary-style definition -->
      <div class="definition-section">
        <p class="definition-text">
          <span class="font-bold">{{ displayGenre.name }}</span
          ><sub>n.</sub>
          <span v-if="displayGenre.name === 'Groovy Techno'" class="text-gray-400"
            >/ˈɡruː.vi ˈtɛk.noʊ/</span
          >
          <br />
          <span class="block pl-4">{{ displayGenre.description }}</span>
        </p>
      </div>

      <!-- BPM Range -->
      <div class="bpm-range">
        <span class="label">BPM Range:</span>
        <span class="value"> {{ displayGenre.bpm_min }} - {{ displayGenre.bpm_max }} </span>
      </div>

      <!-- Genre Elements Section -->
      <div v-if="sortedElements.length > 0" class="elements-section">
        <h3>Elements</h3>
        <ul class="elements-list">
          <li
            v-for="(element, index) in sortedElements"
            :key="`${element.genre_elements?.id ?? element.genre_elements?.name ?? index}`"
            class="element-item"
          >
            <div class="element-name">
              {{ element.genre_elements?.name ?? "Element" }}
            </div>
            <p class="element-description">
              {{ element.genre_elements?.description ?? "No description yet." }}
            </p>
          </li>
        </ul>
      </div>

      <!-- SoundCloud Section -->
      <div v-if="soundcloudLinks.length > 0" class="soundcloud-section">
        <h3>SoundCloud</h3>
        <div class="soundcloud-content">
          <!-- Embedded tracks -->
          <div
            v-for="(link, index) in trackLinks"
            :key="`track-${index}`"
            class="soundcloud-embed-wrapper"
          >
            <iframe
              :src="getSoundCloudEmbedUrl(link)"
              :title="`SoundCloud track ${index + 1}`"
              class="soundcloud-embed"
              allow="autoplay"
              frameborder="0"
            ></iframe>
          </div>
          <!-- Clickable playlists/profiles -->
          <div v-if="playlistLinks.length > 0" class="soundcloud-links">
            <a
              v-for="(link, index) in playlistLinks"
              :key="`playlist-${index}`"
              :href="link"
              target="_blank"
              rel="noopener noreferrer"
              class="soundcloud-link"
            >
              View Playlist {{ index + 1 > 1 ? index + 1 : "" }} on SoundCloud
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 🎯 COMPOSITION API - GenresDetail Component
 *
 * Shows genre details with dictionary-style definitions, elements, and SoundCloud embeds.
 * Defaults to showing "Groovy Techno" when no genre is selected.
 */

import { computed, onMounted } from "vue";
import { useGenreStore } from "@/stores/genreStore";
import { isSoundCloudTrack, getSoundCloudEmbedUrl } from "@/lib/soundcloudUtils";
import type { Genre } from "@/lib/database.types";

// Get the genre store instance
const genreStore = useGenreStore();

// Load Groovy Techno by default on mount if nothing is selected
onMounted(async () => {
  if (!genreStore.selectedGenre) {
    const groovyTechno = genreStore.genres.find((g) => g.name === "Groovy Techno");
    if (groovyTechno) {
      await genreStore.selectGenre(groovyTechno.id);
    }
  }
});

// Display the selected genre or Groovy Techno as default
const displayGenre = computed<Genre | null>(() => {
  if (genreStore.selectedGenre) {
    return genreStore.selectedGenre;
  }
  // Fallback to Groovy Techno if nothing selected
  return genreStore.genres.find((g) => g.name === "Groovy Techno") ?? null;
});

// Get genre elements sorted by influence strength (highest to lowest)
const genreElements = computed(() => genreStore.selectedGenreElements ?? []);

const sortedElements = computed(() => {
  return [...genreElements.value].sort((a, b) => {
    const aStrength = a.influence_strength ?? 0;
    const bStrength = b.influence_strength ?? 0;
    return bStrength - aStrength; // Descending order
  });
});

// Separate SoundCloud links into tracks (embeddable) and playlists (links)
const soundcloudLinks = computed(() => {
  return displayGenre.value?.soundcloud_links ?? [];
});

const trackLinks = computed(() => {
  return soundcloudLinks.value.filter((link) => isSoundCloudTrack(link));
});

const playlistLinks = computed(() => {
  return soundcloudLinks.value.filter((link) => !isSoundCloudTrack(link));
});
</script>

<style scoped>
.detail-container {
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background: rgba(221, 221, 221, 0.2);
  border-radius: 4%;
  min-height: 300px;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .detail-container {
    padding: 1.5rem;
  }
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

/* Dictionary-style definition matching hero banner */
.definition-section {
  margin-bottom: 2rem;
}

.definition-text {
  line-height: 1.8;
  color: #ccc;
  font-size: 1rem;
}

.definition-text .font-bold {
  font-weight: bold;
  color: #fff;
}

.definition-text sub {
  font-size: 0.75em;
  vertical-align: baseline;
  color: #999;
  margin-left: 0.25rem;
}

.definition-text .text-gray-400 {
  color: #999;
  margin-left: 0.5rem;
}

.definition-text .block {
  display: block;
  margin-top: 0.5rem;
}

.definition-text .pl-4 {
  padding-left: 1rem;
}

.bpm-range {
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

@media (min-width: 640px) {
  .bpm-range {
    font-size: 1.2rem;
  }
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

/* Elements section */
.elements-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.elements-section h3 {
  color: #ee7129;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

@media (min-width: 640px) {
  .elements-section h3 {
    font-size: 1.5rem;
  }
}

.elements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.element-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 4px;
}

.element-name {
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.element-description {
  color: #ccc;
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
}

/* SoundCloud section */
.soundcloud-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.soundcloud-section h3 {
  color: #ee7129;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

@media (min-width: 640px) {
  .soundcloud-section h3 {
    font-size: 1.5rem;
  }
}

.soundcloud-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.soundcloud-embed-wrapper {
  width: 100%;
  margin-bottom: 1rem;
}

.soundcloud-embed {
  width: 100%;
  height: 166px;
  border-radius: 4px;
}

@media (min-width: 640px) {
  .soundcloud-embed {
    height: 300px;
  }
}

.soundcloud-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.soundcloud-link {
  color: #ee7129;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(238, 113, 41, 0.3);
  border-radius: 4px;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 0.9rem;
}

.soundcloud-link:hover {
  background: rgba(238, 113, 41, 0.1);
  border-color: #ee7129;
  color: #ff8d48;
}

.soundcloud-link:active {
  transform: translateY(1px);
}
</style>
