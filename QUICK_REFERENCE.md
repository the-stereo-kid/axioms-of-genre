# 🔥 Quick Reference - Axioms of Genre

> Fireship-style cheat sheet for common patterns in this project

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run serve

# Build for production
npm run build

# Lint and fix
npm run lint
```

## 📁 Project Structure

```
src/
├── lib/                    # Supabase & utilities
│   ├── supabaseClient.ts   # DB connection
│   ├── database.types.ts   # TypeScript types
│   └── genreQueries.ts     # Reusable queries
├── stores/                 # Pinia state management
│   └── genreStore.ts       # Central genre state
├── components/             # Vue components
│   ├── GenresGraph.vue     # Network graph visualization
│   ├── GenresDetail.vue    # Genre info display
│   └── Axioms.vue          # Static content
└── views/                  # Route views
    ├── HomeView.vue        # Landing page
    └── VisualizerView.vue  # Main app view
```

## 🔥 Supabase Query Patterns

```typescript
// SELECT all
const { data, error } = await supabase
  .from("genres")
  .select("*")

  // WHERE clause
  .eq("is_root", true) // WHERE is_root = true
  .neq("name", "Techno") // WHERE name != 'Techno'
  .gt("bpm_min", 120) // WHERE bpm_min > 120
  .in("id", [1, 2, 3]) // WHERE id IN (1,2,3)

  // JOIN (nested select)
  .select("*, genre_elements(*)")

  // ORDER BY
  .order("name", { ascending: true })

  // LIMIT
  .limit(10)

  // Single result (throws if not found)
  .single();

// Always check errors!
if (error) throw error;
```

## 🍍 Pinia Store Pattern

```typescript
// Define store
export const useGenreStore = defineStore("genre", () => {
  // ⚡ STATE: ref() or reactive()
  const genres = ref<Genre[]>([]);

  // 📊 GETTERS: computed()
  const rootGenres = computed(() => genres.value.filter((g) => g.is_root));

  // 🎬 ACTIONS: async function
  async function loadGenres() {
    genres.value = await fetchAllGenres();
  }

  // 🔄 RETURN: expose everything
  return { genres, rootGenres, loadGenres };
});

// Use in component
const store = useGenreStore();
store.loadGenres();
console.log(store.rootGenres);
```

## 🎯 Vue Composition API Cheat Sheet

### Reactive State

```typescript
import { ref, reactive, computed } from "vue";

// Primitives: use ref
const count = ref(0);
count.value = 1; // .value in script
{
  {
    count;
  }
} // auto-unwrap in template

// Objects: use reactive
const state = reactive({
  name: "Techno",
  bpm: 130,
});
state.bpm = 140; // no .value

// Computed (cached)
const double = computed(() => count.value * 2);
```

### Lifecycle Hooks

```typescript
import { onMounted, onUnmounted, watch } from "vue";

onMounted(() => {
  console.log("Component mounted!");
});

onUnmounted(() => {
  console.log("Cleanup");
});

// Watch reactive data
watch(count, (newVal, oldVal) => {
  console.log(`Changed from ${oldVal} to ${newVal}`);
});
```

### Component Structure

```vue
<template>
  <div>{{ message }}</div>
  <button @click="increment">Count: {{ count }}</button>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Props
const props = defineProps<{
  message: string;
}>();

// Emits
const emit = defineEmits<{
  change: [value: number];
}>();

// Local state
const count = ref(0);
const increment = () => {
  count.value++;
  emit("change", count.value);
};
</script>
```

## 🗃️ Database Schema Reference

### Tables

```sql
genres
  - id: bigint (PK)
  - name: text
  - bpm_min: integer
  - bpm_max: integer
  - description: text
  - color: text
  - is_root: boolean

genre_elements
  - id: bigint (PK)
  - name: text
  - description: text

genre_element_relations
  - id: bigint (PK)
  - genre_id: bigint (FK → genres)
  - element_id: bigint (FK → genre_elements)
  - influence_strength: integer (1-10)
  - notes: text

genre_relationships
  - id: bigint (PK)
  - parent_genre_id: bigint (FK → genres)
  - child_genre_id: bigint (FK → genres)
  - relationship_type: enum
    ('subgenre', 'influenced_by', 'fusion', 'evolution')
```

## 🎨 Common Patterns in This Project

### Load Data on Mount

```typescript
import { onMounted } from "vue";
import { useGenreStore } from "@/stores/genreStore";

const genreStore = useGenreStore();

onMounted(() => {
  genreStore.loadAllData();
});
```

### Handle Node Click in Graph

```typescript
const eventHandlers = {
  "node:click": ({ node }) => {
    const genre = genreStore.genres.find((g) => g.name === node);
    if (genre) {
      genreStore.selectGenre(genre.id);
    }
  },
};
```

### Display Loading State

```vue
<template>
  <div v-if="genreStore.loading.genres">Loading...</div>
  <div v-else-if="genreStore.error">Error: {{ genreStore.error }}</div>
  <div v-else>
    <!-- Your content -->
  </div>
</template>
```

### Dynamic Graph Nodes

```typescript
const nodes = computed(() => {
  const nodeMap = {};
  genreStore.rootGenres.forEach((genre) => {
    nodeMap[genre.name] = {
      name: genre.name,
      color: genre.color,
    };
  });
  return nodeMap;
});
```

## 🐛 Debug Commands

```javascript
// Browser console

// Check Supabase connection
const { data } = await supabase.from("genres").select("*");
console.table(data);

// Access Pinia store
const store = window.__PINIA__.state.value.genre;
console.log(store);

// Test query function
import { fetchRootGenres } from "./lib/genreQueries";
const genres = await fetchRootGenres();
console.log(genres);
```

## 🔥 Performance Tips

```typescript
// ❌ BAD: Creates new array every render
const list = genres.value.filter((g) => g.is_root);

// ✅ GOOD: Computed is cached
const rootGenres = computed(() => genres.value.filter((g) => g.is_root));

// ❌ BAD: Fetches on every click
async function onClick() {
  const data = await fetchGenres();
}

// ✅ GOOD: Fetch once, reuse from store
onMounted(() => {
  genreStore.loadGenres();
});
```

## 📚 Essential Links

- [Supabase Docs](https://supabase.com/docs)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Vue 3 Docs](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎯 Next Learning Steps

1. ✅ Complete TODOs in `src/lib/genreQueries.ts`
2. ✅ Implement store methods in `src/stores/genreStore.ts`
3. ✅ Add real data to Supabase
4. ✅ Expand graph to show subgenres
5. ✅ Display genre elements with influence bars
6. 🚀 Add real-time subscriptions
7. 🎨 Enhance UI/UX
8. 📱 Make it responsive

---

**Pro tip:** Keep this file open in a split pane while coding!
