<template>
  <div class="graph-container">
    <!-- Loading state -->
    <div v-if="genreStore.loading.genres" class="loading-overlay">
      <p>Loading genres...</p>
    </div>

    <v-network-graph
      v-else-if="hasGraphData"
      class="graph"
      :nodes="nodes"
      :edges="edges"
      :layouts="layouts"
      :event-handlers="eventHandlers"
    />

    <div v-else class="loading-overlay">
      <p>loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 🎯 COMPOSITION API - GenresGraph Component
 *
 * This component builds a network graph from Supabase data dynamically.
 *
 * KEY CONCEPTS:
 * - ref() for DOM references
 * - computed() for derived reactive data
 * - Watchers to rebuild graph when store data changes
 *
 * GRAPH STRUCTURE:
 * - Central node (empty) connects to all root genres
 * - Root genres can expand to show subgenres (TODO for you!)
 * - Layout uses circular positioning
 */

import { computed } from "vue";
import { VNetworkGraph, type Nodes, type Edges, type Layouts } from "v-network-graph";
import type * as vNG from "v-network-graph";
import { useGenreStore } from "@/stores/genreStore";

// Get store instance
const genreStore = useGenreStore();

/**
 * 🎯 COMPUTED: Dynamic Nodes
 *
 * Builds nodes object from Pinia store data.
 * Nodes include a central node + all root genres
 * When a genre is selected we also render its direct subgenres (and, if the
 * selection is a child, we surface its parent for context).
 */
const nodes = computed<Nodes>(() => {
  const nodeMap: Nodes = {
    center: { name: "" }, // Central node
  };

  // Add all root genres
  genreStore.rootGenres.forEach((genre) => {
    nodeMap[genre.name] = {
      name: genre.name,
      color: genre.color || "#ee7129",
    };
  });

  const selected = genreStore.selectedGenre;
  const parentGenres = selected?.id != null ? genreStore.getParentGenresByChildId(selected.id) : [];
  const focusAnchor = selected && selected.is_root ? selected : parentGenres[0] ?? selected;

  if (focusAnchor) {
    nodeMap[focusAnchor.name] = {
      name: focusAnchor.name,
      color: focusAnchor.color || "#ee7129",
    };

    const directSubgenres = genreStore.getSubgenresByParentId(focusAnchor.id);
    directSubgenres.forEach((sub) => {
      nodeMap[sub.name] = {
        name: sub.name,
        color: sub.color || "#9c6ef3",
      };
    });
  }

  // Always make sure the actively selected genre is present
  if (selected) {
    nodeMap[selected.name] = {
      name: selected.name,
      color: selected.color || "#ee7129",
    };
  }

  return nodeMap;
});

const hasGraphData = computed(() => Object.keys(nodes.value).length > 1);

/**
 * 🎯 COMPUTED: Dynamic Edges
 *
 * Creates connections between nodes.
 * Currently connects center to all root genres.
 *
 * TODO: Add edges for genre relationships (subgenres, influences, etc.)
 */
const edges = computed<Edges>(() => {
  const edgeMap: Edges = {};
  const makeKey = (source: string, target: string) =>
    `edge-${source.replace(/\s+/g, "_")}-${target.replace(/\s+/g, "_")}`;

  // Connect center to all root genres
  genreStore.rootGenres.forEach((genre) => {
    edgeMap[makeKey("center", genre.name)] = {
      source: "center",
      target: genre.name,
    };
  });

  const selected = genreStore.selectedGenre;
  const parentGenres = selected?.id != null ? genreStore.getParentGenresByChildId(selected.id) : [];
  const focusAnchor = selected && selected.is_root ? selected : parentGenres[0] ?? selected;

  if (focusAnchor) {
    const directSubgenres = genreStore.getSubgenresByParentId(focusAnchor.id);
    directSubgenres.forEach((sub) => {
      edgeMap[makeKey(focusAnchor.name, sub.name)] = {
        source: focusAnchor.name,
        target: sub.name,
      };
    });
  }

  return edgeMap;
});

/**
 * 🎯 COMPUTED: Dynamic Layouts
 *
 * Positions nodes in a circular pattern around the center.
 * Uses trigonometry for circular arrangement!
 */
const layouts = computed<Layouts>(() => {
  const layoutMap: Layouts = {
    nodes: {
      center: { x: 0, y: 0 },
    },
  };

  const rootGenres = genreStore.rootGenres;
  const angleStep = rootGenres.length ? (2 * Math.PI) / rootGenres.length : 0;
  const radius = 120;

  rootGenres.forEach((genre, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start at top
    layoutMap.nodes[genre.name] = {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  const selected = genreStore.selectedGenre;
  const parentGenres = selected?.id != null ? genreStore.getParentGenresByChildId(selected.id) : [];
  const focusAnchor = selected && selected.is_root ? selected : parentGenres[0] ?? selected;

  if (focusAnchor) {
    const anchorPosition = layoutMap.nodes[focusAnchor.name] || { x: 0, y: 0 };
    const subgenres = genreStore.getSubgenresByParentId(focusAnchor.id);

    if (subgenres.length) {
      const subAngleStep = (2 * Math.PI) / subgenres.length;
      const subRadius = 60;

      subgenres.forEach((sub, index) => {
        const angle = index * subAngleStep - Math.PI / 2;
        layoutMap.nodes[sub.name] = {
          x: anchorPosition.x + Math.cos(angle) * subRadius,
          y: anchorPosition.y + Math.sin(angle) * subRadius,
        };
      });
    }
  }

  return layoutMap;
});

/**
 * 🎯 EVENT HANDLERS
 *
 * Handle node clicks to select genres and show details
 */
const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    // Don't select the center node
    if (node === "center") return;

    genreStore.selectGenreByName(node);
  },

  // TODO: Add hover tooltip showing BPM range and quick info
  // 'node:pointerover': ({ node }) => {
  //   // Show tooltip with genre.description
  // },
  // 'node:pointerout': ({ node }) => {
  //   // Hide tooltip
  // }
};

/**
 * Load data when component mounts
 */
/**
 * 🎯 LEARNING NOTE: Composition API Benefits
 *
 * Compare this to the old class-based component:
 * ✓ All logic is grouped by feature (nodes, edges, layouts)
 * ✓ No "this" keyword confusion
 * ✓ TypeScript auto-complete works perfectly
 * ✓ Can extract logic into composables if needed
 * ✓ Easier to test (just functions!)
 */
</script>

<style>
/* Use some global styles outside of inline styles for container and backgrounds */
template {
  height: 100%;
}

.graph-container {
  position: relative;
  margin: auto;
  width: 100%;
  max-width: 600px;
  height: 400px;
  min-height: 300px;
}

@media (min-width: 640px) {
  .graph-container {
    height: 400px;
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dddddd33;
  border-radius: 4%;
  color: #999;
}

.graph {
  width: 100%;
  height: 100%;
  background: #dddddd33;
  border-radius: 4%;
}

.graph-container circle {
  background-color: #ee7129dd;
  fill: #ee7129dd !important;
  opacity: 1;
  cursor: pointer;
  transition: opacity 0.2s;
}

.graph-container circle:hover {
  opacity: 0.8;
}

.graph-container path {
  stroke: #ee7129dd !important;
  stroke-width: 2 !important;
  opacity: 0.1;
}
</style>
