declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/**
 * 🎯 LEARNING: TypeScript Environment Variables (Vue CLI)
 *
 * This tells TypeScript about Vue CLI's process.env variables
 * Vue CLI (Webpack) exposes env vars at BUILD TIME through process.env
 *
 * Why is this needed?
 * - TypeScript doesn't know about webpack-injected env vars by default
 * - We need to "declare" these types so TypeScript understands them
 *
 * Key differences:
 * - Vue CLI: VUE_APP_* prefix → process.env.VUE_APP_*
 * - Vite: VITE_* prefix → import.meta.env.VITE_*
 *
 * Learn more: https://cli.vuejs.org/guide/mode-and-env.html
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly VUE_APP_SUPABASE_URL: string;
    readonly VUE_APP_SUPABASE_ANON_KEY: string;
  }
}
