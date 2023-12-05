<template>
  <nav class="p-10 font-bold">
    <router-link to="/">AXIOMS</router-link> |
    <router-link to="/visulizer">VISULIZER</router-link>
  </nav>
  <router-view/>
</template>

<style lang="scss">

/* src/style.css */
// @tailwind base;
@tailwind components;
@tailwind utilities;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #375470;
}

nav {

  a {
    color: #375470;

    &.router-link-exact-active {
      color: #0aa15d;
    }
  }
}
</style>
