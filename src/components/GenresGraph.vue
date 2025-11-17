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
      :config="graphConfig"
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
 * This component builds a network graph centered on "Groovy Techno" with its subgenres.
 *
 * KEY CONCEPTS:
 * - ref() for DOM references
 * - computed() for derived reactive data
 * - Watchers to rebuild graph when store data changes
 *
 * GRAPH STRUCTURE:
 * - Groovy Techno at the center
 * - Subgenres arranged in a circle around it
 * - Layout uses circular positioning
 */

import { computed } from "vue";
import { VNetworkGraph, type Nodes, type Edges, type Layouts } from "v-network-graph";
import type * as vNG from "v-network-graph";
import { useGenreStore } from "@/stores/genreStore";

// Get store instance
const genreStore = useGenreStore();

// Detect if device is touch-enabled
const isTouchDevice = computed(() => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
});

// Graph config: disable pan/zoom on touch devices to prevent interference with page scrolling
const graphConfig = computed(() => {
  if (isTouchDevice.value) {
    return {
      pan: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
    };
  }
  return {};
});

/**
 * 🎯 COMPUTED: Dynamic Nodes
 *
 * Builds nodes object centered on "Groovy Techno" with its subgenres.
 * Only shows Groovy Techno and its direct subgenres.
 */
const groovyTechno = computed(() => {
  return genreStore.genres.find((g) => g.name === "Groovy Techno");
});

const nodes = computed<Nodes>(() => {
  const nodeMap: Nodes = {};

  // If Groovy Techno not found yet, return empty map
  if (!groovyTechno.value) {
    return nodeMap;
  }

  // Add Groovy Techno as the central node
  nodeMap[groovyTechno.value.name] = {
    name: groovyTechno.value.name,
    color: groovyTechno.value.color || "#ee7129",
  };

  // Get subgenres of Groovy Techno
  const subgenres = genreStore.getSubgenresByParentId(groovyTechno.value.id);
  subgenres.forEach((sub) => {
    nodeMap[sub.name] = {
      name: sub.name,
      color: sub.color || "#9c6ef3",
    };
  });

  return nodeMap;
});

const hasGraphData = computed(() => {
  return groovyTechno.value != null && Object.keys(nodes.value).length > 0;
});

/**
 * 🎯 COMPUTED: Dynamic Edges
 *
 * Creates connections from Groovy Techno to its subgenres.
 */
const edges = computed<Edges>(() => {
  const edgeMap: Edges = {};
  const makeKey = (source: string, target: string) =>
    `edge-${source.replace(/\s+/g, "_")}-${target.replace(/\s+/g, "_")}`;

  if (!groovyTechno.value) {
    return edgeMap;
  }

  // Connect Groovy Techno to its subgenres
  const subgenres = genreStore.getSubgenresByParentId(groovyTechno.value.id);
  subgenres.forEach((sub) => {
    edgeMap[makeKey(groovyTechno.value!.name, sub.name)] = {
      source: groovyTechno.value!.name,
      target: sub.name,
    };
  });

  return edgeMap;
});

/**
 * 🎯 COMPUTED: Dynamic Layouts
 *
 * Positions Groovy Techno at center and subgenres in a circular pattern around it.
 * Uses trigonometry for circular arrangement!
 */
const layouts = computed<Layouts>(() => {
  const layoutMap: Layouts = {
    nodes: {},
  };

  if (!groovyTechno.value) {
    return layoutMap;
  }

  // Position Groovy Techno at center
  layoutMap.nodes[groovyTechno.value.name] = { x: 0, y: 0 };

  // Position subgenres in a circle around Groovy Techno
  const subgenres = genreStore.getSubgenresByParentId(groovyTechno.value.id);

  if (subgenres.length) {
    const angleStep = (2 * Math.PI) / subgenres.length;
    const radius = 120; // Distance from center

    subgenres.forEach((sub, index) => {
      const angle = index * angleStep - Math.PI / 2; // Start at top
      layoutMap.nodes[sub.name] = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });
  }

  return layoutMap;
});

/**
 * 🎯 EVENT HANDLERS
 *
 * Handle node clicks to select genres and show details
 * Allow clicking Groovy Techno (the center node) to show its details
 */
const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
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

@media (pointer: coarse) {
  /* On touch devices, prevent panning/zooming gestures but allow taps/clicks */
  .graph {
    touch-action: manipulation;
  }
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
