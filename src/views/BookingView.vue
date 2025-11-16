<template>
  <main class="mx-auto flex min-h-[70vh] max-w-5xl flex-col gap-12 px-6 py-16 text-left">
    <header class="space-y-4">
      <p class="text-sm uppercase tracking-[0.35em] text-gray-400">Contact</p>
      <h1 class="text-4xl font-semibold text-white">Booking</h1>
      <p class="max-w-2xl text-base text-gray-300">
        Get in touch to book me for your event. Fill out the form below or reach out directly via
        email.
      </p>
    </header>

    <section class="space-y-8">
      <div
        class="rounded-3xl border border-[#2f2f2f] bg-[#1f1f1f] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
      >
        <p class="mb-2 text-xs uppercase tracking-[0.3em] text-gray-400">Email</p>
        <a
          :href="`mailto:${contactEmail}`"
          class="text-medium md:text-lg lg:text-xl text-[#ff8d48] no-underline transition hover:text-[#ffc299]"
        >
          {{ contactEmail }}
        </a>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label for="name" class="block text-sm font-medium text-gray-200">Name</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="w-full box-border rounded-xl border border-[#2f2f2f] bg-[#222222] px-3 py-2.5 text-sm sm:px-4 sm:py-3 sm:text-base text-gray-100 outline-none transition focus:border-[#ff8d48] focus:ring-2 focus:ring-[#ff8d48]"
            placeholder="Your name"
          />
        </div>

        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-200">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full box-border rounded-xl border border-[#2f2f2f] bg-[#222222] px-3 py-2.5 text-sm sm:px-4 sm:py-3 sm:text-base text-gray-100 outline-none transition focus:border-[#ff8d48] focus:ring-2 focus:ring-[#ff8d48]"
            placeholder="your@email.com"
          />
        </div>

        <div class="space-y-2">
          <label for="vibe" class="block text-sm font-medium text-gray-200">What's the vibe?</label>
          <textarea
            id="vibe"
            v-model="formData.vibe"
            required
            class="w-full box-border rounded-xl border border-[#2f2f2f] bg-[#222222] px-3 py-2.5 text-sm sm:px-4 sm:py-3 sm:text-base text-gray-100 outline-none transition focus:border-[#ff8d48] focus:ring-2 focus:ring-[#ff8d48] resize-y"
            placeholder="Tell me more about the event, crowd, other djs etc..
is there a specific genre you are interested in?
how much assistance do you need with sound equipment / setup?"
            rows="5"
          ></textarea>
        </div>

        <button
          type="submit"
          class="rounded-xl bg-[#ff8d48] px-6 py-3 text-base font-bold text-[#1b1b1b] transition hover:bg-[#ffc299]"
        >
          Send Request
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const contactEmail = "ieuan@scoutevents.co.za";

const formData = ref({
  name: "",
  email: "",
  vibe: "",
});

const handleSubmit = () => {
  const subject = encodeURIComponent(`Booking Request from ${formData.value.name}`);
  const body = encodeURIComponent(
    `Name: ${formData.value.name}\nEmail: ${formData.value.email}\n\nVibe/Request:\n${formData.value.vibe}`
  );

  const mailtoLink = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;

  formData.value = {
    name: "",
    email: "",
    vibe: "",
  };
};
</script>
