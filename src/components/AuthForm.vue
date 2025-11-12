<template>
  <section
    class="mx-auto w-full max-w-md rounded-3xl bg-[#2e2e2e] p-10 shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-colors duration-300"
    :class="hasError ? 'bg-red-900/30' : ''"
  >
    <header class="mb-6 space-y-2 text-left">
      <p class="text-sm uppercase tracking-[0.3em] text-gray-400">Super secret access point</p>
      <h1 class="text-3xl leading-snug font-medium text-white">Backdoor</h1>
    </header>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <input
        id="author-email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="box-border block w-full rounded-xl border border-gray-600 bg-[#222222] px-4 py-3 text-base text-gray-100 outline-none transition focus:border-[#ee7129] focus:ring-2 focus:ring-[#ee7129]"
        placeholder="email"
      />

      <input
        id="author-password"
        v-model="password"
        type="password"
        required
        autocomplete="current-password"
        class="box-border block w-full rounded-xl border border-gray-600 bg-[#222222] px-4 py-3 text-base text-gray-100 outline-none transition focus:border-[#ee7129] focus:ring-2 focus:ring-[#ee7129]"
        placeholder="••••••••"
      />

      <button
        type="submit"
        class="box-border flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-[#ee7129] px-4 py-3 text-base font-medium text-white transition hover:bg-[#ff8d48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8d48] disabled:cursor-not-allowed disabled:bg-[#7a7a7a]"
        :disabled="isSubmitDisabled"
      >
        <span
          v-if="isProcessing"
          class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
        ></span>
        <span>Open Sesame</span>
      </button>
    </form>

    <footer class="mt-6 space-y-2 text-center text-sm text-gray-300">
      <p v-if="authError" class="rounded-lg bg-[#402015] px-4 py-2 text-left text-[#ffb89a]">
        {{ authError }}
      </p>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref("");
const password = ref("");
const localError = ref<string | null>(null);

const isProcessing = computed(() => authStore.isProcessing);
const authError = computed(() => localError.value || authStore.authError);
const hasError = computed(() => !!authError.value);
const isSubmitDisabled = computed(() => !email.value || !password.value || isProcessing.value);

const handleSubmit = async () => {
  localError.value = null;

  const credentials = {
    email: email.value.trim(),
    password: password.value,
  };

  const errorMessage = await authStore.signIn(credentials);

  if (errorMessage) {
    localError.value = errorMessage;
    return;
  }

  const redirectQuery = typeof route.query.redirectTo === "string" ? route.query.redirectTo : null;
  const destination = redirectQuery || authStore.redirectTo || "/";

  await router.push(destination);
};
</script>
