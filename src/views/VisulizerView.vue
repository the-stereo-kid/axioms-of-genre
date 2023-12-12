<template>
  <div class="about">
    <GenresGraph/>
    <GenresDetail class="detail"
    :genre=Techno.title
    :bpmRange=Techno.bpmRange
    :description=Techno.description
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GenresGraph from '@/components/GenresGraph.vue';
import GenresDetail from '@/components/GenresDetail.vue';

// { "id": 6, "name": "HipHop", "bpm": [80, 100], "info": "HipHop info here" }
const Techno = {
        "title": "Techno",
        "bpmRange": "BPM: 110-130",
        "description": "Techno music is driven by a dependable kick, often refered to as the 4 on the floor, since every beat of each bar is marked by the kick drum. This is accompanied by a drivey bassline which makes this fall within the Deep House category. Minimal techno might only contain a few elements and play with the space in between, but in general techno contains a wide variety of pecussion, syths, guitar/string insturments, pew pew noises and combines them with cool synnergy."
    }

@Options({
  data() {
    return {
      Techno
    }
  },
  components: {
    GenresGraph,
    GenresDetail
  },
})
export default class HomeView extends Vue {
Techno: any;
}
</script>

<style>
  .detail {
    width: 50%;
    margin: auto;
  }
</style>