<template>
  <main class="relative">
    <!-- Full-height hero section -->
    <section class="hero-section relative flex h-screen w-full overflow-hidden">
      <!-- Hero image background -->
      <div class="hero-image-wrapper absolute inset-0">
        <img :src="profileImageUrl" alt="The Stereo Kid DJing" class="hero-image" />
        <!-- Dark overlay for text readability -->
        <div
          class="hero-overlay absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"
        ></div>
      </div>

      <!-- Title positioned top left -->
      <h1
        class="hero-title absolute left-6 top-24 z-10 text-left text-white sm:left-8 sm:top-28 md:left-12 md:top-32"
      >
        THE STEREO KID
      </h1>

      <!-- Catchphrase positioned bottom right -->
      <p
        class="catchphrase absolute bottom-6 right-6 z-10 whitespace-nowrap text-right text-lg font-medium italic text-[#ff8d48] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:bottom-8 sm:right-8 sm:text-xl md:bottom-12 md:right-12 md:text-2xl"
      >
        I like groovy techno and sharks with lazer beams!
      </p>

      <!-- Glassmorphic content card positioned on the left -->
      <div
        class="glass-card absolute bottom-10 left-10 z-10 w-full max-w-lg rounded-t-3xl px-8 py-12 sm:px-10 sm:py-16 md:bottom-12 md:left-12 md:max-w-xl"
      >
        <div class="space-y-4 text-left">
          <h2 class="text-2xl font-semibold text-white">Welcome</h2>
          <p class="text-base text-gray-300">
            I explore the relationships between electronic music genres . This is a personal project
            mapping out my understanding of the connections between subgenres, and how different
            sounds relate to each other.
          </p>
          <p class="text-base text-gray-300">
            Dive into the visualizer to explore genres according to my axioms, check out the blog
            for deeper insights, or get in touch if you want to book me for an event.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { getCoverImageUrl } from "@/lib/imageStorage";

// Use Supabase Storage for cover images
const profileImageUrl = getCoverImageUrl("profile.jpg");
</script>

<style scoped lang="scss">
.hero-section {
  height: 100vh;
  height: 100dvh; // Dynamic viewport height for mobile
}

.hero-image-wrapper {
  width: 100%;
  height: 100%;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-title {
  font-family: "Press Start 2P", monospace !important;
  /* clamp(min-size, preferred-size, max-size)
     - min-size: smallest it can be (mobile)
     - preferred-size: scales with viewport (2.5vw = 2.5% of viewport width)
     - max-size: largest it can be (desktop)
     Try adjusting: clamp(1rem, 3vw, 2.5rem) for bigger, or clamp(0.75rem, 2vw, 1.5rem) for smaller */
  font-size: clamp(1.2rem, 3vw, 2.5rem) !important;
  line-height: 1.4 !important;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px rgba(255, 141, 72, 0.5), 0 0 20px rgba(255, 141, 72, 0.3),
    2px 2px 0px rgba(0, 0, 0, 0.8), 4px 4px 0px rgba(0, 0, 0, 0.6);
  animation: pixel-glow 2s ease-in-out infinite alternate;
}

@keyframes pixel-glow {
  from {
    text-shadow: 0 0 10px rgba(255, 141, 72, 0.5), 0 0 20px rgba(255, 141, 72, 0.3),
      2px 2px 0px rgba(0, 0, 0, 0.8), 4px 4px 0px rgba(0, 0, 0, 0.6);
  }
  to {
    text-shadow: 0 0 15px rgba(255, 141, 72, 0.7), 0 0 30px rgba(255, 141, 72, 0.5),
      2px 2px 0px rgba(0, 0, 0, 0.8), 4px 4px 0px rgba(0, 0, 0, 0.6);
  }
}

.catchphrase {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
}

// Glassmorphic card effect - 10% opacity
.glass-card {
  background: rgba(27, 27, 27, 0.33);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.3);
}

// Responsive adjustments for portrait images
@media (orientation: portrait) {
  .hero-image {
    object-fit: cover;
    object-position: center top;
  }
}

// Mobile adjustments
@media (max-height: 600px) {
  .hero-title {
    font-size: clamp(0.75rem, 3vw, 1.5rem);
    top: 5rem !important;
    left: 1rem !important;
  }

  .catchphrase {
    font-size: 0.875rem;
    bottom: 1rem;
    right: 1rem;
  }

  .glass-card {
    padding: 1.5rem;
  }
}

// Responsive card positioning
@media (max-width: 640px) {
  .glass-card {
    max-width: 100%;
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 1.5rem;
  }
}

// Medium breakpoint adjustments (768px+)
@media (min-width: 768px) {
  .glass-card {
    max-width: 32rem; // xl = 36rem, but keeping it reasonable
  }
}
</style>
