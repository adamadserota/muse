/** Extract the song title from the [Title: ...] metatag inside lyrics. */
export function extractSongTitle(lyrics: string | null | undefined): string {
    if (!lyrics) return "Untitled";
    const match = lyrics.match(/\[Title:\s*(.+?)\]/i);
    return match?.[1]?.trim() || "Untitled";
}
