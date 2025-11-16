<template>
  <div class="min-h-screen bg-transparent">
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useGenreStore } from "@/stores/genreStore";
import { useAuthStore } from "@/stores/authStore";
import AppHeader from "@/components/AppHeader.vue";

const genreStore = useGenreStore();
const authStore = useAuthStore();

onMounted(() => {
  genreStore.loadAllData();
  authStore.initialize();
});
</script>

<style lang="scss">
/* src/style.css */
// @tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-heading: "Poppins", var(--font-sans);
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --text-color-base: #dddddd;
  --text-color-accent: #ee7129;
  --background-base: #222222;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: var(--font-weight-normal);
  background: var(--background-base);
  color: var(--text-color-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  line-height: 1.6;
  text-align: center;

  h1 {
    font-family: "Press Start 2P", monospace;
    margin-top: 0.4rem;
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: normal;
    letter-spacing: 0.1em;
    line-height: 1.4;
  }

  h2,
  h3 {
    font-family: var(--font-heading);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.01em;
  }

  h2 {
    font-weight: var(--font-weight-medium);
  }

  h3 {
    font-weight: var(--font-weight-medium);
  }
}

nav {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-medium);

  a {
    color: var(--text-color-base);
    transition: color 180ms ease;

    &.router-link-exact-active,
    &:hover {
      color: var(--text-color-accent);
    }
  }
}
</style>
