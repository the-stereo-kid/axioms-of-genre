<template>
  <main class="relative">
    <!-- Hero Section - Exactly 100vh -->
    <section class="hero-section relative w-full overflow-hidden">
      <!-- Hero image background -->
      <div class="hero-image-wrapper absolute inset-0">
        <img :src="profileImageUrl" alt="The Stereo Kid DJing" class="hero-image" />
        <!-- Dark overlay for text readability -->
        <div
          class="hero-overlay absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"
        ></div>
      </div>

      <!-- Title and Catchphrase at top -->
      <div class="hero-header absolute left-4 top-20 z-10 sm:left-6 sm:top-24 md:left-12 md:top-32">
        <h1 class="hero-title text-left text-white">THE STEREO KID</h1>
        <p
          class="catchphrase mt-3 text-left text-sm font-medium italic text-[#ff8d48] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-base md:text-lg"
        >
          I like groovy techno and sharks with lazer beams!
        </p>
      </div>

      <!-- Bio card at bottom -->
      <div
        class="bio-card absolute bottom-0 left-4 right-4 z-10 rounded-t-3xl py-8 sm:left-6 sm:right-6 sm:py-10 md:left-auto md:right-12 md:w-auto md:max-w-lg md:rounded-3xl md:mb-12 lg:max-w-xl lg:right-16 xl:right-24"
      >
        <div class="space-y-4 px-6 text-left sm:px-8">
          <p class="text-sm leading-relaxed text-gray-200 sm:text-base">
            <span class="font-bold">Groovy</span><sub>adj.</sub>
            <span class="text-gray-400">/ˈɡruː.vi/</span> <br />
            <span class="block pl-4">Funky, infectious, and exciting.</span>
            <br />
            <span class="font-bold">Techno</span><sub>n.</sub>
            <span class="text-gray-400">/ˈtɛk.noʊ/</span> <br />
            <span class="block pl-4"
              >A driving energy that pulls the crowd into unity and flow on the dance floor.</span
            >
            <br />
            <span class="font-bold">The Stereo Kid</span><sub>n.</sub>
            <span class="text-gray-400">/ðə ˈstɛr.i.oʊ kɪd/</span> <br />
            <span class="block pl-4"
              >A curator of the beat; one who blends these elements to make you move your feet.
            </span>
          </p>
          <RouterLink
            to="/booking"
            class="cta-button inline-block w-full no-underline rounded-xl bg-[#ee7129] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#ff8d48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8d48] sm:text-base md:w-auto"
          >
            Request a booking
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Feature Cards Section - Below Hero -->
    <section
      class="feature-cards-section bg-[#1b1b1b] px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20"
    >
      <div class="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:gap-8">
        <!-- Axioms of Genre Card -->
        <div class="feature-card flex-1 rounded-3xl px-6 py-8 sm:px-8 sm:py-10">
          <div class="space-y-4 text-left">
            <h2 class="text-xl font-semibold text-white sm:text-2xl">Axioms of Genre</h2>
            <p class="text-sm leading-relaxed text-gray-300 sm:text-base">
              Explore an interactive visualization of electronic music genres and their
              relationships. This project maps out connections between subgenres and how different
              sounds relate to each other.
            </p>
            <RouterLink
              to="/visualizer"
              class="feature-link inline-block rounded-xl border border-[#2f2f2f] bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:border-[#ff8d48] hover:text-[#ff8d48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8d48] sm:text-base"
            >
              Explore Visualizer
            </RouterLink>
          </div>
        </div>

        <!-- Blog Card -->
        <div class="feature-card flex-1 rounded-3xl px-6 py-8 sm:px-8 sm:py-10">
          <div class="space-y-4 text-left">
            <h2 class="text-xl font-semibold text-white sm:text-2xl">Blog</h2>
            <p class="text-sm leading-relaxed text-gray-300 sm:text-base">
              Read deeper insights about electronic music, genre theory, and my thoughts on the
              evolving landscape of electronic music culture.
            </p>
            <RouterLink
              to="/blog"
              class="feature-link inline-block rounded-xl border border-[#2f2f2f] bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:border-[#ff8d48] hover:text-[#ff8d48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8d48] sm:text-base"
            >
              Read Blog
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { getCoverImageUrl } from "@/lib/imageStorage";

// Use Supabase Storage for cover images
const profileImageUrl = getCoverImageUrl("profile.jpg");
</script>

<style scoped lang="scss">
// Hero section - exactly 100vh
.hero-section {
  height: 100vh;
  height: 100dvh; // Dynamic viewport height for mobile
  // Prevent horizontal overflow on mobile
  overflow-x: hidden;
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
  font-size: clamp(0.875rem, 2.5vw, 2rem) !important;
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

// Bio card - glassmorphic effect
.bio-card {
  background: rgba(27, 27, 27, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.5);
}

// CTA Button styling
.cta-button {
  box-shadow: 0 4px 12px rgba(238, 113, 41, 0.3);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(238, 113, 41, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

// Feature cards section
.feature-cards-section {
  min-height: auto;
}

// Feature card - glassmorphic effect matching bio card
.feature-card {
  background: rgba(27, 27, 27, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
}

.feature-link {
  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

// Responsive adjustments for portrait images
@media (orientation: portrait) {
  .hero-image {
    object-fit: cover;
    object-position: center top;
  }
}

// Very short screens
@media (max-height: 600px) {
  .hero-title {
    font-size: clamp(0.75rem, 2vw, 1.5rem) !important;
  }

  .hero-header {
    top: 4rem !important;
    left: 1rem !important;
  }

  .bio-card {
    padding: 1rem;
  }
}

// Mobile adjustments - ensure card fits within viewport with padding
@media (max-width: 767px) {
  .bio-card {
    border-radius: 1.5rem 1.5rem 0 0;
    // Keep horizontal padding (left-4/right-4 on mobile, left-6/right-6 on sm)
    // This preserves background image visibility
    box-sizing: border-box;

    // Ensure content respects padding
    > div {
      box-sizing: border-box;
      max-width: 100%;
    }
  }

  .cta-button {
    box-sizing: border-box;
    max-width: 100%;
  }
}

// Medium screens - position on right with relative padding
@media (min-width: 768px) {
  .bio-card {
    // Positioned on right side, scales with padding
    right: 3rem; // md:right-12
  }
}

// Large screens - more padding for balance
@media (min-width: 1024px) {
  .bio-card {
    right: 4rem; // lg:right-16
    max-width: 28rem; // lg:max-w-xl
  }
}

// Extra large screens - maintain proportional spacing
@media (min-width: 1280px) {
  .bio-card {
    right: 6rem; // xl:right-24
  }
}
</style>
