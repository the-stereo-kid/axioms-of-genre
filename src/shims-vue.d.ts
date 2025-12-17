declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/// <reference types="vite/client" />

/**
 * 🎯 LEARNING: TypeScript Environment Variables (Vite)
 *
 * Vite injects build-time env vars on import.meta.env
 * Prefixed values (VITE_*) are exposed to the client.
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

declare module "vue3-carousel";
