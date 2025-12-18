<template>
  <footer class="border-t border-[#2f2f2f] bg-[#1b1b1b]">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-12 md:py-12"
    >
      <section
        class="order-2 flex flex-col items-center gap-3 text-center md:order-1 md:flex-row md:items-center md:gap-4 md:text-left"
      >
        <img
          src="/stereo.png"
          alt="The Stereo Kid logo"
          class="h-[58px] w-[58px] rounded-md object-contain"
        />
        <div class="space-y-1">
          <div class="flex items-center justify-center gap-2 md:justify-start">
            <span class="h-[46px] text-[40px] font-black text-white md:text-[40px]"
              >The Stereo Kid</span
            >
          </div>
          <p class="mt-[6px] text-sm italic text-gray-300 md:text-base">
            I like groovy techno and sharks with lazers!
          </p>
        </div>
      </section>

      <section class="order-1 flex flex-col items-center gap-3 text-center md:order-2 md:items-end">
        <span v-if="!isBookingPage" class="font-bold tracking-[0.25em] text-gray-400">
          Let's collab:
        </span>
        <span v-else class="font-semibold tracking-wide text-gray-300"> Awe, do it: </span>
        <RouterLink
          v-if="!isBookingPage"
          to="/booking"
          class="inline-flex items-center justify-center rounded-xl bg-[#ee7129] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white no-underline shadow-[0_4px_12px_rgba(238,113,41,0.3)] transition hover:bg-[#ff8d48] hover:shadow-[0_6px_16px_rgba(238,113,41,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8d48]"
        >
          Book Now
        </RouterLink>
        <span v-else class="font-semibold tracking-wide text-gray-300">
          I'll make you skudt your biscuit.
        </span>
      </section>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const isBookingPage = computed(() => route.path === "/booking");
</script>
