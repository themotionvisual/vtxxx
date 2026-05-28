import type { AuthState, ChannelAnalysisSyncStatus } from "../types"

export type ConnectionUiState =
 | "disconnected"
 | "connected"
 | "syncing"

export const resolveConnectionUiState = (input: {
 authState: AuthState
 isSyncing?: boolean
 syncStatus?: ChannelAnalysisSyncStatus | null
}): ConnectionUiState => {
 const { authState, isSyncing = false, syncStatus = null } = input
 const hasSession = Boolean(authState.isAuthenticated)
 const syncPhase = syncStatus?.phase || "idle"
 const isRuntimeSyncing = syncPhase === "syncing" || syncPhase === "partial"

 if (!hasSession) return "disconnected"
 if (isSyncing || isRuntimeSyncing) return "syncing"
 return "connected"
}

export const getConnectionUiCopy = (
 state: ConnectionUiState,
): {
 title: string
 subtitle: string
 cta: "Connect Channel" | "Sync Now" | "Syncing..."
} => {
 if (state === "disconnected") {
  return {
   title: "Not connected",
   subtitle: "Not connected",
   cta: "Connect Channel",
  }
 }
 if (state === "syncing") {
  return {
   title: "Syncing channel",
   subtitle: "Sync in progress",
   cta: "Syncing...",
  }
 }
 return {
  title: "Connected",
  subtitle: "Channel connected",
  cta: "Sync Now",
 }
}
