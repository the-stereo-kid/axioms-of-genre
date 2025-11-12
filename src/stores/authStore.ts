import { defineStore } from "pinia";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthStatus = "idle" | "initializing" | "ready";

type AuthProfile = {
  id: string;
  email: string;
};

let stopAuthListener: (() => void) | null = null;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    session: null as Session | null,
    profile: null as AuthProfile | null,
    status: "idle" as AuthStatus,
    authError: null as string | null,
    isProcessing: false,
    redirectTo: "/" as string,
  }),
  getters: {
    isAuthenticated: (state) => !!state.session,
    isReady: (state) => state.status === "ready",
  },
  actions: {
    /**
     * Initialize auth state once when the app boots.
     * We call this from App.vue on mount so navigation guards
     * can rely on a populated session state.
     */
    async initialize(): Promise<void> {
      if (this.status !== "idle") return;

      this.status = "initializing";
      if (stopAuthListener) {
        stopAuthListener();
      }

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("auth: failed to load session", error);
        this.authError = error.message;
      } else {
        this.session = data.session;
        this.profile = data.session?.user ? this.mapUserToProfile(data.session.user) : null;
      }

      this.status = "ready";
      this.attachAuthListener();
    },
    /**
     * Keep the Pinia store in sync with Supabase auth changes (login, logout, token refresh).
     * The listener is registered once and cleaned up when the store is disposed.
     */
    attachAuthListener() {
      if (stopAuthListener) return;

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        this.session = session;
        this.profile = session?.user ? this.mapUserToProfile(session.user) : null;
      });

      stopAuthListener = () => {
        data.subscription.unsubscribe();
        stopAuthListener = null;
      };
    },
    setRedirect(path: string) {
      this.redirectTo = path || "/";
    },
    async signIn(credentials: { email: string; password: string }): Promise<string | null> {
      this.isProcessing = true;
      this.authError = null;

      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      this.isProcessing = false;

      if (error) {
        console.error("auth: sign-in failed", error);
        this.authError = error.message;
        return error.message;
      }

      this.session = data.session;
      this.profile = data.session?.user ? this.mapUserToProfile(data.session.user) : null;
      return null;
    },
    async signUp(credentials: { email: string; password: string }): Promise<string | null> {
      this.isProcessing = true;
      this.authError = null;

      const { data, error } = await supabase.auth.signUp(credentials);

      this.isProcessing = false;

      if (error) {
        console.error("auth: sign-up failed", error);
        this.authError = error.message;
        return error.message;
      }

      if (data.session) {
        this.session = data.session;
        this.profile = data.session.user ? this.mapUserToProfile(data.session.user) : null;
      } else if (data.user) {
        // Email confirmations disabled in Supabase defaults, but we cover the case anyway.
        this.profile = this.mapUserToProfile(data.user);
      }

      return null;
    },
    async signOut(): Promise<string | null> {
      this.isProcessing = true;
      this.authError = null;

      const { error } = await supabase.auth.signOut();

      this.isProcessing = false;

      if (error) {
        console.error("auth: sign-out failed", error);
        this.authError = error.message;
        return error.message;
      }

      if (stopAuthListener) {
        stopAuthListener();
      }

      this.session = null;
      this.profile = null;
      return null;
    },
    mapUserToProfile(user: User): AuthProfile {
      return {
        id: user.id,
        email: user.email ?? "",
      };
    },
  },
});
