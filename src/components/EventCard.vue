<template>
  <div
    :class="[
      'relative flex aspect-square w-full flex-shrink-0 overflow-hidden rounded-2xl transition-all duration-200',
      isPast ? 'opacity-70' : 'hover:scale-[1.02]',
    ]"
    style="box-shadow: 0 0 0 1px rgba(156, 163, 175, 0.3)"
  >
    <!-- Cover Image or Gradient Background -->
    <div class="absolute inset-0 rounded-2xl">
      <img
        v-if="event.cover_image"
        :src="event.cover_image"
        :alt="event.event_name"
        class="h-full w-full object-cover"
      />
      <div v-else class="h-full w-full bg-gradient-to-br from-[#ff8d48]/20 to-[#1b1b1b]"></div>
      <!-- Dark overlay for text readability -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      ></div>
    </div>

    <!-- Content Overlay -->
    <div class="relative z-10 flex h-full flex-col justify-end p-4 text-white">
      <!-- Date -->
      <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-[#ff8d48]">
        {{ formattedDate }}
      </div>

      <!-- Event Name -->
      <h3 class="mb-2 text-lg font-bold leading-tight sm:text-xl">
        {{ event.event_name }}
      </h3>

      <!-- Venue & Time -->
      <div class="mb-2 space-y-1 text-xs text-gray-200 sm:text-sm">
        <div v-if="event.venue" class="flex items-center gap-2">
          <span class="text-gray-400">📍</span>
          <span>{{ event.venue }}</span>
        </div>
        <div v-if="formattedTime" class="flex items-center gap-2">
          <span class="text-gray-400">🕐</span>
          <span>{{ formattedTime }}</span>
        </div>
      </div>

      <!-- Genres -->
      <div v-if="event.genres && event.genres.length > 0" class="mb-3 flex flex-wrap gap-2">
        <span
          v-for="genre in event.genres"
          :key="genre.id"
          class="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur-sm"
        >
          {{ genre.name }}
        </span>
      </div>

      <!-- Event Link -->
      <a
        v-if="event.event_link"
        :href="event.event_link"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block rounded-lg bg-[#ff8d48] px-3 py-2 text-xs font-semibold text-white no-underline transition-colors hover:bg-[#ffa366]"
      >
        View Event →
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { EventWithGenres } from "@/lib/database.types";

const props = defineProps<{
  event: EventWithGenres;
}>();

// Helper function to parse date string in local timezone
// Prevents timezone issues when date string is "YYYY-MM-DD"
function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
}

// Check if event is in the past
const isPast = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = parseLocalDate(props.event.date);
  return eventDate < today;
});

// Format full date
const formattedDate = computed(() => {
  const date = parseLocalDate(props.event.date);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  return `${day} ${month}`;
});

// Format time range
const formattedTime = computed(() => {
  if (!props.event.start_time) return null;

  const start = formatTime(props.event.start_time);
  if (props.event.end_time) {
    const end = formatTime(props.event.end_time);
    return `${start} - ${end}`;
  }
  return start;
});

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}
</script>
