<template>
  <div class="home">
    <Axioms/>
    <img alt="Vue logo" src="../assets/metatrons-cube.jpg" >
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Axioms from '@/components/Axioms.vue'; // @ is an alias to /src

@Options({
  components: {
    Axioms,
  },
})
export default class HomeView extends Vue {}
</script>
