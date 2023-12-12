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

// style app with dark theme
body {
    background: #222222;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #dddddddd;
  line-height: 1.5;
  font-weight: 1.5;

  // use montserrat for headings and titles
  h1 {
    margin-top: 0.4;
    font-family: 'Montserrat';
    font-size: 56px;
  }

  h2 {
    font-family: 'Montserrat';
  }

h3 {
  font-family: 'Montserrat';
}
}

nav {
  font-family: 'Montserrat';
  a {
    color: #dddddddd;

    &.router-link-exact-active {
      color: #ee7129dd;
    }
  }
}
</style>
