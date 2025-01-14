<template>
  <div class="graph-container" ref="graph-container">
    <v-network-graph
      class="graph"
      :nodes="nodes"
      :edges="edges"
      :layouts="layouts"
      :event-handlers="eventHandlers"
    />
  </div>
</template>

<script lang="ts">
import { VNetworkGraph, Nodes, Edges, Layouts } from "v-network-graph";
import * as vNG from "v-network-graph";
import { defineComponent } from "vue";

// TODO: create API endpoint to store Nodes and Edges
// explore Graph QL for implementation and dynamic queries
const nodes: Nodes = {
  // start with empty node as central point
  node0: { name: "" },

  Techno: { name: "Techno" },
  Trance: { name: "Trance" },
  House: { name: "House" },
  DnB: { name: "DnB" },
  Dub: { name: "Dub" },
};

const edges: Edges = {
  edge1: { source: "node0", target: "Techno" },
  edge2: { source: "node0", target: "Trance" },
  edge3: { source: "node0", target: "House" },
  edge4: { source: "node0", target: "DnB" },
  edge5: { source: "node0", target: "Dub" },
};

const layouts: Layouts = {
  nodes: {
    node0: { x: 0, y: 0 }, //centre
    Techno: { x: -57 * 2, y: 19 * 2 }, // top left
    Trance: { x: 57 * 2, y: 19 * 2 }, // top right
    House: { x: 0 * 2, y: 60 * 2 }, // bottom centre
    DnB: { x: -35 * 2, y: 49 * 2 }, // botom left
    Dub: { x: 35 * 2, y: 49 * 2 }, // bottom right
  },
};

// TODO: configs will be used to specify the dynamic updates for the graph
// const configs = reactive()

// const eventHandlers: vNG.EventHandlers = {
//   // wildcard: capture all events

//   "node:click": function ({ node, event }) {
//     console.log(event);
//     console.log(node);
//     interface EventHandlers {
//         // existing event handlers...

//         emitNode(node: string): void;
//     }
//   },
//   //  TODO: create a tooltip to see the summary data
//   //   "node:pointerover": (type, event) => {
//   //     console.log("type: " + type);
//   //     console.log("event: " + event);
//   //   },
// };

// TODO: emit event to update detail component with genre information and display sub-genre nodes & connections
// const selectGenre = (genre: string | undefined) => {
//     emitGenre(genre)
// }

// const { emit } = getCurrentInstance()!;

// const selectGenre = (genreId: string) => {
//       // Handle the logic for selecting a genre
//       console.log('Selected genre:', genreId);
//       // Example: Emit an event to parent component
//       // Replace 'your-event-name' with an appropriate event name
//       emit('your-event-name', genreId);
//     };

export default defineComponent({
  name: "GenresGraph",
  props: [],
  methods: {
    emitNode(node: string) {
      this.$emit("node-selected", node);
    },
  },
  computed: {
    eventHandlers(): vNG.EventHandlers {
      return {
        "node:click": ({ node, event }) => {
          this.emitNode(node);
        },
      };
    },
  },
  data() {
    return {
      nodes,
      edges,
      layouts,
      // eventHandlers: this.eventHandlers(),
    };
  },
  components: {
    VNetworkGraph,
  },
});
</script>

<style>
/* Use some global styles outside of inline styles for container and backgrounds */
template {
  height: 100%;
}

.graph-container {
  margin: auto;
  width: 600px;
  height: 400px;
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
}

.graph-container path {
  stroke: #ee7129dd !important;
  stroke-width: 2 !important;
  opacity: 0.1;
}
</style>
