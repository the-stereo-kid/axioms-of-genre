<template>
<div class="graph-container" ref="graph-container" >
    <v-network-graph class="graph"
        :nodes="nodes"
        :edges="edges"
        :layouts="layouts"
        :event-handlers="eventHandlers"
    />
</div>
</template>

<script lang="ts">

import { VNetworkGraph, Nodes, Edges, Layouts } from "v-network-graph"
import * as vNG from "v-network-graph"

// TODO: create API endpoint to store Nodes and Edges
// explore Graph QL for implementation and dynamic queries
const nodes: Nodes = {
    // start with empty node as central point
    node0: { name: ""},

    node1: { name: "Techno" },
    node2: { name: "Trance" },
    node3: { name: "House" },
    node4: { name: "DnB" },
    node5: { name: "Dub" },
}

const edges: Edges = {
    edge1: { source: "node0", target: "node1" },
    edge2: { source: "node0", target: "node2" },
    edge3: { source: "node0", target: "node3" },
    edge4: { source: "node0", target: "node4" },
    edge5: { source: "node0", target: "node5" },
}

// TODO: configs will be used to specify the dynamic updates for the graph
// const configs = reactive()

//  
const eventHandlers: vNG.EventHandlers= {
    // wildcard: capture all events
    
    "node:click": ({ node, event }) => {
        console.log(event);
    },
    //  TODO: create a tooltip to see the summary data
    //   "node:pointerover": (type, event) => {
    //     console.log("type: " + type)
    //     console.log("event: " + event)
    //   }
}

// TODO: emit event to update detail component with genre information and display sub-genre nodes & connections
// const selectGenre = (genre: string | undefined) => {
//     emitGenre(genre)
// }

const layouts: Layouts = {
    nodes: {
        node0: { x: 0, y: 0 }, //centre
        node1: { x: -57*2, y: 19*2 }, // top left
        node2: { x: 57*2, y: 19*2 }, // top right
        node3: { x: 0*2, y: 60*2 }, // bottom centre
        node4: { x: -35*2, y: 49*2 }, // botom left
        node5: { x: 35*2, y: 49*2 }, // bottom right
    },
}

export default{
    name: "GenresGraph",
    props: [],
    methods: {
        logGenre(genre: string | undefined) {
            console.log(genre)
        }
    },
    data () {
        return {
            nodes,
            edges,
            layouts,
            eventHandlers,
        }},
    components: {
        VNetworkGraph,
    }
};
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
  opacity: .1;
}
</style>
    