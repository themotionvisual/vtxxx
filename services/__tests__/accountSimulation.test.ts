import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  applySimulationToRealState,
  buildSimulationLocalStateSnapshot,
  createDefaultAccountSimulationState,
  deriveFlowChecklist,
  importRealStateIntoSimulation,
  resetRealAccountSimulationState,
  synchronizeAccountSimulationState,
} from "../accountSimulation"

const createLocalStorageMock = () => {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
  }
}

describe("account simulation service", () => {
  beforeEach(() => {
    const localStorageMock = createLocalStorageMock()
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      writable: true,
      value: localStorageMock,
    })
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: {
        dispatchEvent: vi.fn(),
        location: { origin: "http://localhost:5173" },
        opener: null,
        history: { replaceState: vi.fn() },
        close: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    })
    vi.restoreAllMocks()
  })

  it("keeps paid plans inactive until checkout succeeds", () => {
    const state = synchronizeAccountSimulationState(
      createDefaultAccountSimulationState({
        selectedPlanId: "creator_plus",
        checkoutStatus: "session_created",
        billingEvent: "none",
      }),
    )

    expect(state.entitlementSnapshot.subscriptionPlanId).toBe("basic")
    expect(state.onboardingState.billingConfirmed).toBe(false)
  })

  it("activates beta locally without checkout", () => {
    const state = synchronizeAccountSimulationState(
      createDefaultAccountSimulationState({
        selectedPlanId: "beta",
      }),
    )

    expect(state.entitlementSnapshot.subscriptionPlanId).toBe("beta")
    expect(state.onboardingState.billingConfirmed).toBe(true)
  })

  it("derives synced auth state and auth token for authenticated synced users", () => {
    const state = synchronizeAccountSimulationState(
      createDefaultAccountSimulationState({
        oauthStatus: "authenticated_synced",
        syncTimestamp: "2026-05-25T12:00:00.000Z",
      }),
    )

    const snapshot = buildSimulationLocalStateSnapshot(state)
    expect(snapshot.authState.isAuthenticated).toBe(true)
    expect(snapshot.authState.fastAnalytics?.lastSyncedAt).toBe("2026-05-25T12:00:00.000Z")
    expect(snapshot.authToken).toBeTruthy()
  })

  it("applies the simulated state into the real local keys", () => {
    const state = synchronizeAccountSimulationState(
      createDefaultAccountSimulationState({
        signupEmail: "qa-user@viewtube.local",
        selectedPlanId: "creator_plus",
        checkoutStatus: "completed",
        billingEvent: "invoice.paid",
        oauthStatus: "authenticated_synced",
        syncTimestamp: "2026-05-25T12:00:00.000Z",
        aiBrainContext: {
          whatNext: "Improve retention",
          primaryGoal: "retention",
          audienceNiche: "Education",
          completedAt: "2026-05-25T12:01:00.000Z",
        },
      }),
    )

    const snapshot = applySimulationToRealState(state)
    expect(localStorage.getItem("vt_signup_email")).toBe("qa-user@viewtube.local")
    expect(localStorage.getItem("vt_known_user_email")).toBe("qa-user@viewtube.local")
    expect(localStorage.getItem("vt_auth_state")).toContain('"isAuthenticated":true')
    expect(localStorage.getItem("yt_access_token")).toContain("sim_qa_user_viewtube_local_oauth_token")
    expect(snapshot.entitlementState.subscriptionPlanId).toBe("creator_plus")
  })

  it("imports current real state back into the simulator", () => {
    localStorage.setItem("vt_signup_email", "imported@viewtube.local")
    localStorage.setItem(
      "vt_auth_state",
      JSON.stringify({
        isAuthenticated: true,
        channelName: "Imported Channel",
        channelHandle: "@imported",
        channelThumbnail: "https://example.com/imported.png",
        subscriberCount: 99,
        totalViews: 1200,
        videoCount: 12,
        syncedAt: "2026-05-25T12:00:00.000Z",
      }),
    )
    localStorage.setItem(
      "vt_entitlement_v1",
      JSON.stringify({
        subscriptionPlanId: "creator_plus",
        tier: "medium",
        status: "active",
        creditBalance: 2000,
      }),
    )

    const imported = importRealStateIntoSimulation()
    const checklist = deriveFlowChecklist(imported)

    expect(imported.signupEmail).toBe("imported@viewtube.local")
    expect(imported.oauthStatus).toBe("authenticated_synced")
    expect(imported.selectedPlanId).toBe("creator_plus")
    expect(checklist.firstSyncCompleted).toBe(true)
  })

  it("resets the real account simulation keys only when explicitly requested", () => {
    localStorage.setItem("vt_signup_email", "cleanup@viewtube.local")
    localStorage.setItem("vt_auth_state", JSON.stringify({ isAuthenticated: true }))
    localStorage.setItem("yt_access_token", "token")

    resetRealAccountSimulationState()

    expect(localStorage.getItem("vt_signup_email")).toBeNull()
    expect(localStorage.getItem("vt_auth_state")).toBeNull()
    expect(localStorage.getItem("yt_access_token")).toBeNull()
  })
})
