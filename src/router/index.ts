import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import visualizerView from "../views/VisualizerView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/visualizer",
    name: "visualizer",
    component: visualizerView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
