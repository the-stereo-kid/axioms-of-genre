import { describe, expect, it, beforeEach, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { reactive } from "vue"
import AuthForm from "@/components/AuthForm.vue"

const push = vi.fn(async () => {})
const route = reactive({
  query: {} as Record<string, unknown>
})

const authStore = {
  isProcessing: false,
  authError: null as string | null,
  redirectTo: "/author",
  signIn: vi.fn(),
  signOut: vi.fn(),
  setRedirect: vi.fn()
}

vi.mock("@/stores/authStore", () => ({
  useAuthStore: () => authStore
}))

vi.mock("vue-router", () => ({
  useRoute: () => route,
  useRouter: () => ({ push })
}))

describe("AuthForm", () => {
  beforeEach(() => {
    push.mockClear()
    authStore.signIn.mockReset()
    authStore.authError = null
    authStore.isProcessing = false
    authStore.redirectTo = "/author"
    route.query = {}
  })

  it("submits sign-in credentials and redirects", async () => {
    authStore.signIn.mockResolvedValueOnce(null)

    const wrapper = mount(AuthForm)

    await wrapper.find("#author-email").setValue("author@example.com")
    await wrapper.find("#author-password").setValue("supabase!")
    await wrapper.find("form").trigger("submit.prevent")

    expect(authStore.signIn).toHaveBeenCalledWith({
      email: "author@example.com",
      password: "supabase!"
    })
    expect(push).toHaveBeenCalledWith("/author")
  })

  it("shows red background when login fails", async () => {
    authStore.signIn.mockResolvedValueOnce("Invalid login credentials")

    const wrapper = mount(AuthForm)

    await wrapper.find("#author-email").setValue("author@example.com")
    await wrapper.find("#author-password").setValue("wrongpassword")
    await wrapper.find("form").trigger("submit.prevent")

    await wrapper.vm.$nextTick()

    expect(authStore.signIn).toHaveBeenCalled()
    expect(wrapper.text()).toContain("Invalid login credentials")
    expect(wrapper.find("section").classes()).toContain("bg-red-900/30")
    expect(push).not.toHaveBeenCalled()
  })
})

