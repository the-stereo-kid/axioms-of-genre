<template>
  <header class="sticky top-0 z-40 border-b border-[#2f2f2f] bg-[#1b1b1b]/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
      <RouterLink
        to="/"
        class="group flex items-center gap-2 text-left text-sm font-medium uppercase tracking-[0.35em] text-gray-400 transition hover:text-white"
        @click="closeMenu"
      >
        <span class="text-base font-bold text-white">Axioms</span>
        <span class="text-[#ff8d48] transition group-hover:text-[#ffc299]">Visualizer</span>
      </RouterLink>

      <button
        class="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#393939] text-gray-300 transition hover:text-white lg:hidden"
        type="button"
        @click="toggleMenu"
        aria-label="Toggle navigation"
      >
        <span
          class="absolute h-0.5 w-5 origin-center rounded-full bg-current transition-all"
          :class="isMenuOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5'"
        />
        <span
          class="absolute h-0.5 w-5 origin-center rounded-full bg-current transition-all"
          :class="isMenuOpen ? 'opacity-0' : 'opacity-100'"
        />
        <span
          class="absolute h-0.5 w-5 origin-center rounded-full bg-current transition-all"
          :class="isMenuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'"
        />
      </button>

      <nav
        class="fixed inset-x-0 top-20 mx-auto flex max-w-xs flex-col gap-4 rounded-3xl border border-[#2f2f2f] bg-[#1b1b1b] p-6 text-center shadow-2xl transition lg:static lg:max-w-none lg:flex-row lg:items-center lg:gap-10 lg:border-none lg:bg-transparent lg:p-0 lg:text-left lg:shadow-none"
        :class="isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 lg:pointer-events-auto lg:opacity-100'"
      >
        <RouterLink
          v-for="item in navigationLinks"
          :key="item.to"
          :to="item.to"
          class="text-sm font-bold uppercase tracking-[0.25em] text-gray-400 transition hover:text-white"
          @click="closeMenu"
        >
          {{ item.label }}
        </RouterLink>
        <button
          v-if="authStore.isAuthenticated"
          type="button"
          class="rounded-full border border-[#2f2f2f] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-300 transition hover:border-[#ff8d48] hover:text-[#ff8d48] lg:hidden"
          @click="signOut"
        >
          Sign out
        </button>
      </nav>

      <div class="hidden items-center gap-4 lg:flex">
        <RouterLink
          v-if="accountLink"
          :to="accountLink.to"
          class="rounded-full border border-[#2f2f2f] px-4 py-2 text-sm font-bold uppercase tracking-[0.3em] text-gray-300 transition hover:border-[#ff8d48] hover:text-[#ff8d48]"
        >
          {{ accountLink.label }}
        </RouterLink>
        <button
          v-if="authStore.isAuthenticated"
          type="button"
          class="rounded-full bg-[#ff8d48] px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[#1b1b1b] transition hover:bg-[#ffc299]"
          @click="signOut"
        >
          Sign out
        </button>
      </div>

      <div class="flex items-center gap-3 lg:hidden">
        <RouterLink
          v-if="accountLink"
          :to="accountLink.to"
          class="rounded-full border border-[#2f2f2f] px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-300 transition hover:border-[#ff8d48] hover:text-[#ff8d48]"
          @click="closeMenu"
        >
          {{ accountLink.label }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "@/stores/authStore"

const authStore = useAuthStore()
const isMenuOpen = ref(false)
const route = useRoute()

const navigationLinks = computed(() => [
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" }
])

const accountLink = computed(() => {
  if (authStore.isAuthenticated) {
    return { label: "Dashboard", to: "/author" }
  }
  return null
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const signOut = async () => {
  await authStore.signOut()
  authStore.setRedirect("/")
  closeMenu()
}

onMounted(() => {
  window.addEventListener("resize", closeMenu)
})

onUnmounted(() => {
  window.removeEventListener("resize", closeMenu)
})

watch(
  () => route.fullPath,
  () => closeMenu()
)
</script>

