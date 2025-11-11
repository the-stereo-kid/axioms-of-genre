declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/**
 * 🎯 LEARNING: TypeScript Environment Variables
 *
 * This tells TypeScript about Vite's import.meta.env
 * Vite exposes env vars at BUILD TIME through import.meta.env
 *
 * Why is this needed?
 * - TypeScript doesn't know about Vite-specific features by default
 * - We need to "declare" these types so TypeScript understands them
 *
 * Learn more: https://vitejs.dev/guide/env-and-mode.html
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
