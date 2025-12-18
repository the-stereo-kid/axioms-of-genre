<template>
  <div class="flex w-fit flex-col">
    <!-- Month Header - Compact -->
    <div class="mb-4 flex items-start justify-between">
      <h3 class="m-0 text-sm font-semibold uppercase text-white">{{ currentMonthYear }}</h3>
      <div class="flex gap-2">
        <button
          class="rounded-md bg-black/20 backdrop-blur-sm border border-gray/10 px-2 py-1 text-xs text-white transition hover:bg-black/70"
          style="box-shadow: 0 0 8px rgba(100, 100, 100, 0.2)"
          @click="scrollUp"
          aria-label="Previous weeks"
        >
          ↑
        </button>
        <button
          class="rounded-md bg-black/20 backdrop-blur-sm border border-gray/10 px-2 py-1 text-xs text-white transition hover:bg-black/70"
          style="box-shadow: 0 0 8px rgba(100, 100, 100, 0.2)"
          @click="scrollDown"
          aria-label="Next weeks"
        >
          ↓
        </button>
      </div>
    </div>

    <!-- Week Labels (Mon-Sun) - Compact -->
    <div class="mb-3 grid grid-cols-7 gap-1">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-[10px] font-medium uppercase text-gray-500"
      >
        {{ day.charAt(0) }}
      </div>
    </div>

    <!-- Weeks Container - Only 4 rows -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="day in visibleDays"
        :key="`day-${day.date}`"
        :class="[
          'relative flex aspect-square items-center justify-center rounded text-sm font-medium transition-all w-[30px]',
          day.hasEvent
            ? 'bg-[#ff8d48]/20 text-white border border-[#ff8d48]/40 hover:bg-[#ff8d48]/30'
            : 'text-gray-400 hover:bg-white/5',
          day.isToday && 'bg-[#ff8d48]/30 text-white border border-[#ff8d48]/60 font-bold',
          day.isPast && 'opacity-50',
          !day.hasEvent && 'cursor-default',
        ]"
        @click="handleDayClick(day)"
        :disabled="!day.hasEvent"
      >
        <span>{{ day.dayNumber }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useEventStore } from "@/stores/eventStore";

const emit = defineEmits<{
  dayClick: [eventId: string];
}>();

const eventStore = useEventStore();

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Start from current week
const startWeek = ref(getWeekStart(new Date()));
const visibleWeekCount = 4; // Show exactly 4 weeks (rows)

// Track if mobile
const isMobile = ref(window.innerWidth < 768);

// Compute visible days (4 weeks = 28 days)
const visibleDays = computed(() => {
  const days: Array<{
    date: string;
    dayNumber: number;
    hasEvent: boolean;
    isToday: boolean;
    isPast: boolean;
    eventId?: string;
  }> = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < visibleWeekCount; i++) {
    const weekStart = new Date(startWeek.value);
    weekStart.setDate(weekStart.getDate() + i * 7);

    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + d);

      const dateStr = date.toISOString().split("T")[0];
      const dayEvents = eventStore.getEventsByDate(dateStr);
      const hasEvent = dayEvents.length > 0;
      const eventId = hasEvent ? dayEvents[0].id : undefined;

      const dateForToday = new Date(date);
      dateForToday.setHours(0, 0, 0, 0);
      const isToday = dateForToday.getTime() === today.getTime();
      const isPast = dateForToday < today;

      days.push({
        date: dateStr,
        dayNumber: date.getDate(),
        hasEvent,
        isToday,
        isPast,
        eventId,
      });
    }
  }

  return days;
});

const currentMonthYear = computed(() => {
  const date = new Date(startWeek.value);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  return new Date(d.setDate(diff));
}

function handleDayClick(day: { eventId?: string }) {
  if (day.eventId) {
    emit("dayClick", day.eventId);
  }
}

function scrollUp() {
  const newStart = new Date(startWeek.value);
  newStart.setDate(newStart.getDate() - 7);
  startWeek.value = newStart;
}

function scrollDown() {
  const newStart = new Date(startWeek.value);
  newStart.setDate(newStart.getDate() + 7);
  startWeek.value = newStart;
}

// Handle window resize
function handleResize() {
  isMobile.value = window.innerWidth < 768;
}

onMounted(() => {
  // Ensure events are loaded
  if (eventStore.events.length === 0 && !eventStore.loading.events) {
    eventStore.loadEvents();
  }

  // Add resize listener
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  // Clean up resize listener to prevent memory leaks
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
/* Compact calendar styling */
</style>
