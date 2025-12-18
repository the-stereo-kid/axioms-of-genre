<template>
  <div class="relative w-full max-w-full overflow-hidden">
    <Carousel
      ref="carouselRef"
      :items-to-show="itemsToShow"
      :items-to-scroll="1"
      :wrap-around="false"
      :mouse-drag="true"
      :touch-drag="true"
      :gap="12"
      :transition="400"
      :breakpoints="breakpoints"
      class="w-full max-w-full overflow-hidden"
    >
      <Slide v-for="event in sortedEvents" :key="event.id" :data-event-id="event.id">
        <div class="flex h-full w-full items-start justify-center p-0">
          <EventCard :event="event" />
        </div>
      </Slide>
    </Carousel>
    <!-- Navigation buttons positioned below carousel -->
    <div class="mt-6 hidden justify-center gap-4 md:flex">
      <button
        class="rounded-lg bg-black/20 backdrop-blur-sm border border-gray/10 px-4 py-2 text-white transition hover:bg-black/70"
        style="box-shadow: 0 0 12px rgba(100, 100, 100, 0.2)"
        @click="prev"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        class="rounded-lg bg-black/20 backdrop-blur-sm border border-gray/10 px-4 py-2 text-white transition hover:bg-black/70"
        style="box-shadow: 0 0 12px rgba(100, 100, 100, 0.2)"
        @click="next"
        aria-label="Next"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { useEventStore } from "@/stores/eventStore";
import EventCard from "./EventCard.vue";

const eventStore = useEventStore();

const carouselRef = ref<InstanceType<typeof Carousel> | null>(null);

// Combine past and upcoming events, with next event first
const sortedEvents = computed(() => {
  return [...eventStore.events].sort((a, b) => a.date.localeCompare(b.date));
});

const itemsToShow = 2.5;
const breakpoints = {
  0: {
    itemsToShow: 1.2,
    gap: 8,
  },
  768: {
    itemsToShow: 2.2,
    gap: 10,
  },
  1024: {
    itemsToShow: 2.5,
    gap: 12,
  },
};

function scrollToEvent(eventId: string) {
  const index = sortedEvents.value.findIndex((e) => e.id === eventId);
  if (index >= 0 && carouselRef.value) {
    carouselRef.value.slideTo(index);
  }
}

function next() {
  carouselRef.value?.next();
}

function prev() {
  carouselRef.value?.prev();
}

// Scroll to next upcoming event on mount
onMounted(() => {
  if (eventStore.nextEvent) {
    const index = sortedEvents.value.findIndex((e) => e.id === eventStore.nextEvent!.id);
    if (index >= 0 && carouselRef.value) {
      carouselRef.value.slideTo(index);
    }
  }
});

// Expose scrollToEvent method for parent component
defineExpose({
  scrollToEvent,
});
</script>

<style scoped>
/* Constrain carousel width and overflow */
:deep(.carousel) {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

:deep(.carousel__viewport) {
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

:deep(.carousel__track) {
  width: 100%;
  max-width: 100%;
}

:deep(.carousel__slide) {
  flex-shrink: 0;
  max-width: 100%;
}
</style>
