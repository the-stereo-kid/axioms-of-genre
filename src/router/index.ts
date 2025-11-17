import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import VisualizerView from "../views/VisualizerView.vue";
import AuthView from "../views/AuthView.vue";
import BlogListView from "../views/BlogList.vue";
import AuthorDashboardView from "../views/AuthorDashboard.vue";
import BookingView from "../views/BookingView.vue";
import { useAuthStore } from "@/stores/authStore";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/visualizer",
    name: "visualizer",
    component: VisualizerView,
  },
  {
    path: "/blog",
    name: "blog",
    component: BlogListView,
  },
  {
    path: "/booking",
    name: "booking",
    component: BookingView,
  },
  {
    path: "/backdoor",
    name: "backdoor",
    component: AuthView,
    meta: { requiresGuest: true },
  },
  {
    path: "/author",
    name: "author-dashboard",
    component: AuthorDashboardView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.status === "idle") {
    await authStore.initialize();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    authStore.setRedirect(to.fullPath);
    return {
      name: "backdoor",
      query: { redirectTo: to.fullPath },
    };
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    const destination = authStore.redirectTo || "/";
    return destination;
  }

  return true;
});

export default router;
