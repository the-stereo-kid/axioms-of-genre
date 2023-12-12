<template>
  <div>
    <h1 class="title mt-1">Axioms of Genre</h1>
    <h3>A visulizer (for my opinionated view) of electronic music genres</h3>

    <div class="w-50% flex flex-col items-center">
      <p>
        This map of music will only explore electornic music,
        ie tempo driven music with a consistent beat grid
        <br>
        <br>
        <span class="font-bold">Nota Bene</span>
      </p>
      <ul class="flex flex-col justify-centre text-start">
        <li>this will be based on my understanding and appreciation of the music</li>
        <li>it will contain broad sweeping statements in order to categorize (generalize)</li>
        <li>exceptions and observations will be mentioned on a case by case basis</li>
        <li>such as elements that are pointers to categories</li>
      </ul>
    </div>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
  },
})
export default class Axioms extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.title {
  color: #d4550bf8;
}
ul {
  margin: 2.5;

  li {
    line-height: 1.8;
    font-weight: bold;
  }
}
</style>
