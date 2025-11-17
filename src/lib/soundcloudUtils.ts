/**
 * SoundCloud Utility Functions
 *
 * Helper functions for detecting SoundCloud URL types and generating embed URLs
 */

/**
 * Detect if a SoundCloud URL is a track (embeddable) or playlist/profile (link only)
 *
 * Track URL patterns:
 * - soundcloud.com/user/track-name
 * - soundcloud.com/user/track-name-n
 * - soundcloud.com/user/sets/playlist-name (this is a playlist, not track)
 *
 * @param url - SoundCloud URL to check
 * @returns true if URL is a track, false if playlist or profile
 */
export function isSoundCloudTrack(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    // Must be soundcloud.com domain
    if (!hostname.includes("soundcloud.com")) {
      return false
    }

    const pathname = urlObj.pathname.toLowerCase()

    // Playlists have "/sets/" in the path
    if (pathname.includes("/sets/")) {
      return false
    }

    // Profiles are just the root path
    if (pathname === "/" || pathname.split("/").filter(Boolean).length === 1) {
      return false
    }

    // If it's a soundcloud.com URL and not a playlist or profile, assume it's a track
    // Tracks typically have pattern: /user/track-name
    const pathParts = pathname.split("/").filter(Boolean)
    if (pathParts.length >= 2) {
      // Has at least user and track name
      return true
    }

    return false
  } catch {
    // Invalid URL
    return false
  }
}

/**
 * Generate SoundCloud embed URL from a track URL
 *
 * @param trackUrl - SoundCloud track URL
 * @returns Embed URL for iframe src attribute
 */
export function getSoundCloudEmbedUrl(trackUrl: string): string {
  const encodedUrl = encodeURIComponent(trackUrl)
  return `https://w.soundcloud.com/player/?url=${encodedUrl}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true`
}
