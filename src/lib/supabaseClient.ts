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
 * Why use import.meta.env? 
 * - Vite (Vue CLI uses Vite) exposes env vars with VITE_ prefix
 * - These are replaced at BUILD TIME (not runtime) for security
 * 
 * Learn more: https://supabase.com/docs/reference/javascript/initializing
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Vite requires VITE_ prefix for env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Type-safe client with auto-generated types (we'll create these next)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

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

