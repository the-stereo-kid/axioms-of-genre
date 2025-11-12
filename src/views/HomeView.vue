<template>
  <main class="mx-auto flex min-h-[70vh] max-w-5xl flex-col gap-12 px-6 py-16 text-left">
    <header class="space-y-4">
      <p class="text-sm uppercase tracking-[0.35em] text-gray-400">Home</p>
      <h1 class="text-4xl font-semibold text-white leading-tight">The Stereo Kid</h1>
    </header>

    <section class="space-y-8">
      <div class="hero-image-container">
        <img src="../assets/dj-photo.jpg" alt="The Stereo Kid DJing" class="hero-image" />
      </div>
      <p class="catchphrase text-xl font-medium italic text-[#ff8d48]">
        I like groovy techno and sharks with lazer beams!
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-white">About This Site</h2>
      <p class="max-w-2xl text-base text-gray-300">
        Welcome to my digital space where I explore the relationships between electronic music
        genres through interactive visualization. This is a personal project mapping out my
        understanding of electronic music, its connections, and how different genres relate to each
        other.
      </p>
      <p class="max-w-2xl text-base text-gray-300">
        Dive into the visualizer to explore genre connections, check out the blog for deeper
        insights, or get in touch if you want to book me for an event.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
// The Stereo Kid personal brand homepage
</script>

<style scoped lang="scss">
.hero-image-container {
  max-width: 800px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}
</style>
