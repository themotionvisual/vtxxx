/**
 * Unified Channel Sync — Complete Video Inventory + Analytics + Metadata
 *
 * Fetches the FULL list of a channel's published videos from the uploads playlist,
 * determines format (shorts vs long-form), collects comprehensive analytics metrics
 * via batched Analytics API v2 queries, and enriches with Data API v3 metadata.
 *
 * It explicitly fetches certain interaction metrics (like impressions, cards, end screens)
 * ONLY for long-form videos to avoid API errors and quota waste, since Shorts do not
 * support these features reliably.
 */

import {
  refreshTokenIfExpired,
  proxyFetch,
  ANALYTICS_URL,
  BASE_URL,
} from "./youtubeApiClient"
import { parseDurationSeconds } from "../dataUtils"

// ============================================================================
// 1. TYPES
// ============================================================================

export type UnifiedSyncDepth =
  | "standard"
  | "full"

export interface UnifiedSyncOptions {
  maxVideos?: number
  depth?: UnifiedSyncDepth
  analyticsStartDate?: string
  analyticsEndDate?: string
  onProgress?: (phase: string, message: string, progress: number) => void
}

export interface UnifiedVideoRecord {
  // ── Identity ──
  videoId: string
  title: string
  publishedDate: string
  thumbnail: string

  // ── Format Detection ──
  format: "shorts" | "long" | "unknown"
  creatorContentType?: string
  durationSeconds: number
  durationFormatted: string
  durationRaw: string

  // ── Data API Metadata ──
  description?: string
  tags?: string[]
  categoryId?: string
  categoryName?: string
  defaultLanguage?: string
  privacyStatus?: string
  definition?: string
  caption?: string
  licensedContent?: boolean
  madeForKids?: boolean
  aspectRatioBucket?: "portrait" | "square" | "landscape" | "unknown"

  // ── View & Reach Metrics (All Videos) ──
  views: number
  engagedViews: number
  uniqueViewers: number | null
  averageViewsPerViewer: number | null
  
  // ── Long-Form ONLY Reach ──
  impressions: number
  impressionsCtr: number

  // ── Watch Time & Retention ──
  watchTimeHours: number
  averageViewDuration: number
  averagePercentageViewed: number

  // ── Engagement ──
  subscribersGained: number
  subscribersLost: number
  likes: number
  dislikes: number
  likesVsDislikesPercent: number
  shares: number
  commentsAdded: number

  // ── Revenue & Monetization ──
  estimatedRevenue: number
  youtubeAdRevenue: number
  youtubePremiumRevenue: number
  grossRevenue: number
  transactionRevenue: number | null
  transactions: number | null
  revenuePerTransaction: number | null
  playbackBasedCpm: number
  cpm: number
  estimatedMonetizedPlaybacks: number
  rpm: number
  adImpressions: number

  // ── Premium ──
  youtubePremiumViews: number
  youtubePremiumWatchHours: number

  // ── Long-Form ONLY: Playlists ──
  playlistStarts: number
  playlistViews: number
  viewsPerPlaylistStart: number
  averageTimeInPlaylist: number
  playlistEstimatedMinutesWatched: number

  // ── Long-Form ONLY: Cards & Annotations ──
  annotationCtr: number
  annotationCloseRate: number
  cardImpressions: number
  cardTeaserImpressions: number
  cardClicks: number
  cardTeaserClicks: number
  cardClickRate: number
  cardTeaserClickRate: number

  // ── Long-Form ONLY: End Screens ──
  endScreenElementImpressions: number
  endScreenElementClicks: number
  endScreenElementClickRate: number
}

export interface UnifiedSyncResult {
  channelId: string
  syncedAt: string
  totalVideos: number
  shortsCount: number
  longFormCount: number
  unknownFormatCount: number
  videos: UnifiedVideoRecord[]
  quotaEstimate: {
    playlistItemsCalls: number
    videosListCalls: number
    analyticsReportCalls: number
    totalEstimated: number
  }
}

// ============================================================================
// 2. CONSTANTS
// ============================================================================

const DATA_API_BATCH = 50
const ANALYTICS_BATCH = 25

const ANALYTICS_METRIC_GROUPS_ALL = {
  core: [
    "views",
    "engagedViews",
    "estimatedMinutesWatched",
    "averageViewDuration",
    "averageViewPercentage",
    "subscribersGained",
    "subscribersLost",
    "likes",
    "dislikes",
    "comments",
    "shares",
  ],
  monetization: [
    "estimatedRevenue",
    "estimatedAdRevenue",
    "estimatedRedPartnerRevenue",
    "grossRevenue",
    "cpm",
    "playbackBasedCpm",
    "monetizedPlaybacks",
    "adImpressions",
  ],
  premium: [
    "redViews",
    "estimatedRedMinutesWatched",
  ],
} as const

const ANALYTICS_METRIC_GROUPS_LONG_ONLY = {
  reach: [
    "videoThumbnailImpressions",
    "videoThumbnailImpressionsClickRate",
  ],
  playlists: [
    "playlistStarts",
    "playlistViews",
    "viewsPerPlaylistStart",
    "averageTimeInPlaylist",
    "playlistEstimatedMinutesWatched",
  ],
  cards: [
    "annotationClickThroughRate",
    "annotationCloseRate",
    "cardImpressions",
    "cardTeaserImpressions",
    "cardClicks",
    "cardTeaserClicks",
    "cardClickRate",
    "cardTeaserClickRate",
  ],
  end_screens: [
    "endScreenElementImpressions",
    "endScreenElementClicks",
    "endScreenElementClickRate",
  ],
} as const

// ============================================================================
// 3. UTILITIES
// ============================================================================

const getIsoDate = (date: Date): string => date.toISOString().split("T")[0]

const getYesterdayIso = (): string => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return getIsoDate(d)
}

const chunkArray = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

const detectAspectRatio = (
  embedHtml: string,
): { bucket: "portrait" | "square" | "landscape" | "unknown"; width?: number; height?: number } => {
  const widthMatch = embedHtml.match(/width="(\d+)"/)
  const heightMatch = embedHtml.match(/height="(\d+)"/)
  const width = parseInt(widthMatch?.[1] || "0", 10)
  const height = parseInt(heightMatch?.[1] || "0", 10)
  if (!width || !height) return { bucket: "unknown" }
  const ratio = width / height
  const bucket =
    Math.abs(ratio - 1) <= 0.03
      ? "square" as const
      : height > width
        ? "portrait" as const
        : "landscape" as const
  return { bucket, width, height }
}

const detectFormat = (
  durationSeconds: number,
  embedHtml: string,
): "shorts" | "long" => {
  const aspect = detectAspectRatio(embedHtml)
  if (aspect.bucket === "portrait" && durationSeconds <= 180) return "shorts"
  if (aspect.bucket === "unknown" && durationSeconds <= 60) return "shorts"
  return "long"
}

const formatDuration = (totalSeconds: number): string => {
  if (!totalSeconds || totalSeconds <= 0) return "0:00"
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

// ============================================================================
// 4. PHASE 1: FETCH FULL VIDEO INVENTORY
// ============================================================================

const fetchAllUploadVideoIds = async (
  token: string,
  uploadsPlaylistId: string,
  maxVideos: number,
  onProgress?: UnifiedSyncOptions["onProgress"],
): Promise<{ videoIds: string[]; playlistItemsCalls: number }> => {
  const videoIds: string[] = []
  let nextPageToken = ""
  let playlistItemsCalls = 0

  do {
    const pageSize = Math.min(50, maxVideos - videoIds.length)
    if (pageSize <= 0) break

    let url =
      `${BASE_URL}/playlistItems?part=contentDetails` +
      `&playlistId=${uploadsPlaylistId}` +
      `&maxResults=${pageSize}`
    if (nextPageToken) url += `&pageToken=${nextPageToken}`

    const res = await proxyFetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    playlistItemsCalls++

    if (!res.ok) {
      if (res.status === 401) throw new Error("YouTube authorization expired. Please reconnect.")
      console.warn(`[UnifiedSync] Playlist page failed (${res.status}). Stopping pagination.`)
      break
    }

    const data = await res.json()
    const items = data.items || []
    items.forEach((item: any) => {
      const id = item?.contentDetails?.videoId
      if (id) videoIds.push(id)
    })

    nextPageToken = data.nextPageToken || ""

    if (onProgress) {
      onProgress(
        "inventory",
        `Collected ${videoIds.length} video IDs...`,
        Math.min(videoIds.length / maxVideos, 0.99),
      )
    }

    if (items.length === 0 || videoIds.length >= maxVideos) break
  } while (nextPageToken)

  return { videoIds: videoIds.slice(0, maxVideos), playlistItemsCalls }
}

// ============================================================================
// 5. PHASE 2: FETCH DATA API METADATA
// ============================================================================

interface VideoMetadata {
  videoId: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
  tags: string[]
  categoryId: string
  defaultLanguage: string
  privacyStatus: string
  definition: string
  caption: string
  licensedContent: boolean
  madeForKids: boolean
  durationSeconds: number
  durationRaw: string
  format: "shorts" | "long"
  aspectRatioBucket: "portrait" | "square" | "landscape" | "unknown"
  embedHtml: string
  viewCount: number
  likeCount: number
  commentCount: number
}

const fetchVideoMetadataBatch = async (
  token: string,
  videoIds: string[],
  depth: UnifiedSyncDepth,
  onProgress?: UnifiedSyncOptions["onProgress"],
): Promise<{ metadata: Map<string, VideoMetadata>; apiCalls: number }> => {
  const parts = [
    "snippet",
    "contentDetails",
    "statistics",
    "status",
    "player",
  ]
  if (depth === "full") {
    parts.push("localizations", "topicDetails")
  }
  const partString = parts.join(",")

  const metadata = new Map<string, VideoMetadata>()
  const batches = chunkArray(videoIds, DATA_API_BATCH)
  let apiCalls = 0

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    const url = `${BASE_URL}/videos?part=${partString}&id=${batch.join(",")}`

    const res = await proxyFetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    apiCalls++

    if (!res.ok) {
      if (res.status === 401) throw new Error("YouTube authorization expired. Please reconnect.")
      console.warn(`[UnifiedSync] Videos.list batch ${i + 1} failed (${res.status}). Skipping batch.`)
      continue
    }

    const data = await res.json()
    ;(data.items || []).forEach((item: any) => {
      const id = item.id
      if (!id) return

      const durationRaw = item.contentDetails?.duration || ""
      const durationSeconds = parseDurationSeconds(durationRaw)
      const embedHtml = item.player?.embedHtml || ""
      const aspect = detectAspectRatio(embedHtml)
      const format = detectFormat(durationSeconds, embedHtml)

      const bestThumb =
        item.snippet?.thumbnails?.maxres?.url ||
        item.snippet?.thumbnails?.standard?.url ||
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        `https://img.youtube.com/vi/${id}/hqdefault.jpg`

      metadata.set(id, {
        videoId: id,
        title: item.snippet?.title || "",
        description: item.snippet?.description || "",
        publishedAt: item.snippet?.publishedAt || "",
        thumbnail: bestThumb,
        tags: Array.isArray(item.snippet?.tags) ? item.snippet.tags : [],
        categoryId: item.snippet?.categoryId || "",
        defaultLanguage: item.snippet?.defaultLanguage || "",
        privacyStatus: item.status?.privacyStatus || "",
        definition: item.contentDetails?.definition || "sd",
        caption: item.contentDetails?.caption || "",
        licensedContent: Boolean(item.contentDetails?.licensedContent),
        madeForKids: Boolean(item.status?.madeForKids),
        durationSeconds,
        durationRaw,
        format,
        aspectRatioBucket: aspect.bucket,
        embedHtml,
        viewCount: parseInt(item.statistics?.viewCount || "0", 10),
        likeCount: parseInt(item.statistics?.likeCount || "0", 10),
        commentCount: parseInt(item.statistics?.commentCount || "0", 10),
      })
    })

    if (onProgress) {
      onProgress(
        "metadata",
        `Fetched metadata for ${metadata.size}/${videoIds.length} videos...`,
        (i + 1) / batches.length,
      )
    }
  }

  return { metadata, apiCalls }
}

// ============================================================================
// 6. PHASE 3: FETCH ANALYTICS METRICS
// ============================================================================

type AnalyticsRow = Record<string, number>

const fetchAnalyticsForGroup = async (
  token: string,
  videoIds: string[],
  groupName: string,
  metrics: readonly string[],
  startDate: string,
  endDate: string,
): Promise<{ rows: Map<string, Partial<AnalyticsRow>>; apiCalls: number; warnings: string[] }> => {
  const rows = new Map<string, Partial<AnalyticsRow>>()
  const warnings: string[] = []
  let apiCalls = 0

  const videoBatches = chunkArray(videoIds, ANALYTICS_BATCH)

  for (const batch of videoBatches) {
    const filterValue = `video==${batch.join(",")}`
    const url =
      `${ANALYTICS_URL}/reports?ids=channel==MINE` +
      `&startDate=${startDate}&endDate=${endDate}` +
      `&metrics=${metrics.join(",")}` +
      `&dimensions=video` +
      `&filters=${encodeURIComponent(filterValue)}`

    try {
      const res = await proxyFetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      apiCalls++

      if (!res.ok) {
        if (res.status === 401) throw new Error("YouTube authorization expired. Please reconnect.")
        if (res.status === 400) {
          warnings.push(
            `[${groupName}] Analytics returned 400 for batch of ${batch.length} videos — ` +
            `metrics may not be compatible with this video type.`,
          )
          continue
        }
        warnings.push(`[${groupName}] Analytics HTTP ${res.status} for batch. Skipping.`)
        continue
      }

      const data = await res.json()
      if (!data.columnHeaders || !data.rows) continue

      const headers = (data.columnHeaders as any[]).map((h: any) => String(h.name || ""))
      const videoIdx = headers.indexOf("video")
      if (videoIdx < 0) continue

      for (const row of data.rows) {
        if (!Array.isArray(row)) continue
        const videoId = String(row[videoIdx] || "")
        if (!videoId) continue

        const existing = rows.get(videoId) || {}
        headers.forEach((header: string, idx: number) => {
          if (header === "video") return
          const value = Number(row[idx])
          if (Number.isFinite(value)) {
            existing[header] = value
          }
        })
        rows.set(videoId, existing)
      }
    } catch (err: any) {
      if (err?.message?.includes("authorization expired")) throw err
      warnings.push(`[${groupName}] Analytics fetch error: ${err?.message || err}`)
    }
  }

  return { rows, apiCalls, warnings }
}

// ============================================================================
// 7. MAIN ORCHESTRATOR
// ============================================================================

export const runUnifiedChannelSync = async (
  options: UnifiedSyncOptions = {},
): Promise<UnifiedSyncResult> => {
  const {
    maxVideos = Infinity,
    depth = "standard",
    analyticsStartDate = "2005-02-14",
    analyticsEndDate = getYesterdayIso(),
    onProgress,
  } = options

  const token = await refreshTokenIfExpired()
  if (!token) throw new Error("Unauthorized — no valid access token. Please reconnect your channel.")

  const quotaEstimate = {
    playlistItemsCalls: 0,
    videosListCalls: 0,
    analyticsReportCalls: 0,
    totalEstimated: 0,
  }

  // ── Step 1: Get channel profile ──────────────
  onProgress?.("profile", "Fetching channel profile...", 0)

  const channelRes = await proxyFetch(
    `${BASE_URL}/channels?part=contentDetails,statistics&mine=true`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!channelRes.ok) throw new Error(`Channel profile fetch failed: ${channelRes.status}`)

  const channelData = await channelRes.json()
  const channel = channelData.items?.[0]
  if (!channel) throw new Error("No channel found for this authenticated user.")

  const channelId = channel.id
  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads
  if (!uploadsPlaylistId) throw new Error("Could not find uploads playlist for this channel.")

  // ── Step 2: Collect all video IDs ────────────
  onProgress?.("inventory", "Scanning uploads playlist...", 0)

  const { videoIds, playlistItemsCalls } = await fetchAllUploadVideoIds(
    token,
    uploadsPlaylistId,
    maxVideos === Infinity ? 100_000 : maxVideos,
    onProgress,
  )
  quotaEstimate.playlistItemsCalls = playlistItemsCalls

  if (videoIds.length === 0) {
    return {
      channelId,
      syncedAt: new Date().toISOString(),
      totalVideos: 0,
      shortsCount: 0,
      longFormCount: 0,
      unknownFormatCount: 0,
      videos: [],
      quotaEstimate: { ...quotaEstimate, totalEstimated: playlistItemsCalls + 1 },
    }
  }

  // ── Step 3: Fetch Data API metadata ────────────────────────────────
  onProgress?.("metadata", `Fetching metadata for ${videoIds.length} videos...`, 0)

  const { metadata, apiCalls: metadataCalls } = await fetchVideoMetadataBatch(
    token,
    videoIds,
    depth,
    onProgress,
  )
  quotaEstimate.videosListCalls = metadataCalls

  // Segregate video IDs by format for Analytics queries
  const longFormVideoIds = videoIds.filter(id => metadata.get(id)?.format === "long")

  // ── Step 4: Fetch Analytics API metrics ────────────────────────────
  onProgress?.("analytics", "Fetching analytics metrics...", 0)

  const allAnalytics = new Map<string, Partial<AnalyticsRow>>()
  const allWarnings: string[] = []
  let totalAnalyticsCalls = 0

  // 4A: Fetch universal metrics for ALL videos
  const allVideosGroups = Object.entries(ANALYTICS_METRIC_GROUPS_ALL)
  for (let gi = 0; gi < allVideosGroups.length; gi++) {
    const [groupName, metrics] = allVideosGroups[gi]
    onProgress?.("analytics", `Fetching universal ${groupName} metrics...`, 0.2 + (0.3 * gi / allVideosGroups.length))
    
    const { rows, apiCalls, warnings } = await fetchAnalyticsForGroup(
      token, videoIds, groupName, metrics, analyticsStartDate, analyticsEndDate,
    )
    totalAnalyticsCalls += apiCalls
    allWarnings.push(...warnings)

    Array.from(rows.entries()).forEach(([videoId, metricObj]) => {
      const existing = allAnalytics.get(videoId) || {}
      allAnalytics.set(videoId, { ...existing, ...metricObj })
    })
  }

  // 4B: Fetch long-form ONLY metrics
  if (longFormVideoIds.length > 0) {
    const longOnlyGroups = Object.entries(ANALYTICS_METRIC_GROUPS_LONG_ONLY)
    for (let gi = 0; gi < longOnlyGroups.length; gi++) {
      const [groupName, metrics] = longOnlyGroups[gi]
      onProgress?.("analytics", `Fetching long-form only ${groupName} metrics...`, 0.5 + (0.4 * gi / longOnlyGroups.length))
      
      const { rows, apiCalls, warnings } = await fetchAnalyticsForGroup(
        token, longFormVideoIds, groupName, metrics, analyticsStartDate, analyticsEndDate,
      )
      totalAnalyticsCalls += apiCalls
      allWarnings.push(...warnings)

      Array.from(rows.entries()).forEach(([videoId, metricObj]) => {
        const existing = allAnalytics.get(videoId) || {}
        allAnalytics.set(videoId, { ...existing, ...metricObj })
      })
    }
  }

  quotaEstimate.analyticsReportCalls = totalAnalyticsCalls
  quotaEstimate.totalEstimated =
    1 + quotaEstimate.playlistItemsCalls + quotaEstimate.videosListCalls + quotaEstimate.analyticsReportCalls

  // ── Step 5: Merge into unified records ─────────────────────────────
  onProgress?.("merge", "Building unified video records...", 0.95)

  let shortsCount = 0
  let longFormCount = 0
  let unknownFormatCount = 0

  const videos: UnifiedVideoRecord[] = videoIds.map((videoId) => {
    const meta = metadata.get(videoId)
    const analytics = allAnalytics.get(videoId) || {}

    const durationSeconds = meta?.durationSeconds || 0
    const format = meta?.format || "unknown"

    if (format === "shorts") shortsCount++
    else if (format === "long") longFormCount++
    else unknownFormatCount++

    // Universal Analytics
    const views = Number(analytics.views ?? meta?.viewCount ?? 0)
    const engagedViews = Number(analytics.engagedViews ?? 0)
    const estimatedMinutesWatched = Number(analytics.estimatedMinutesWatched ?? 0)
    const averageViewDuration = Number(analytics.averageViewDuration ?? 0)
    const averageViewPercentage = Number(analytics.averageViewPercentage ?? 0)
    const subscribersGained = Number(analytics.subscribersGained ?? 0)
    const subscribersLost = Number(analytics.subscribersLost ?? 0)
    const likes = Number(analytics.likes ?? meta?.likeCount ?? 0)
    const dislikes = Number(analytics.dislikes ?? 0)
    const comments = Number(analytics.comments ?? meta?.commentCount ?? 0)
    const shares = Number(analytics.shares ?? 0)
    const estimatedRevenue = Number(analytics.estimatedRevenue ?? 0)
    const estimatedAdRevenue = Number(analytics.estimatedAdRevenue ?? 0)
    const estimatedRedPartnerRevenue = Number(analytics.estimatedRedPartnerRevenue ?? 0)
    const grossRevenue = Number(analytics.grossRevenue ?? 0)
    const cpmValue = Number(analytics.cpm ?? 0)
    const playbackBasedCpm = Number(analytics.playbackBasedCpm ?? 0)
    const monetizedPlaybacks = Number(analytics.monetizedPlaybacks ?? 0)
    const adImpressionsVal = Number(analytics.adImpressions ?? 0)
    const redViews = Number(analytics.redViews ?? 0)
    const estimatedRedMinutesWatched = Number(analytics.estimatedRedMinutesWatched ?? 0)

    // Long-Form Only Analytics
    const impressions = Number(analytics.videoThumbnailImpressions ?? 0)
    const impressionsCtr = Number(analytics.videoThumbnailImpressionsClickRate ?? 0)
    const playlistStarts = Number(analytics.playlistStarts ?? 0)
    const playlistViews = Number(analytics.playlistViews ?? 0)
    const viewsPerPlaylistStart = Number(analytics.viewsPerPlaylistStart ?? 0)
    const averageTimeInPlaylist = Number(analytics.averageTimeInPlaylist ?? 0)
    const playlistEstimatedMinutesWatched = Number(analytics.playlistEstimatedMinutesWatched ?? 0)
    const annotationCtr = Number(analytics.annotationClickThroughRate ?? 0)
    const annotationCloseRate = Number(analytics.annotationCloseRate ?? 0)
    const cardImpressionsVal = Number(analytics.cardImpressions ?? 0)
    const cardTeaserImpressions = Number(analytics.cardTeaserImpressions ?? 0)
    const cardClicksVal = Number(analytics.cardClicks ?? 0)
    const cardTeaserClicks = Number(analytics.cardTeaserClicks ?? 0)
    const cardClickRate = Number(analytics.cardClickRate ?? 0)
    const cardTeaserClickRate = Number(analytics.cardTeaserClickRate ?? 0)
    const endScreenElementImpressions = Number(analytics.endScreenElementImpressions ?? 0)
    const endScreenElementClicks = Number(analytics.endScreenElementClicks ?? 0)
    const endScreenElementClickRate = Number(analytics.endScreenElementClickRate ?? 0)

    // Derived
    const watchTimeHours = +(estimatedMinutesWatched / 60).toFixed(2)
    const rpm = views > 0 ? +((estimatedRevenue / views) * 1000).toFixed(4) : 0
    const likesVsDislikesPercent =
      likes + dislikes > 0 ? +((likes / (likes + dislikes)) * 100).toFixed(2) : 100
    const youtubePremiumWatchHours = +(estimatedRedMinutesWatched / 60).toFixed(2)

    return {
      videoId,
      title: meta?.title || `Unknown (${videoId})`,
      publishedDate: meta?.publishedAt || "",
      thumbnail: meta?.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,

      format,
      durationSeconds,
      durationFormatted: formatDuration(durationSeconds),
      durationRaw: meta?.durationRaw || "",

      description: meta?.description,
      tags: meta?.tags,
      categoryId: meta?.categoryId,
      defaultLanguage: meta?.defaultLanguage,
      privacyStatus: meta?.privacyStatus,
      definition: meta?.definition,
      caption: meta?.caption,
      licensedContent: meta?.licensedContent,
      madeForKids: meta?.madeForKids,
      aspectRatioBucket: meta?.aspectRatioBucket,

      views,
      engagedViews,
      uniqueViewers: null,
      averageViewsPerViewer: null,
      
      impressions,
      impressionsCtr,

      watchTimeHours,
      averageViewDuration,
      averagePercentageViewed: averageViewPercentage,

      subscribersGained,
      subscribersLost,
      likes,
      dislikes,
      likesVsDislikesPercent,
      shares,
      commentsAdded: comments,

      estimatedRevenue,
      youtubeAdRevenue: estimatedAdRevenue,
      youtubePremiumRevenue: estimatedRedPartnerRevenue,
      grossRevenue,
      transactionRevenue: null,
      transactions: null,
      revenuePerTransaction: null,
      playbackBasedCpm,
      cpm: cpmValue,
      estimatedMonetizedPlaybacks: monetizedPlaybacks,
      rpm,
      adImpressions: adImpressionsVal,

      youtubePremiumViews: redViews,
      youtubePremiumWatchHours,

      playlistStarts,
      playlistViews,
      viewsPerPlaylistStart,
      averageTimeInPlaylist,
      playlistEstimatedMinutesWatched,

      annotationCtr,
      annotationCloseRate,
      cardImpressions: cardImpressionsVal,
      cardTeaserImpressions,
      cardClicks: cardClicksVal,
      cardTeaserClicks,
      cardClickRate,
      cardTeaserClickRate,

      endScreenElementImpressions,
      endScreenElementClicks,
      endScreenElementClickRate,
    }
  })

  onProgress?.("complete", `Sync complete: ${videos.length} videos processed.`, 1)

  return {
    channelId,
    syncedAt: new Date().toISOString(),
    totalVideos: videos.length,
    shortsCount,
    longFormCount,
    unknownFormatCount,
    videos,
    quotaEstimate,
  }
}
