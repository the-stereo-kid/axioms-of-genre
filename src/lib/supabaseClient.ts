/**
 * Supabase Client Setup
 *
 * This is your single source of truth for connecting to Supabase.
 * The createClient function gives you access to:
 * - Database queries (.from())
 * - Authentication (.auth)
 * - Storage (.storage)
 * - Realtime subscriptions (.channel())
 *
 * 🎯 LEARNING: Vue CLI vs Vite Environment Variables
 *
 * This project uses Vue CLI (Webpack), NOT Vite!
 * - Vue CLI: use process.env.VUE_APP_*
 * - Vite: use import.meta.env.VITE_*
 *
 * How to tell which you're using?
 * - Check package.json: "vue-cli-service" = Vue CLI
 * - Check for vite.config.js = Vite
 *
 * Both replace env vars at BUILD TIME for security.
 *
 * Learn more: https://cli.vuejs.org/guide/mode-and-env.html
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Vue CLI requires VUE_APP_ prefix for env variables
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL as string;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY as string;

// Type-safe client with auto-generated types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * 🎯 LEARNING CHECKPOINT:
 * Open your browser console and try:
 *
 * import { supabase } from './lib/supabaseClient'
 * const { data } = await supabase.from('genres').select('*')
 * console.log(data)
 *
 * This is the core pattern you'll use everywhere!
 */
