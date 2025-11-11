# 🚀 Axioms of Genre - Learning Guide

Welcome to your Fireship-style learning journey! This guide will walk you through understanding and extending your newly scaffolded Supabase + Pinia + Vue 3 project.

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Module 1: Supabase Foundation](#module-1-supabase-foundation)
3. [Module 2: Pinia State Management](#module-2-pinia-state-management)
4. [Module 3: Composition API Patterns](#module-3-composition-api-patterns)
5. [Your Learning Tasks](#your-learning-tasks)
6. [Advanced Challenges](#advanced-challenges)
7. [Resources](#resources)

---

## 🎯 Quick Start

### 1. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and run it in the SQL Editor
5. Check **Table Editor** to verify your tables were created

### 2. Verify Environment Variables

Your `.env.local` should look like this:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install Dependencies & Run

```bash
npm install
npm run serve
```

### 4. Test the Basic Setup

Open browser console (F12) and try:

```javascript
// Test Supabase connection
import { supabase } from './src/lib/supabaseClient'
const { data, error } = await supabase.from('genres').select('*')
console.log('Genres:', data)
```

---

## Module 1: Supabase Foundation

### 🧠 Core Concepts

**What is Supabase?**
- PostgreSQL database in the cloud
- Auto-generated REST API
- Real-time subscriptions via WebSockets
- Row Level Security (RLS) for data protection

**Architecture:**
```
Your Vue App → Supabase Client → REST API → PostgreSQL
```

### 📖 Key Files

1. **`src/lib/supabaseClient.ts`**
   - Single source of truth for database connection
   - Exports typed `supabase` client

2. **`src/lib/database.types.ts`**
   - TypeScript interfaces matching your database schema
   - Provides autocomplete in your IDE!

3. **`src/lib/genreQueries.ts`**
   - Reusable query functions
   - **YOUR TASKS HERE:** Implement the TODO functions

### 🎯 Learning Task 1: Understanding Queries

**Pattern:** Every Supabase query returns `{ data, error }`

```typescript
// Basic select
const { data, error } = await supabase
  .from('genres')
  .select('*')

// With filters
const { data } = await supabase
  .from('genres')
  .select('*')
  .eq('is_root', true)  // WHERE is_root = true
  .order('name')        // ORDER BY name
```

**Practice:** Open `src/lib/genreQueries.ts` and implement:

1. `fetchSubgenres()` - Join query to get subgenres
   - Hint: Use `.select('relationship_type, genres!child_genre_id(*)')`
   - [Docs: Joins and Nesting](https://supabase.com/docs/guides/database/joins-and-nesting)

2. `fetchGenreElementsByGenreId()` - Get elements with influence strength
   - Hint: Join `genre_element_relations` with `genre_elements`

### 🔒 Row Level Security (RLS)

**Why RLS?**
- Security at the database level
- Even if someone steals your API key, they can't bypass policies
- Define WHO can access WHAT data

**Example from your schema:**
```sql
CREATE POLICY "Public can read genres" 
  ON genres FOR SELECT 
  TO anon 
  USING (true);
```

This allows anonymous users to READ but not WRITE.

### 🧪 Testing Checkpoint

```bash
# In your terminal
npm run serve
```

**Browser Console Tests:**
```javascript
import { fetchRootGenres } from './lib/genreQueries'

// Should return 5 root genres
const genres = await fetchRootGenres()
console.table(genres)
```

---

## Module 2: Pinia State Management

### 🧠 Core Concepts

**What is Pinia?**
- Official state management for Vue 3
- Replaces Vuex with simpler API
- Perfect TypeScript support
- DevTools integration for debugging

**Why Use a Store?**
```
WITHOUT STORE:
Component A needs data → fetches from Supabase
Component B needs same data → fetches again (duplicate!)
Component C updates data → A and B don't know

WITH STORE:
All components → share same reactive state
One fetch → everyone sees the data
One update → everyone reacts automatically
```

### 📖 Key Files

**`src/stores/genreStore.ts`** - Your central genre state

```typescript
// Composition API Store Pattern
export const useGenreStore = defineStore('genre', () => {
  // STATE: ref() or reactive()
  const genres = ref<Genre[]>([])
  
  // GETTERS: computed()
  const rootGenres = computed(() => genres.value.filter(g => g.is_root))
  
  // ACTIONS: async function
  async function loadGenres() {
    genres.value = await fetchAllGenres()
  }
  
  // RETURN: expose to components
  return { genres, rootGenres, loadGenres }
})
```

### 🎯 Learning Task 2: Implement Store Methods

**In `src/stores/genreStore.ts`, complete:**

1. **`getSubgenresByParentId` getter**
   ```typescript
   const getSubgenresByParentId = computed(() => {
     return (parentId: number) => {
       // Find relationships where parent_genre_id = parentId
       const subgenreIds = relationships.value
         .filter(r => r.parent_genre_id === parentId)
         .map(r => r.child_genre_id)
       
       // Return actual genre objects
       return genres.value.filter(g => subgenreIds.includes(g.id))
     }
   })
   ```

2. **`selectGenreByName` action**
   ```typescript
   async function selectGenreByName(name: string) {
     const genre = genres.value.find(g => g.name === name)
     if (genre) {
       await selectGenre(genre.id)
     }
   }
   ```

### 🔍 Using the Store in Components

```vue
<script setup lang="ts">
import { useGenreStore } from '@/stores/genreStore'
import { onMounted } from 'vue'

const genreStore = useGenreStore()

// Load data on mount
onMounted(() => {
  genreStore.loadAllData()
})
</script>

<template>
  <!-- Direct access to store state -->
  <div v-for="genre in genreStore.rootGenres" :key="genre.id">
    {{ genre.name }}
  </div>
</template>
```

### 🧪 Testing Checkpoint

**Vue DevTools (Chrome Extension):**
1. Install [Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/)
2. Open DevTools → Pinia tab
3. Watch state update in real-time as you click nodes!

**Console Test:**
```javascript
// Access store from console
const store = window.__PINIA__.state.value.genre
console.log(store.genres)
```

---

## Module 3: Composition API Patterns

### 🧠 Core Concepts

**Class Components vs Composition API**

```vue
<!-- ❌ OLD: Class Component (Options API) -->
<script lang="ts">
export default class MyComponent extends Vue {
  data() {
    return { count: 0 }
  }
  
  get doubleCount() {
    return this.count * 2
  }
  
  increment() {
    this.count++
  }
}
</script>

<!-- ✅ NEW: Composition API -->
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)
const increment = () => count.value++
</script>
```

**Benefits:**
- ✅ No `this` keyword confusion
- ✅ Better TypeScript inference
- ✅ Group code by feature (not by option type)
- ✅ Easier to extract and reuse logic
- ✅ Smaller bundle size

### 📖 Key Patterns You'll See

#### 1. Reactive State

```typescript
// ref: primitive values
const count = ref(0)
count.value = 1  // .value needed in script

// reactive: objects
const state = reactive({ count: 0 })
state.count = 1  // no .value

// In template: no .value needed
{{ count }}  // automatically unwrapped
```

#### 2. Computed Values

```typescript
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})
```

#### 3. Lifecycle Hooks

```typescript
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('Component mounted!')
})

onUnmounted(() => {
  console.log('Cleanup here')
})
```

### 🎯 Learning Task 3: Explore the Migrated Components

**Study these files to see patterns in action:**

1. **`src/components/GenresDetail.vue`**
   - Simple component with store access
   - Conditional rendering
   - Loading states

2. **`src/components/GenresGraph.vue`**
   - Complex computed properties
   - Event handlers
   - Dynamic data transformation

3. **`src/views/VisualizerView.vue`**
   - Shows how simple parent components become
   - No prop drilling!

### 🧪 Testing Checkpoint

Run the app and verify:
- [ ] Graph loads with genres from Supabase
- [ ] Clicking a node shows details below
- [ ] No console errors

---

## 🎯 Your Learning Tasks

Complete these TODOs in order:

### Task 1: Complete Query Functions ⭐

**File:** `src/lib/genreQueries.ts`

1. Implement `fetchSubgenres(parentId: number)`
2. Implement `fetchGenreElementsByGenreId(genreId: number)`

**Test:** Console should show subgenres and elements

### Task 2: Complete Store Logic ⭐⭐

**File:** `src/stores/genreStore.ts`

1. Implement `getSubgenresByParentId` computed
2. Implement `selectGenreByName` action

**Test:** Clicking nodes should select them

### Task 3: Add Sample Data to Supabase ⭐

1. Add 2-3 subgenres to your `genres` table
2. Connect elements to genres in `genre_element_relations`
3. Create parent-child relationships in `genre_relationships`

**Example SQL:**
```sql
-- Add Acid House as subgenre of House
WITH house AS (SELECT id FROM genres WHERE name = 'House'),
     acid_house AS (
       INSERT INTO genres (name, bpm_min, bpm_max, description, is_root)
       VALUES ('Acid House', 118, 128, 'House with TB-303 acid basslines', false)
       RETURNING id
     )
INSERT INTO genre_relationships (parent_genre_id, child_genre_id, relationship_type)
SELECT house.id, acid_house.id, 'subgenre'
FROM house, acid_house;
```

### Task 4: Expand Graph to Show Subgenres ⭐⭐⭐

**File:** `src/components/GenresGraph.vue`

Enhance the `nodes` computed property to include subgenres:

```typescript
const nodes = computed<Nodes>(() => {
  const nodeMap: Nodes = { center: { name: '' } }
  
  // Add root genres
  genreStore.rootGenres.forEach(genre => {
    nodeMap[genre.name] = { name: genre.name, color: genre.color }
  })
  
  // TODO: Add subgenres if parent is selected
  if (genreStore.selectedGenre) {
    const subgenres = genreStore.getSubgenresByParentId.value(genreStore.selectedGenre.id)
    subgenres.forEach(sub => {
      nodeMap[sub.name] = { 
        name: sub.name, 
        color: sub.color || '#666' 
      }
    })
  }
  
  return nodeMap
})
```

**Also update edges and layouts!**

### Task 5: Display Genre Elements ⭐⭐

**File:** `src/components/GenresDetail.vue`

Uncomment and fix the elements display section:

```vue
<div v-for="elem in genreStore.selectedGenreElements" 
     :key="elem.element_id" 
     class="element-card">
  <div class="element-name">{{ elem.genre_elements.name }}</div>
  <div class="influence-bar" 
       :style="{ width: (elem.influence_strength * 10) + '%' }">
  </div>
  <span class="influence-value">{{ elem.influence_strength }}/10</span>
</div>
```

---

## 🏆 Advanced Challenges

Once you've completed the basics, try these:

### Challenge 1: Real-time Updates

Add Supabase real-time subscriptions:

```typescript
// In genreStore.ts
supabase
  .channel('genres-changes')
  .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'genres' },
      (payload) => {
        console.log('Genre changed!', payload)
        loadGenres() // Refresh data
      }
  )
  .subscribe()
```

### Challenge 2: Add Genre Colors to Graph

Use genre.color from database to style nodes dynamically.

### Challenge 3: Create Admin Panel

Build CRUD interface to add/edit genres (requires auth).

### Challenge 4: Graph Filters

Add controls to filter by BPM range or relationship type.

### Challenge 5: Export/Import

Add buttons to export graph as JSON or PNG.

---

## 📚 Resources

### Official Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript + Vue](https://vuejs.org/guide/typescript/overview.html)

### Key Learning Pages

**Supabase:**
- [JavaScript Client](https://supabase.com/docs/reference/javascript/select)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

**Pinia:**
- [Defining Stores](https://pinia.vuejs.org/core-concepts/)
- [State, Getters, Actions](https://pinia.vuejs.org/core-concepts/state.html)

**Vue 3:**
- [ref() vs reactive()](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Computed Properties](https://vuejs.org/guide/essentials/computed.html)
- [Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)

### Video Tutorials

- [Fireship: Supabase in 100 Seconds](https://www.youtube.com/watch?v=zBZgdTb-dns)
- [Fireship: Pinia in 100 Seconds](https://www.youtube.com/watch?v=JGC7aAC-3y8)
- [Vue Mastery: Composition API](https://www.vuemastery.com/courses/vue-3-essentials/why-the-composition-api/)

---

## 🐛 Troubleshooting

### "Cannot find module '@/lib/supabaseClient'"

- Check that `@` alias is configured in `tsconfig.json`
- Restart your dev server

### "Error: Invalid API key"

- Verify `.env.local` has correct `VITE_` prefix
- Restart dev server after changing env vars
- Check Supabase dashboard for correct keys

### "RLS policy violation"

- Ensure you ran the RLS policies from `supabase-schema.sql`
- Check Table Editor → Select your table → RLS policies

### Graph not showing data

1. Check browser console for errors
2. Verify data exists: `supabase.from('genres').select('*')`
3. Check Pinia DevTools → genre store → state

---

## 🎓 What You've Learned

By completing this guide, you now understand:

✅ **Supabase:**
- PostgreSQL database setup
- Row Level Security (RLS)
- Query builder patterns
- JOIN queries

✅ **Pinia:**
- Store definition with Composition API
- State, getters, actions
- Using stores in components
- DevTools debugging

✅ **Vue 3 Composition API:**
- `<script setup>` syntax
- `ref()` and `computed()`
- Lifecycle hooks
- TypeScript integration

✅ **Modern Patterns:**
- Centralized state management
- Type-safe database queries
- Component composition
- Reactive data flow

---

## 🚀 Next Steps

1. Complete all TODOs in the codebase
2. Add your own genre knowledge to the database
3. Enhance the graph visualization
4. Share with friends and get feedback!

**Happy coding! 🎉**

Need help? Check the inline comments in each file - they're packed with learning notes and hints!

