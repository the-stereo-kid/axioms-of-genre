import { describe, expect, it, beforeEach, vi } from "vitest"
import { createPinia, setActivePinia } from "pinia"
import type { Session } from "@supabase/supabase-js"
import { useAuthStore } from "@/stores/authStore"

const subscriptionMock = vi.hoisted(() => ({
  unsubscribe: vi.fn()
}))

const supabaseAuthMock = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn()
}))

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: supabaseAuthMock
  }
}))

const createSession = (email = "author@example.com"): Session =>
  ({
    user: {
      id: "user-123",
      email
    }
  } as unknown as Session)

describe("authStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    subscriptionMock.unsubscribe.mockReset()
    supabaseAuthMock.getSession.mockReset()
    supabaseAuthMock.onAuthStateChange.mockReset()
    supabaseAuthMock.signInWithPassword.mockReset()
    supabaseAuthMock.signUp.mockReset()
    supabaseAuthMock.signOut.mockReset()

    supabaseAuthMock.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })

    supabaseAuthMock.onAuthStateChange.mockImplementation(handler => {
      return { data: { subscription: subscriptionMock } }
    })

    supabaseAuthMock.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: null
    })

    supabaseAuthMock.signUp.mockResolvedValue({
      data: { session: null, user: null },
      error: null
    })

    supabaseAuthMock.signOut.mockResolvedValue({ error: null })
  })

  it("initializes with an existing session", async () => {
    const session = createSession()
    supabaseAuthMock.getSession.mockResolvedValueOnce({
      data: { session },
      error: null
    })

    const store = useAuthStore()
    await store.initialize()

    expect(store.session).toEqual(session)
    expect(store.profile?.email).toBe("author@example.com")
  })

  it("stores errors when initialization fails", async () => {
    supabaseAuthMock.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: { message: "Auth offline" }
    })

    const store = useAuthStore()
    await store.initialize()

    expect(store.authError).toBe("Auth offline")
  })

  it("signs in with credentials and updates session", async () => {
    const session = createSession("writer@axioms.io")
    supabaseAuthMock.signInWithPassword.mockResolvedValueOnce({
      data: { session },
      error: null
    })

    const store = useAuthStore()
    await store.initialize()

    const error = await store.signIn({
      email: "writer@axioms.io",
      password: "secret"
    })

    expect(error).toBeNull()
    expect(store.isAuthenticated).toBe(true)
    expect(store.profile?.email).toBe("writer@axioms.io")
  })

  it("surfaces sign-in errors", async () => {
    supabaseAuthMock.signInWithPassword.mockResolvedValueOnce({
      data: { session: null },
      error: { message: "Invalid credentials" }
    })

    const store = useAuthStore()
    await store.initialize()
    const error = await store.signIn({
      email: "wrong@example.com",
      password: "bad"
    })

    expect(error).toBe("Invalid credentials")
    expect(store.isAuthenticated).toBe(false)
  })

  it("signs out and clears session data", async () => {
    const session = createSession()
    supabaseAuthMock.signInWithPassword.mockResolvedValueOnce({
      data: { session },
      error: null
    })

    const store = useAuthStore()
    await store.initialize()
    await store.signIn({ email: "author@example.com", password: "secret" })

    await store.signOut()

    expect(store.session).toBeNull()
    expect(store.profile).toBeNull()
  })

  it("reacts to Supabase auth state changes", async () => {
    const store = useAuthStore()
    await store.initialize()

    const handler = supabaseAuthMock.onAuthStateChange.mock.calls.at(-1)?.[0] as
      | ((event: string | null, session: Session | null) => void)
      | undefined

    expect(handler).toBeTypeOf("function")

    const session = createSession("listener@axioms.io")
    handler?.("SIGNED_IN", session)

    expect(store.profile?.email).toBe("listener@axioms.io")
  })
})

