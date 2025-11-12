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
 * 🎯 LEARNING: Vite Environment Variables
 *
 * This project now uses Vite!
 * - Vite exposes variables with the VITE_ prefix
 * - Access them via import.meta.env at BUILD TIME (not runtime)
 *
 * Learn more: https://vitejs.dev/guide/env-and-mode.html
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Vite requires VITE_ prefix for env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// Type-safe client with auto-generated types
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

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
