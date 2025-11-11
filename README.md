# 🎵 Axioms of Genre

> A visual exploration of electronic music genre relationships powered by Supabase, Pinia, and Vue 3

An interactive graph visualization showing how electronic music genres connect, influence, and evolve from each other. Built as a learning project to master modern Vue 3 patterns with real-world backend integration.

![Tech Stack](https://img.shields.io/badge/Vue-3.2-brightgreen)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-blue)
![Pinia](https://img.shields.io/badge/Pinia-State_Management-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (see Setup below)
cp .env.local.example .env.local

# Run the app
npm run serve
```

Then navigate to `http://localhost:8080`

---

## 📖 Documentation

This project is designed as a hands-on learning experience:

- **[LEARNING_GUIDE.md](./LEARNING_GUIDE.md)** - Complete Fireship-style tutorial
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Cheat sheet for common patterns
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Step-by-step testing checklist

---

## 🎯 Project Goals

### Design Question

**How do we visually present the complex relationships between electronic music genres?**

### Solution

- **Graph visualization** showing genres as interconnected nodes
- **Hierarchical structure**: Root genres → subgenres → elements
- **Relationship modeling**: Genres can influence, evolve from, or fuse with others
- **Dynamic exploration**: Click genres to see details and expand subgenres

### The Axioms

**Core Principles:**
- Focus on electronic music (tempo-driven with consistent beat grid)
- Based on musical understanding and appreciation
- Broad categorization with noted exceptions
- Elements (acid, breakbeat, etc.) define and connect genres
- Consider production, cultural, and technological evolution

---

## 🛠️ Tech Stack

### Frontend
- **Vue 3** with Composition API (`<script setup>`)
- **TypeScript** for type safety
- **Pinia** for state management
- **v-network-graph** for graph visualization
- **Tailwind CSS** for styling

### Backend
- **Supabase** (PostgreSQL + REST API)
- Row Level Security (RLS) for data protection
- Real-time subscriptions (ready to implement)

### Developer Experience
- Vue DevTools for debugging
- TypeScript auto-completion
- Hot module replacement
- Linting with ESLint

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Vue 3 App     │
│  (Components)   │
└────────┬────────┘
         │
    ┌────▼─────┐
    │  Pinia   │ ← Centralized State
    │  Store   │
    └────┬─────┘
         │
  ┌──────▼────────┐
  │   Supabase    │
  │    Client     │
  └──────┬────────┘
         │
  ┌──────▼────────┐
  │  PostgreSQL   │
  │   Database    │
  └───────────────┘
```

---

## 📊 Database Schema

### Core Tables

**genres** - Main and sub-genres
```sql
id, name, bpm_min, bpm_max, description, color, is_root
```

**genre_elements** - Building blocks (acid sound, breakbeat, etc.)
```sql
id, name, description
```

**genre_element_relations** - How elements define genres
```sql
genre_id, element_id, influence_strength (1-10)
```

**genre_relationships** - How genres connect
```sql
parent_genre_id, child_genre_id, relationship_type
```

See `supabase-schema.sql` for complete schema.

---

## 🎓 Setup Instructions

### 1. Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Copy and paste contents of `supabase-schema.sql`
5. Run the SQL to create tables and policies

### 2. Environment Variables

Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: Supabase Dashboard → Settings → API

### 3. Install and Run

```bash
npm install
npm run serve
```

---

## 🎯 Learning Path

This project is structured as a hands-on course. Complete these in order:

### Module 1: Supabase Foundation ⭐
- Understand PostgreSQL + REST API
- Learn Row Level Security (RLS)
- Master query patterns and JOINs
- **Files:** `src/lib/genreQueries.ts`

### Module 2: Pinia State Management ⭐⭐
- Define stores with Composition API
- State, getters, and actions
- Component communication via store
- **Files:** `src/stores/genreStore.ts`

### Module 3: Composition API ⭐⭐⭐
- Migrate from class components
- Use `ref()`, `computed()`, lifecycle hooks
- Modern TypeScript patterns
- **Files:** All `.vue` components

### Your Tasks 🎯

Complete TODOs in:
1. `src/lib/genreQueries.ts` - Implement query functions
2. `src/stores/genreStore.ts` - Complete store logic
3. `src/components/GenresGraph.vue` - Add subgenre expansion
4. `src/components/GenresDetail.vue` - Display genre elements

---

## 🔥 Features

### Current
- ✅ Graph visualization of root genres
- ✅ Click nodes to see genre details
- ✅ Dynamic data from Supabase
- ✅ Type-safe queries with TypeScript
- ✅ Centralized state with Pinia
- ✅ Modern Composition API

### To Implement (Your Tasks!)
- ⏳ Subgenre expansion on node click
- ⏳ Genre elements display with influence strength
- ⏳ Relationship visualization
- ⏳ Real-time updates
- ⏳ Search and filter
- ⏳ Admin panel for CRUD operations

---

## 📁 Project Structure

```
axioms-of-genre/
├── src/
│   ├── lib/                    # Supabase utilities
│   │   ├── supabaseClient.ts   # DB connection
│   │   ├── database.types.ts   # TypeScript types
│   │   └── genreQueries.ts     # Query functions
│   ├── stores/                 # Pinia stores
│   │   └── genreStore.ts       # Genre state management
│   ├── components/             # Vue components
│   │   ├── Axioms.vue          # Static content
│   │   ├── GenresGraph.vue     # Network graph
│   │   └── GenresDetail.vue    # Genre details
│   ├── views/                  # Route views
│   │   ├── HomeView.vue        # Landing page
│   │   └── VisualizerView.vue  # Main app
│   ├── router/                 # Vue Router
│   └── main.ts                 # App entry
├── supabase-schema.sql         # Database schema
├── LEARNING_GUIDE.md           # Complete tutorial
├── QUICK_REFERENCE.md          # Cheat sheet
└── TESTING_GUIDE.md            # Testing checklist
```

---

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for complete testing checklist.

**Quick test:**
```bash
npm run serve
# Navigate to http://localhost:8080/visualizer
# Click on genre nodes - details should appear below
```

---

## 📚 Resources

### Official Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

### Video Tutorials
- [Fireship: Supabase in 100 Seconds](https://www.youtube.com/watch?v=zBZgdTb-dns)
- [Fireship: Pinia in 100 Seconds](https://www.youtube.com/watch?v=JGC7aAC-3y8)

---

## 🤝 Contributing

This is a learning project, but contributions welcome!

1. Fork the repo
2. Create a feature branch
3. Complete your TODOs
4. Test thoroughly
5. Submit a PR

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎓 What You'll Learn

By working through this project, you'll master:

✅ **Supabase:**
- PostgreSQL setup and schema design
- Row Level Security (RLS)
- Query builder patterns
- JOIN queries and relationships

✅ **Pinia:**
- Composition API store pattern
- State, getters, actions
- Component communication
- DevTools debugging

✅ **Vue 3:**
- `<script setup>` syntax
- Reactive state with `ref()` and `computed()`
- Lifecycle hooks
- TypeScript integration

✅ **Modern Patterns:**
- Type-safe database queries
- Centralized state management
- Component composition
- Reactive data flow

---

## 🚀 Next Steps

1. Complete [LEARNING_GUIDE.md](./LEARNING_GUIDE.md)
2. Implement all TODOs
3. Add your own music knowledge to the database
4. Enhance the visualization
5. Share with friends!

---

**Built with ❤️ for learning modern web development**

Questions? Check the inline code comments - they're packed with explanations!
