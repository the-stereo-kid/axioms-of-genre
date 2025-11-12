<template>
  <main class="mx-auto flex min-h-[70vh] max-w-5xl flex-col gap-12 px-6 py-16 text-left">
    <header class="space-y-4">
      <p class="text-sm uppercase tracking-[0.35em] text-gray-400">Journal</p>
      <h1 class="text-4xl font-semibold text-white">Insights from the studio</h1>
      <p class="max-w-2xl text-base text-gray-300">
        We will use this space to publish deep dives on genre archetypes, production walkthroughs,
        and release notes as the project evolves. Once Supabase policies are in place this page will
        render live content from the `posts` table.
      </p>
    </header>

    <section class="grid gap-8 md:grid-cols-2">
      <article
        class="rounded-3xl border border-[#2f2f2f] bg-[#1f1f1f] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
      >
        <p class="mb-2 text-xs uppercase tracking-[0.3em] text-[#ff8d48]">Coming soon</p>
        <h2 class="text-2xl font-medium text-white">Your first Supabase-powered post</h2>
        <p class="mt-3 text-sm text-gray-300">
          Once the author dashboard ships, draft copy here and publish to share genre theories with
          the community.
        </p>
      </article>
      <article class="rounded-3xl border border-dashed border-[#373737] p-8 text-sm text-gray-400">
        <p class="font-medium text-white">Implementation notes</p>
        <ul class="mt-3 space-y-2">
          <li>
            ↳ Fetch posts with `supabase.from('posts').select('*').order('published_at', {
            ascending: false })`
          </li>
          <li>↳ Render markdown with `markdown-it` or MDX once we need embeds</li>
          <li>↳ Surface related genres via the existing `genreStore` relationships</li>
        </ul>
      </article>
    </section>
  </main>
</template>
