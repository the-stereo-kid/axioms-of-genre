import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VNetworkGraph from "v-network-graph";

/**
 * 🎯 PINIA SETUP
 *
 * Pinia is Vue's official state management library (replaces Vuex).
 * Why Pinia?
 * - Better TypeScript support (auto-completion everywhere!)
 * - Simpler API (no mutations, just actions)
 * - Modular by design (each store is independent)
 * - DevTools support (time-travel debugging)
 *
 * Learn more: https://pinia.vuejs.org/
 */
const pinia = createPinia();

const app = createApp(App);
app.use(pinia); // Register Pinia BEFORE router
app.use(router);
app.component("v-network-graph", VNetworkGraph);
app.mount("#app");
