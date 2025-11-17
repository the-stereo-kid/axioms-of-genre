<template>
  <main class="mx-auto flex min-h-[70vh] max-w-5xl flex-col gap-12 px-6 py-16 text-left">
    <header class="space-y-4">
      <p class="text-sm uppercase tracking-[0.35em] text-gray-400">Visualization</p>
      <h1 class="text-4xl font-semibold text-white leading-tight">Axioms of Genre</h1>
      <p class="max-w-2xl text-base text-gray-300 leading-relaxed">
        An interactive map of the music I love, listen to and DJ. Showcasing my personal musical
        taste and set offerings.
      </p>

      <p class="max-w-2xl text-base text-gray-300 leading-relaxed">
        This page will grow and evolve as I expand the
        <RouterLink to="/blog" class="text-orange-500 hover:text-purple-600 no-underline"
          >[blog]</RouterLink
        >
        section to include more detail, insight and anecdotes.
      </p>

      <p class="max-w-2xl text-base text-gray-300 leading-relaxed">
        Explore the map to hear the sounds and elements that make up the subgenres that fill my
        playlists and sets.
      </p>
    </header>

    <!-- Graph visualization -->
    <GenresGraph />

    <!-- Genre detail view (controlled by Pinia store) -->
    <GenresDetail />
  </main>
</template>

<script setup lang="ts">
import GenresGraph from "@/components/GenresGraph.vue";
import GenresDetail from "@/components/GenresDetail.vue";
</script>
