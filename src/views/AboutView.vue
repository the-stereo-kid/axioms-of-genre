<template>
  <main class="mx-auto flex min-h-[70vh] max-w-4xl flex-col gap-10 px-6 py-16 text-left">
    <header class="space-y-4">
      <p class="text-sm uppercase tracking-[0.35em] text-gray-400">About</p>
      <h1 class="text-4xl font-semibold text-white">Why Axioms of Genre?</h1>
      <p class="max-w-3xl text-base text-gray-300">
        Axioms of Genre investigates electronic music lineages:: how subgenres branch from the
        dominating elements that define the most popular genres since the inception of the
        discotech, what makes them work, how they have evolved thanks to culture, technology,
        substances, movement patterns and sometimes a bit of sparkly luck. I also ramble about songs
        that I'm really enjoying, what I'm learning about mixing and production, or even my
        experiences with the party scene.
      </p>
    </header>

    <section class="grid gap-6 md:grid-cols-2">
      <article
        class="rounded-3xl border border-[#2e2e2e] bg-[#1f1f1f] p-8 shadow-[0_16px_32px_rgba(0,0,0,0.35)]"
      >
        <h2 class="text-lg font-medium text-white">Stack</h2>
        <ul class="mt-4 space-y-2 text-sm text-gray-300">
          <li>↳ Vue 3 + Vite for the SPA foundation</li>
          <li>↳ Pinia for state management with strong typing</li>
          <li>↳ Supabase for data, auth, and storage</li>
          <li>↳ V Network Graph for the genre relationships</li>
        </ul>
      </article>
      <article class="rounded-3xl border border-dashed border-[#3a3a3a] p-8 text-sm text-gray-300">
        <h2 class="text-lg font-medium text-white">Roadmap highlights</h2>
        <ul class="mt-4 space-y-2">
          <li>↳ Author-driven blog with MD rendering</li>
          <li>↳ Animated graph interactions and theming</li>
          <li>↳ Genre-focused playlists and audio examples</li>
        </ul>
      </article>
    </section>
  </main>
</template>
