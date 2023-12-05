import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import VisulizerView from '../views/VisulizerView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/visulizer',
    name: 'visulizer',
    component: VisulizerView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
