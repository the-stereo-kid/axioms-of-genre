import { describe, expect, it, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, h, reactive } from "vue";
import AppHeader from "@/components/AppHeader.vue";

const signOut = vi.fn(async () => {});
const setRedirect = vi.fn();

const authStore = reactive({
  isAuthenticated: false,
  signOut,
  setRedirect,
});

const currentRoute = reactive({
  fullPath: "/",
  query: {} as Record<string, unknown>,
});

vi.mock("@/stores/authStore", () => ({
  useAuthStore: () => authStore,
}));

vi.mock("vue-router", () => ({
  useRoute: () => currentRoute,
}));

const RouterLinkStub = defineComponent({
  props: {
    to: { type: [String, Object], required: true },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "a",
        { href: typeof props.to === "string" ? props.to : JSON.stringify(props.to) },
        slots.default?.()
      );
  },
});

describe("AppHeader", () => {
  beforeEach(() => {
    authStore.isAuthenticated = false;
    signOut.mockClear();
    setRedirect.mockClear();
    currentRoute.fullPath = "/";
  });

  it("does not show login link when signed out (easter egg route)", () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    const loginLinks = wrapper.findAll("a").filter((link) => link.text().trim() === "Login");

    expect(loginLinks.length).toBe(0);
    expect(wrapper.text()).not.toContain("Sign out");
    expect(wrapper.text()).toContain("Blog");
    expect(wrapper.text()).toContain("About");
  });

  it("renders dashboard and sign-out controls when signed in", async () => {
    authStore.isAuthenticated = true;
    const wrapper = mount(AppHeader, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain("Dashboard");

    const signOutButtons = wrapper.findAll("button").filter((btn) => btn.text() === "Sign out");
    expect(signOutButtons.length).toBeGreaterThan(0);

    await signOutButtons[0].trigger("click");

    expect(signOut).toHaveBeenCalled();
    expect(setRedirect).toHaveBeenCalledWith("/");
  });

  it("closes the mobile menu when the route changes", async () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    const toggle = wrapper.find("button[aria-label='Toggle navigation']");

    await toggle.trigger("click");
    expect(wrapper.find("nav").classes()).toContain("opacity-100");

    currentRoute.fullPath = "/visualizer";
    await flushPromises();

    const navClasses = wrapper.find("nav").classes().join(" ");
    expect(navClasses).toContain("pointer-events-none");
  });
});
