import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VNetworkGraph from 'v-network-graph'; // Ensure you use the correct import path


const app = createApp(App).use(router);
app.component('v-network-graph', VNetworkGraph);
app.mount('#app');