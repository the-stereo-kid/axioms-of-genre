<template>
  <main class="mx-auto flex min-h-[70vh] max-w-4xl flex-col gap-10 px-6 py-16 text-left">
    <header class="space-y-3">
      <p class="text-sm uppercase tracking-[0.35em] text-gray-400">Author dashboard</p>
      <h1 class="text-4xl font-semibold text-white">Welcome back, {{ authorName }}</h1>
      <p class="max-w-2xl text-base text-gray-300">
        This workspace will evolve into the publishing hub. For now it outlines the workflow we will
        implement in the next iteration so you can plan your Supabase schema and UI integrations
        with confidence.
      </p>
    </header>

    <section class="grid gap-6 md:grid-cols-2">
      <div
        class="rounded-3xl border border-[#303030] bg-[#1f1f1f] p-6 shadow-[0_16px_32px_rgba(0,0,0,0.35)]"
      >
        <h2 class="text-lg font-medium text-white">Next steps</h2>
        <ol class="mt-4 space-y-3 text-sm text-gray-300">
          <li>1. Add Supabase row-level security policies for the `posts` table.</li>
          <li>2. Create a draft editor with autosave leveraging the Supabase client.</li>
          <li>3. Publish to prod by toggling the `published_at` timestamp.</li>
        </ol>
      </div>

      <div class="rounded-3xl border border-dashed border-[#3a3a3a] p-6 text-sm text-gray-400">
        <h2 class="text-lg font-medium text-white">Reference queries</h2>
        <ul class="mt-3 space-y-2">
          <li>↳ List drafts: `supabase.from('posts').select('*').is('published_at', null)`</li>
          <li>
            ↳ Publish: `supabase.from('posts').update({ published_at: new Date().toISOString()
            }).eq('id', post.id)`
          </li>
          <li>↳ Archive: `supabase.from('posts').delete().eq('id', post.id)`</li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

const authorName = computed(() => authStore.profile?.email ?? "Author");
</script>
