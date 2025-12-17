<template>
  <section class="w-full bg-[#1b1b1b] px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-12">
    <div class="mx-auto max-w-6xl">
      <!-- Section Header -->
      <div class="mb-8 text-left">
        <h2 class="text-2xl font-semibold text-white sm:text-3xl">Calendar</h2>
        <p class="mt-2 text-sm leading-relaxed text-gray-300 sm:text-base">
          Upcoming gigs, events, and where you can find me or other groovy events.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="eventStore.loading.events" class="py-12 text-center text-gray-400">
        <p>Loading events...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="eventStore.error" class="py-12 text-center text-red-400">
        <p>{{ eventStore.error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="eventStore.events.length === 0" class="py-12 text-center text-gray-400">
        <p>No events scheduled yet. Check back soon!</p>
      </div>

      <!-- Main Content: Carousel and Calendar -->
      <div v-else>
        <!-- Desktop: Carousel (3/5) + Calendar (2/5) -->
        <div class="hidden md:grid md:grid-cols-[3fr_2fr] md:gap-8 md:items-start">
          <div class="flex flex-col">
            <EventCarousel ref="carouselRef" />
          </div>
          <div class="flex flex-col justify-start">
            <CalendarGrid @dayClick="handleCalendarDayClick" />
          </div>
        </div>

        <!-- Mobile: Stacked -->
        <div class="md:hidden">
          <div class="mb-8 flex flex-col">
            <EventCarousel ref="carouselRef" />
          </div>
          <div class="flex flex-col">
            <CalendarGrid @dayClick="handleCalendarDayClick" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useEventStore } from "@/stores/eventStore";
import EventCarousel from "./EventCarousel.vue";
import CalendarGrid from "./CalendarGrid.vue";

const eventStore = useEventStore();
const carouselRef = ref<InstanceType<typeof EventCarousel> | null>(null);

// Handle calendar day click - scroll carousel to that event
function handleCalendarDayClick(eventId: string) {
  if (carouselRef.value) {
    carouselRef.value.scrollToEvent(eventId);
  }
}

// Load events on mount
onMounted(() => {
  eventStore.loadEvents();
});
</script>
