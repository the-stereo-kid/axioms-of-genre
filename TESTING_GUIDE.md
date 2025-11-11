# 🧪 Testing Guide - Axioms of Genre

> Step-by-step testing checklist for your Supabase + Pinia + Vue 3 app

## ✅ Pre-Flight Checklist

Before you start, ensure:

- [x] Supabase project is created
- [x] `.env.local` file exists with valid credentials
- [x] Database schema is created (ran `supabase-schema.sql`)
- [x] Dependencies are installed (`npm install`)

---

## 🧪 Test Suite

### Test 1: Supabase Connection ⚡

**Goal:** Verify database connection works

**Steps:**

1. Start dev server: `npm run dev`
2. Open browser console (F12)
3. Run:
   ```javascript
   import { supabase } from "./src/lib/supabaseClient";
   const { data, error } = await supabase.from("genres").select("*");
   console.log("Data:", data);
   console.log("Error:", error);
   ```

**Expected Result:**

- ✅ `data` contains 5 root genres (Techno, House, Trance, DnB, Dub)
- ✅ `error` is null
- ❌ If error: Check `.env.local` and Supabase dashboard

---

### Test 2: Query Functions 📊

**Goal:** Test query helper functions

**Steps:**

1. In console:

   ```javascript
   import { fetchRootGenres, fetchAllGenres } from "./src/lib/genreQueries";

   const rootGenres = await fetchRootGenres();
   console.table(rootGenres);

   const allGenres = await fetchAllGenres();
   console.log(`Total genres: ${allGenres.length}`);
   ```

**Expected Result:**

- ✅ `fetchRootGenres()` returns 5 genres
- ✅ All have `is_root: true`
- ✅ Each has: `id`, `name`, `bpm_min`, `bpm_max`, `description`, `color`

---

### Test 3: Pinia Store 🍍

**Goal:** Verify store state management

**Steps:**

1. Open Vue DevTools (Chrome extension)
2. Go to Pinia tab
3. Find `genre` store
4. Click "Load Genres" action
5. Watch state update

**Expected Result:**

- ✅ `genres` array populates
- ✅ `loading.genres` toggles true → false
- ✅ `rootGenres` computed shows 5 items

**Console Test:**

```javascript
import { useGenreStore } from "@/stores/genreStore";
const store = useGenreStore();

await store.loadAllData();
console.log("Root genres:", store.rootGenres);
console.log("All genres:", store.genres.length);
```

---

### Test 4: Graph Visualization 📈

**Goal:** Test network graph rendering

**Steps:**

1. Navigate to `/visualizer` route
2. Wait for graph to load

**Expected Result:**

- ✅ 5 genre nodes appear in circle
- ✅ Central empty node in middle
- ✅ Lines connect center to all genres
- ✅ No console errors
- ✅ Nodes are orange (#ee7129)

**Visual Check:**

- Nodes should be clickable (cursor changes on hover)
- Graph should fit in container (600x400px)

---

### Test 5: Node Selection 🎯

**Goal:** Test genre selection and detail display

**Steps:**

1. Click on "Techno" node in graph
2. Look at detail panel below graph

**Expected Result:**

- ✅ Detail panel shows genre info:
  - Name: "Techno"
  - BPM Range: "120 - 140"
  - Description appears
- ✅ Panel animates in (fadeIn effect)
- ✅ No console errors

**Console Check:**

```javascript
const store = useGenreStore();
console.log("Selected:", store.selectedGenre?.name);
```

---

### Test 6: Multiple Node Clicks 🔄

**Goal:** Test switching between genres

**Steps:**

1. Click "Techno" → verify details
2. Click "House" → verify details change
3. Click "DnB" → verify details change

**Expected Result:**

- ✅ Details update instantly
- ✅ Previous selection cleared
- ✅ Smooth transitions
- ✅ No flickering

---

### Test 7: Loading States ⏳

**Goal:** Verify loading indicators work

**Steps:**

1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Refresh page
4. Watch loading states

**Expected Result:**

- ✅ "Loading genres..." appears during fetch
- ✅ Graph shows after data loads
- ✅ Loading state clears properly

---

### Test 8: Error Handling 🚨

**Goal:** Test error scenarios

**Steps:**

1. Temporarily break `.env.local` (wrong URL)
2. Refresh page
3. Check console

**Expected Result:**

- ✅ Error message in console
- ✅ App doesn't crash
- ✅ Loading state clears
- ❗ Fix `.env.local` after testing!

---

## 🎓 Learning Tasks - Testing Your TODOs

### Task Test 1: fetchSubgenres()

**After implementing:**

```javascript
import { fetchSubgenres } from "./src/lib/genreQueries";

// First, add a subgenre in Supabase
// Then test:
const subs = await fetchSubgenres(1); // 1 = Techno's ID
console.log("Techno subgenres:", subs);
```

**Expected:** Array of subgenres connected to parent

---

### Task Test 2: fetchGenreElementsByGenreId()

**After implementing:**

```javascript
import { fetchGenreElementsByGenreId } from "./src/lib/genreQueries";

const elements = await fetchGenreElementsByGenreId(1);
console.table(elements);
```

**Expected:** Array of elements with `influence_strength` and joined `genre_elements` data

---

### Task Test 3: Store Getters

**After implementing `getSubgenresByParentId`:**

```javascript
const store = useGenreStore();
await store.loadAllData();

const subgenres = store.getSubgenresByParentId.value(1);
console.log("Subgenres of Techno:", subgenres);
```

**Expected:** Array of subgenre objects (not just IDs)

---

### Task Test 4: Subgenre Graph Expansion

**After implementing in GenresGraph.vue:**

**Steps:**

1. Add subgenres in Supabase (e.g., Acid House under House)
2. Click "House" node in graph
3. Look for new nodes appearing

**Expected:**

- ✅ Subgenre nodes appear around parent
- ✅ Edges connect parent to subgenres
- ✅ Layout positions them nicely

---

### Task Test 5: Element Display

**After implementing in GenresDetail.vue:**

**Steps:**

1. Add genre-element relations in Supabase
2. Click a genre with elements
3. Check detail panel

**Expected:**

- ✅ "Genre Elements" section appears
- ✅ Each element shows name + influence bar
- ✅ Influence bars scale correctly (1-10 → 10%-100%)
- ✅ Sorted by influence strength (highest first)

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@/stores/genreStore'"

**Solution:**

```bash
# Restart dev server
npm run dev
```

### Issue: Empty graph (no nodes)

**Debug:**

```javascript
const store = useGenreStore();
console.log("Genres loaded:", store.genres.length);
console.log("Root genres:", store.rootGenres.length);
console.log("Loading state:", store.loading.genres);
```

**Common causes:**

- Supabase URL/key incorrect
- RLS policies not set
- Data not in database

### Issue: "TypeError: Cannot read property 'name'"

**Cause:** Trying to access data before it loads

**Solution:** Add null checks:

```vue
<div v-if="genreStore.selectedGenre">
  {{ genreStore.selectedGenre.name }}
</div>
```

### Issue: Graph nodes not clickable

**Debug:**

```typescript
// In GenresGraph.vue
const eventHandlers = {
  "node:click": ({ node }) => {
    console.log("Clicked:", node); // Should log node name
    const genre = genreStore.genres.find((g) => g.name === node);
    console.log("Found genre:", genre); // Should log genre object
  },
};
```

---

## 📊 Performance Benchmarks

Test your app's performance:

### Network Requests

**Expected:**

- Initial load: 3 requests (genres, relationships, elements)
- Each < 100ms on good connection
- Total data < 50KB

**Test:**

```bash
# In DevTools Network tab
# Filter: Fetch/XHR
# Should see 3 Supabase API calls
```

### Component Render Time

**Expected:**

- Graph renders < 200ms
- Detail updates < 50ms
- No layout shifts

**Test with Performance tab:**

1. Record
2. Click through genres
3. Stop
4. Check flame graph

---

## ✅ Final Integration Test

**Complete User Flow:**

1. [ ] Navigate to `/visualizer`
2. [ ] Wait for graph to load (< 1s)
3. [ ] See 5 genre nodes in circle
4. [ ] Click "Techno"
5. [ ] See details appear below
6. [ ] Click "House"
7. [ ] Details update smoothly
8. [ ] Check console: No errors
9. [ ] Check DevTools: Pinia state correct
10. [ ] Refresh page: Everything reloads

**If all steps pass: 🎉 You're ready to extend!**

---

## 🚀 Next: Manual Testing Your Features

As you add features, test:

### After Adding Subgenres:

- [ ] Subgenres appear in table
- [ ] Clicking parent shows subgenres in graph
- [ ] Edges connect correctly
- [ ] Layout looks good

### After Adding Elements:

- [ ] Elements shown in detail view
- [ ] Influence bars render
- [ ] Sorted by strength
- [ ] Styling looks good

### After Adding Real-time:

- [ ] Open 2 browser tabs
- [ ] Update genre in Supabase dashboard
- [ ] Both tabs update automatically

---

## 📝 Test Checklist Summary

Copy this for your testing sessions:

```markdown
## Test Session: [Date]

### Basic Tests

- [ ] Supabase connection works
- [ ] Query functions return data
- [ ] Pinia store loads data
- [ ] Graph renders nodes
- [ ] Node clicks work
- [ ] Details display correctly

### Your TODOs

- [ ] fetchSubgenres() works
- [ ] fetchGenreElementsByGenreId() works
- [ ] Store getters work
- [ ] Subgenre expansion works
- [ ] Element display works

### Issues Found:

1.
2.
3.

### Notes:
```

---

**Happy Testing! 🧪**

Remember: Test early, test often. Small tests save big debugging sessions!
