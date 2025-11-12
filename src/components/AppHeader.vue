<template>
  <header
    ref="headerRef"
    class="fixed top-0 left-0 right-0 z-40 border-b border-[#2f2f2f] bg-[#1b1b1b]/95 backdrop-blur transition-transform duration-300 ease-in-out"
    :style="{ transform: isHeaderHidden ? 'translateY(-100%)' : 'translateY(0)' }"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
      <!-- Mobile menu button -->
      <button
        class="flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-gray-400 transition hover:text-white lg:hidden"
        type="button"
        @click="toggleMenu"
        aria-label="Toggle navigation"
      >
        <span class="h-0.5 w-5 bg-gray-400"></span>
        <span class="h-0.5 w-5 bg-gray-400"></span>
        <span class="h-0.5 w-5 bg-gray-400"></span>
      </button>

      <!-- Desktop navigation -->
      <nav class="hidden items-center gap-8 lg:flex">
        <RouterLink
          v-for="item in navigationLinks"
          :key="item.to"
          :to="item.to"
          class="no-underline text-xs font-bold uppercase tracking-[0.25em] text-gray-400 transition-all duration-300 hover:scale-150 hover:text-white"
        >
          {{ item.label }}
        </RouterLink>
        <RouterLink
          v-if="accountLink"
          :to="accountLink.to"
          class="no-underline rounded-full border border-[#2f2f2f] px-4 py-2 text-sm font-bold uppercase tracking-[0.3em] text-gray-300 transition-all duration-300 hover:scale-125 hover:border-[#ff8d48] hover:text-[#ff8d48]"
        >
          {{ accountLink.label }}
        </RouterLink>
        <button
          v-if="authStore.isAuthenticated"
          type="button"
          class="rounded-full bg-[#ff8d48] px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[#1b1b1b] transition-all duration-300 hover:scale-125 hover:bg-[#ffc299]"
          @click="signOut"
        >
          Sign out
        </button>
      </nav>

      <!-- Mobile dropdown menu -->
      <nav
        class="fixed left-6 right-6 top-20 flex flex-col gap-4 rounded-3xl border border-[#2f2f2f] bg-[#1b1b1b] p-6 text-left shadow-2xl transition lg:hidden"
        :class="isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
      >
        <RouterLink
          v-for="item in navigationLinks"
          :key="item.to"
          :to="item.to"
          class="no-underline text-sm font-bold uppercase tracking-[0.25em] text-gray-400 transition hover:text-white"
          @click="closeMenu"
        >
          {{ item.label }}
        </RouterLink>
        <RouterLink
          v-if="accountLink"
          :to="accountLink.to"
          class="no-underline rounded-full border border-[#2f2f2f] px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-300 transition hover:border-[#ff8d48] hover:text-[#ff8d48]"
          @click="closeMenu"
        >
          {{ accountLink.label }}
        </RouterLink>
        <button
          v-if="authStore.isAuthenticated"
          type="button"
          class="rounded-full bg-[#ff8d48] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1b1b1b] transition hover:bg-[#ffc299]"
          @click="signOut"
        >
          Sign out
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const route = useRoute();
const isMenuOpen = ref(false);
const isHeaderHidden = ref(false);
const headerRef = ref<HTMLElement | null>(null);

let lastScrollTop = 0;
let ticking = false;
const scrollThreshold = 50; // Minimum scroll distance before hiding header

const navigationLinks = computed(() => [
  { label: "[THE STEREO KID]", to: "/" },
  { label: "[AXIOMS OF GENRE]", to: "/visualizer" },
  { label: "[BLOG]", to: "/blog" },
  { label: "[BOOKING]", to: "/booking" },
]);

const accountLink = computed(() => {
  if (authStore.isAuthenticated) {
    return { label: "Dashboard", to: "/author" };
  }
  return null;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const signOut = async () => {
  await authStore.signOut();
  authStore.setRedirect("/");
  closeMenu();
};

// Reset scroll state when route changes
watch(
  () => route.fullPath,
  () => {
    closeMenu();
    // Reset scroll state on route change
    lastScrollTop = 0;
    isHeaderHidden.value = false;
  }
);

// Handle scroll behavior: hide on scroll down, show on scroll up
const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      // Only hide/show if scrolled past threshold
      if (currentScrollTop > scrollThreshold) {
        if (currentScrollTop > lastScrollTop && currentScrollTop - lastScrollTop > 5) {
          // Scrolling down - hide header (with minimum scroll delta)
          isHeaderHidden.value = true;
        } else if (lastScrollTop > currentScrollTop && lastScrollTop - currentScrollTop > 5) {
          // Scrolling up - show header (with minimum scroll delta)
          isHeaderHidden.value = false;
        }
      } else {
        // At top of page - always show header
        isHeaderHidden.value = false;
      }

      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
      ticking = false;
    });
    ticking = true;
  }
};

onMounted(() => {
  // Listen to scroll events on window
  window.addEventListener("scroll", handleScroll, { passive: true });
  // Also listen on document.documentElement for some browsers
  document.documentElement.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.documentElement.removeEventListener("scroll", handleScroll);
});
</script>
