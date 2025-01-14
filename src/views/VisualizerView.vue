<template>
  <div class="about">
    <GenresGraph @node-selected="handleNodeSelected" />
    <GenresDetail
      class="detail"
      :genre="genre.title"
      :bpmRange="genre.bpmRange"
      :description="genre.description"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import GenresGraph from "@/components/GenresGraph.vue";
import GenresDetail from "@/components/GenresDetail.vue";

const genres = new Map<string, any>();
genres.set("Trance", {
  id: 1,
  title: "Trance",
  bpmRange: [110, 130],
  description: "Trance music is driven by a galloping baseline",
});
genres.set("Techno", {
  id: 2,
  title: "Techno",
  bpmRange: [110, 130],
  description: "Techno music is driven by a dependable kick",
});
genres.set("House", {
  id: 1,
  title: "Deep House",
  bpmRange: [110, 130],
  description: "House music is driven by a syncopated baseline",
});
genres.set("DnB", {
  id: 1,
  title: "Drum and Bass",
  bpmRange: [110, 130],
  description: "Drum and Bass music is driven by a kick-snare drum patten",
});
genres.set("Dub", {
  id: 1,
  title: "Dub & Dubstep",
  bpmRange: [80, 100],
  description: "Dub music is driven by minimal elements and a deep baseline",
});

@Options({
  data() {
    return {
      genre: genres.get("Techno"),
    };
  },
  components: {
    GenresGraph,
    GenresDetail,
  },
  methods: {
    handleNodeSelected(genre: string) {
      console.log("Selected genre:", genre);
      this.genre = genres.get(genre);
    },
  },
  computed: {
    genre(): any {
      return genres.get("Techno");
    },
  },
})
export default class HomeView extends Vue {
  genre: any;
}
</script>

<style>
.detail {
  width: 50%;
  margin: auto;
}
</style>
