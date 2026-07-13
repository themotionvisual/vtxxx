// Catalog of YouTube API integration ideas, sourced from the planning doc
// "100 Ways to Leverage the YouTube API for VIEWTUBE".

export interface IntegrationIdea {
  id: string;
  title: string;
  description: string;
  category: IntegrationCategory;
}

export type IntegrationCategory =
  | 'BULK & WORKFLOW'
  | 'COMMUNITY'
  | 'SEO & GROWTH'
  | 'MONETIZATION'
  | 'CROSS-PLATFORM'
  | 'ACCESSIBILITY'
  | 'LIVE STREAMING'
  | 'AI & DATA'
  | 'EXPERIMENTAL'
  | 'SECURITY & AGENCY';

export const CATEGORY_COLORS: Record<IntegrationCategory, string> = {
  'BULK & WORKFLOW': 'bg-neo-cyan',
  'COMMUNITY': 'bg-neo-pink',
  'SEO & GROWTH': 'bg-neo-lime',
  'MONETIZATION': 'bg-neo-yellow',
  'CROSS-PLATFORM': 'bg-neo-orange',
  'ACCESSIBILITY': 'bg-neo-blue',
  'LIVE STREAMING': 'bg-neo-red',
  'AI & DATA': 'bg-neo-purple',
  'EXPERIMENTAL': 'bg-neo-green',
  'SECURITY & AGENCY': 'bg-neo-gray',
};

// Categories whose swatch color is dark enough to need white text on top.
export const CATEGORY_DARK_TEXT: IntegrationCategory[] = [
  'COMMUNITY',
  'LIVE STREAMING',
  'AI & DATA',
];

export const INTEGRATION_IDEAS: IntegrationIdea[] = [
  // ---- Bulk Management & Workflow Automation ----
  { id: 'bulk-01', category: 'BULK & WORKFLOW', title: 'Dynamic Titles', description: "Automatically update a video's title based on its stats (e.g., \"This video has 1,234,567 views!\")." },
  { id: 'bulk-02', category: 'BULK & WORKFLOW', title: 'Sponsor Link Rotator', description: "Bulk update all video descriptions to change an old sponsor's link/promo code to a new one instantly." },
  { id: 'bulk-03', category: 'BULK & WORKFLOW', title: 'Scheduled Unlisting', description: 'Set an expiration date on promotional videos, automatically changing their privacy from Public to Unlisted after a certain time.' },
  { id: 'bulk-04', category: 'BULK & WORKFLOW', title: 'Thumbnail A/B Testing', description: "Swap a video's thumbnail every 24 hours, track the CTR via the Analytics API, and permanently set the winner." },
  { id: 'bulk-05', category: 'BULK & WORKFLOW', title: 'Dynamic Channel Banners', description: "Update the channel's banner image daily to reflect a live subscriber countdown or the latest video's thumbnail." },
  { id: 'bulk-06', category: 'BULK & WORKFLOW', title: 'Smart Playlists', description: 'Automatically sort playlists by "Most Viewed in the Last 30 Days" rather than just upload date.' },
  { id: 'bulk-07', category: 'BULK & WORKFLOW', title: 'Series Tag Syncing', description: 'Ensure every video in a series has the exact same tags, bulk-updating them whenever a new tag is added.' },
  { id: 'bulk-08', category: 'BULK & WORKFLOW', title: 'Holiday Makeovers', description: 'Automatically change thumbnails, banners, and profile pictures on specific holidays, then revert them the next day.' },
  { id: 'bulk-09', category: 'BULK & WORKFLOW', title: 'Description Timestamps', description: 'Drag-and-drop chapters in the UI, automatically formatting and pushing the timestamps to the video description.' },
  { id: 'bulk-10', category: 'BULK & WORKFLOW', title: 'Auto-Categorization', description: 'Automatically assign YouTube categories to uploaded videos based on keywords in the title.' },

  // ---- Audience Interaction & Community Building ----
  { id: 'comm-01', category: 'COMMUNITY', title: 'Sentiment Analysis', description: 'Route all new comments through an NLP API to gauge if audience reaction is positive, negative, or neutral.' },
  { id: 'comm-02', category: 'COMMUNITY', title: 'Auto-Heart Top Fans', description: 'Automatically "Heart" comments from users subscribed for over a year or who commented on the last 5 videos.' },
  { id: 'comm-03', category: 'COMMUNITY', title: 'Troll Filter', description: 'Automatically hold or delete comments containing specific toxic phrases, using an AI moderation API.' },
  { id: 'comm-04', category: 'COMMUNITY', title: 'Q&A Extractor', description: 'Scan comments for question marks and aggregate them into a "Q&A" dashboard for the creator\'s next video.' },
  { id: 'comm-05', category: 'COMMUNITY', title: 'Auto-Reply to FAQs', description: 'Automatically reply to common questions (e.g., "What camera do you use?") with a pre-set response and affiliate link.' },
  { id: 'comm-06', category: 'COMMUNITY', title: 'Translation Bot', description: "Detect non-English comments and reply with a translated version of the creator's standard thank-you message." },
  { id: 'comm-07', category: 'COMMUNITY', title: 'Top Commenter Leaderboard', description: 'Track the most active commenters across the channel and display a leaderboard on the VIEWTUBE dashboard.' },
  { id: 'comm-08', category: 'COMMUNITY', title: 'Discord Sync', description: 'Push new YouTube comments to a private Discord channel so the creator can reply directly from Discord.' },
  { id: 'comm-09', category: 'COMMUNITY', title: 'Community Post Automation', description: 'Publish a Community Post 24 hours after a video goes live, asking the audience for their favorite moment.' },
  { id: 'comm-10', category: 'COMMUNITY', title: 'Super Chat Alerts', description: "Trigger smart lights (Philips Hue API) in the creator's studio whenever a Super Chat over $50 is received." },

  // ---- SEO, Strategy, & Growth ----
  { id: 'seo-01', category: 'SEO & GROWTH', title: 'Competitor Tag Tracker', description: "Input a competitor's channel and extract and analyze the hidden tags on their most popular videos." },
  { id: 'seo-02', category: 'SEO & GROWTH', title: 'AI Title Generator', description: "Send a video's transcript to an AI API to generate 5 SEO-optimized titles, pushing the pick directly to YouTube." },
  { id: 'seo-03', category: 'SEO & GROWTH', title: 'Keyword Rank Tracking', description: "Track where a creator's video ranks for specific search terms over time and plot it on a graph." },
  { id: 'seo-04', category: 'SEO & GROWTH', title: 'Trending Alert System', description: 'Monitor specific niches and send an SMS (Twilio API) when a topic in the niche starts trending globally.' },
  { id: 'seo-05', category: 'SEO & GROWTH', title: 'Description SEO Scorer', description: 'Analyze a drafted description against the tags and title, giving a "VIEWTUBE SEO Score" before publishing.' },
  { id: 'seo-06', category: 'SEO & GROWTH', title: 'Thumbnail Color Analysis', description: 'Analyze which dominant colors in past thumbnails resulted in the highest click-through rate.' },
  { id: 'seo-07', category: 'SEO & GROWTH', title: 'Retention Dip Finder', description: 'Identify the exact second viewers drop off across videos and highlight these moments in a "Mistakes to Avoid" dashboard.' },
  { id: 'seo-08', category: 'SEO & GROWTH', title: 'Auto-Translation Generator', description: 'Send titles and descriptions to a translation API and update the localized metadata for Spanish, Hindi, etc.' },
  { id: 'seo-09', category: 'SEO & GROWTH', title: 'Metadata Backup', description: 'Automatically back up all titles, tags, descriptions, and thumbnails to cloud storage in case the channel is hacked.' },
  { id: 'seo-10', category: 'SEO & GROWTH', title: 'Series Linker', description: 'Automatically update the description of Part 1 with a link to Part 2 the moment Part 2 is published.' },

  // ---- Monetization, Finance & Business ----
  { id: 'money-01', category: 'MONETIZATION', title: 'Custom Financial Dashboards', description: 'Pull ad, membership, and Premium revenue into a single, clean chart in VIEWTUBE.' },
  { id: 'money-02', category: 'MONETIZATION', title: 'Sponsor ROI Calculator', description: 'Combine YouTube Analytics views with external link clicks (Bitly API) to show sponsors the value they received.' },
  { id: 'money-03', category: 'MONETIZATION', title: 'Accounting Integration', description: "Automatically sync daily or monthly ad revenue directly into the creator's Quickbooks/Xero accounting software." },
  { id: 'money-04', category: 'MONETIZATION', title: 'Merch Drop Automation', description: 'Add a promotional paragraph to the top of ALL descriptions when a Shopify trigger indicates a new merch drop.' },
  { id: 'money-05', category: 'MONETIZATION', title: 'Affiliate Link Tracker', description: 'Scan descriptions for affiliate links and alert the creator if any links are broken or products out of stock.' },
  { id: 'money-06', category: 'MONETIZATION', title: 'Membership Tier Exclusives', description: 'Automatically unlist certain videos and push the links to a Patreon or Members-only post.' },
  { id: 'money-07', category: 'MONETIZATION', title: 'Tax Estimator', description: 'Calculate estimated taxes owed based on monthly ad revenue and local tax rates, setting aside a "safe" number.' },
  { id: 'money-08', category: 'MONETIZATION', title: 'Revenue Anomaly Alerts', description: 'Send an email alert if RPM or CPM drops by more than 20% in a 48-hour period.' },
  { id: 'money-09', category: 'MONETIZATION', title: 'Video Worth Predictor', description: 'Use historical data to predict how much money a specific video will make over the next 365 days.' },
  { id: 'money-10', category: 'MONETIZATION', title: 'Crowdfunding Sync', description: 'Update a video\'s title to reflect a live Kickstarter campaign (e.g., "VLOG #54 [FUNDED 80%!]").' },

  // ---- Cross-Platform Integrations ----
  { id: 'xplat-01', category: 'CROSS-PLATFORM', title: 'Twitter/X Sync', description: 'Automatically tweet the video link, thumbnail, and a custom message the second a video goes public.' },
  { id: 'xplat-02', category: 'CROSS-PLATFORM', title: 'Newsletter Automation', description: 'Generate and send a Mailchimp/ConvertKit email campaign to subscribers when a new video is posted.' },
  { id: 'xplat-03', category: 'CROSS-PLATFORM', title: 'Spotify Podcast Sync', description: 'If a video has "Podcast" in the title, strip the audio and push it to RSS/Spotify via an audio encoding integration.' },
  { id: 'xplat-04', category: 'CROSS-PLATFORM', title: 'Notion/Trello Workflow', description: 'When a video is marked "Published", automatically move the card to "Done" in the creator\'s Trello or Notion board.' },
  { id: 'xplat-05', category: 'CROSS-PLATFORM', title: 'TikTok/Reels Repurposer', description: 'Trigger a video editing API to crop the most replayed 60 seconds into a vertical format for TikTok.' },
  { id: 'xplat-06', category: 'CROSS-PLATFORM', title: 'Website Auto-Embed', description: 'Ping a WordPress webhook to create a blog post embedding the newest video and pasting its transcript.' },
  { id: 'xplat-07', category: 'CROSS-PLATFORM', title: 'Slack Team Notifications', description: "Alert the creator's editing team in Slack when a draft video finishes processing its HD/4K versions." },
  { id: 'xplat-08', category: 'CROSS-PLATFORM', title: 'Subreddit Poster', description: 'Automatically post the video link to an approved, creator-owned subreddit as soon as it goes live.' },
  { id: 'xplat-09', category: 'CROSS-PLATFORM', title: 'GitHub Release Notes', description: 'For developer channels, link a GitHub release to automatically trigger a YouTube community post.' },
  { id: 'xplat-10', category: 'CROSS-PLATFORM', title: 'Twitch Integration', description: 'When going live on YouTube, update the offline Twitch banner to say "Live on YouTube right now!"' },

  // ---- Accessibility & Localization ----
  { id: 'a11y-01', category: 'ACCESSIBILITY', title: 'Auto-Caption Uploader', description: 'Send audio to a transcription API (Rev/Whisper), generate an SRT, and upload it via the YouTube API.' },
  { id: 'a11y-02', category: 'ACCESSIBILITY', title: 'Readability Checker', description: 'Ensure video descriptions are written at an 8th-grade reading level for maximum accessibility.' },
  { id: 'a11y-03', category: 'ACCESSIBILITY', title: 'Sign Language Overlay', description: 'Connect with ASL overlay services and automatically swap the video file when the ASL version is ready.' },
  { id: 'a11y-04', category: 'ACCESSIBILITY', title: 'Multi-Language Audio', description: 'Bulk upload dubbed audio tracks mapped to specific languages for channels with multi-language audio.' },
  { id: 'a11y-05', category: 'ACCESSIBILITY', title: 'Region Restriction Checker', description: 'Check if a video is blocked in specific countries and display a world map highlighting blocked regions.' },
  { id: 'a11y-06', category: 'ACCESSIBILITY', title: 'Accessibility Tagging', description: 'Automatically append accessibility hashtags so audiences can easily find captioned videos.' },
  { id: 'a11y-07', category: 'ACCESSIBILITY', title: 'Descriptive Audio Uploader', description: 'Bulk manage secondary audio tracks containing audio descriptions for visually impaired audiences.' },
  { id: 'a11y-08', category: 'ACCESSIBILITY', title: 'Comment Translation Export', description: 'Export non-native comments to CSV, translate them, and help the creator understand their global audience.' },
  { id: 'a11y-09', category: 'ACCESSIBILITY', title: 'Localized Playlists', description: 'Create separate playlists for videos with specific language captions (e.g., "Videos con Subtítulos en Español").' },
  { id: 'a11y-10', category: 'ACCESSIBILITY', title: 'Accessibility Score', description: 'Score each video based on caption accuracy, description readability, and localized metadata.' },

  // ---- Live Streaming Features ----
  { id: 'live-01', category: 'LIVE STREAMING', title: 'Live Auto-Scheduler', description: 'Set a recurring schedule that automatically creates a YouTube Live broadcast event every Friday at 5 PM.' },
  { id: 'live-02', category: 'LIVE STREAMING', title: 'Chat Moderation Bot', description: 'A custom bot on the Live Chat API to time out users, delete messages, and answer commands (e.g., "!gear").' },
  { id: 'live-03', category: 'LIVE STREAMING', title: 'Dynamic Stream Titles', description: 'Update the stream title from a game API (e.g., "Playing Minecraft | 5 Diamonds Found!").' },
  { id: 'live-04', category: 'LIVE STREAMING', title: 'Stream Highlight Marker', description: 'A button the creator hits while streaming that logs the timestamp; VIEWTUBE exports these for easy clipping.' },
  { id: 'live-05', category: 'LIVE STREAMING', title: 'Live Viewer Analytics', description: 'A real-time dashboard showing exactly when viewers joined and left to identify engaging moments.' },
  { id: 'live-06', category: 'LIVE STREAMING', title: 'Auto-Unlist After Stream', description: 'Automatically change a live stream\'s privacy to "Unlisted" the second the broadcast ends.' },
  { id: 'live-07', category: 'LIVE STREAMING', title: 'Multi-cam Management', description: 'Manage ingest endpoints for multiple camera angles using the Live Streaming API.' },
  { id: 'live-08', category: 'LIVE STREAMING', title: 'Super Chat Tracker UI', description: 'A full-screen Super Chat display on a secondary monitor so the creator never misses thanking a donor.' },
  { id: 'live-09', category: 'LIVE STREAMING', title: 'Live Poll Automator', description: 'Automatically trigger YouTube live polls at specific timestamps during a pre-planned live event.' },
  { id: 'live-10', category: 'LIVE STREAMING', title: 'End-Stream Summary', description: 'Email the creator peak concurrency, total super chats, and average watch time 10 minutes after a stream ends.' },

  // ---- Advanced AI & Data Integrations ----
  { id: 'ai-01', category: 'AI & DATA', title: 'Thumbnails from Video', description: 'Extract the 10 clearest, most expressive frames from a video, offering them as thumbnail options.' },
  { id: 'ai-02', category: 'AI & DATA', title: 'AI Avatar Videos', description: 'Type text into VIEWTUBE, an AI (e.g., Synthesia) generates a talking-avatar video, and it uploads to YouTube directly.' },
  { id: 'ai-03', category: 'AI & DATA', title: 'Sponsorship Conflict Checker', description: "Scan all descriptions to ensure a new sponsor doesn't conflict with a competitor linked in an older video." },
  { id: 'ai-04', category: 'AI & DATA', title: 'Content Gap Analyzer', description: "Cross-reference search volume with the channel to suggest topics the audience searches for but aren't covered yet." },
  { id: 'ai-05', category: 'AI & DATA', title: 'Subscriber LTV Calculator', description: 'Model the "Lifetime Value" of a single subscriber in terms of ad revenue.' },
  { id: 'ai-06', category: 'AI & DATA', title: 'Automated Chaptering', description: 'Use AI to analyze the transcript and automatically generate perfectly formatted video chapters.' },
  { id: 'ai-07', category: 'AI & DATA', title: 'B-Roll Tagging', description: 'Tag raw footage in an unlisted "Vault" channel via a vision API (e.g., "Dog", "Beach") to make b-roll searchable.' },
  { id: 'ai-08', category: 'AI & DATA', title: 'Copyright Strike Monitor', description: "Continuously poll channel status and push a high-priority notification if a copyright strike is received." },
  { id: 'ai-09', category: 'AI & DATA', title: 'Voice Cloning Dubs', description: "Clone the creator's voice (ElevenLabs) to auto-dub videos into other languages, uploading the new audio tracks." },
  { id: 'ai-10', category: 'AI & DATA', title: 'Audience Overlap', description: 'Compare commenter IDs across videos to see how much of the audience watches both gaming content and vlogs.' },

  // ---- "Outside the Box" & Experimental ----
  { id: 'exp-01', category: 'EXPERIMENTAL', title: 'Choose-Your-Adventure Automator', description: 'Wire up end screens across 10 unlisted videos to point to specific choices, creating an interactive game.' },
  { id: 'exp-02', category: 'EXPERIMENTAL', title: 'Game-Triggered Uploads', description: 'Via the Steam API, every match win clips the last 5 minutes from OBS and pushes it to an unlisted YouTube draft.' },
  { id: 'exp-03', category: 'EXPERIMENTAL', title: 'Fitness Tracker Sync', description: 'When a fitness vlogger uploads a run, add their Strava/Fitbit heart rate, distance, and pace to the description.' },
  { id: 'exp-04', category: 'EXPERIMENTAL', title: 'Weather Thumbnails', description: "If it's raining in the creator's city, the banner and thumbnails dynamically get a \"rainy\" overlay." },
  { id: 'exp-05', category: 'EXPERIMENTAL', title: 'Interactive Scavenger Hunts', description: 'Hide puzzle pieces in tags or captions of older videos, moving the clue to a different video every week.' },
  { id: 'exp-06', category: 'EXPERIMENTAL', title: 'Stock Ticker Banner', description: 'For finance channels, update the banner every hour with the real-time price of stocks they hold.' },
  { id: 'exp-07', category: 'EXPERIMENTAL', title: 'Spotify Now Playing', description: 'Update the "About" page or banner with the song the creator is currently listening to on Spotify.' },
  { id: 'exp-08', category: 'EXPERIMENTAL', title: 'View-Count Charity Donations', description: 'For every 1,000 views a specific video gets, trigger an automatic $1 donation to a chosen charity.' },
  { id: 'exp-09', category: 'EXPERIMENTAL', title: 'Geo-Fenced Premieres', description: "Publish a video only when the creator's phone GPS registers arrival at a specific location (e.g., a premiere)." },
  { id: 'exp-10', category: 'EXPERIMENTAL', title: 'Smart Home "On Air" Sign', description: 'Trigger a red "ON AIR" neon sign outside the office door the second a stream goes live.' },

  // ---- Security, Backup & Agency Tools ----
  { id: 'sec-01', category: 'SECURITY & AGENCY', title: 'Editor Approval Workflow', description: 'Editors upload as "Private"; the creator reviews in VIEWTUBE and one click flips it to Public/Scheduled.' },
  { id: 'sec-02', category: 'SECURITY & AGENCY', title: 'Mass Description Wipe', description: 'A "Panic Button" that instantly removes all links from every description if an affiliate account is compromised.' },
  { id: 'sec-03', category: 'SECURITY & AGENCY', title: 'Channel Audit Log', description: 'A chronological log of who on the team changed a title, updated a tag, or replied to a comment.' },
  { id: 'sec-04', category: 'SECURITY & AGENCY', title: 'Demonetization Auto-Appeal', description: 'If a video\'s monetization flips to "Limited", immediately alert the team to request a manual review.' },
  { id: 'sec-05', category: 'SECURITY & AGENCY', title: 'Agency Multi-Channel Dashboard', description: 'Aggregate total views, subs, and revenue of 50+ creators into one master portfolio screen.' },
  { id: 'sec-06', category: 'SECURITY & AGENCY', title: 'Dead Link Sweeper', description: 'A monthly job that checks every link in every description and flags 404 pages or expired domains.' },
  { id: 'sec-07', category: 'SECURITY & AGENCY', title: 'Video Deletion Recovery', description: 'Download a low-res backup of every video the moment it publishes, preventing accidental permanent loss.' },
  { id: 'sec-08', category: 'SECURITY & AGENCY', title: 'Role-Based Comment Access', description: 'Let a VA reply to comments via VIEWTUBE without ever having the actual channel password.' },
  { id: 'sec-09', category: 'SECURITY & AGENCY', title: 'Sponsor Video Proof', description: 'Auto-generate a read-only branded page with the video player and live analytics, emailed to the sponsor.' },
  { id: 'sec-10', category: 'SECURITY & AGENCY', title: 'The "Time Machine"', description: "Take a daily snapshot of the channel's exact state (titles, thumbnails, subs) and browse any past date." },
];

export const CATEGORIES = Object.keys(CATEGORY_COLORS) as IntegrationCategory[];
