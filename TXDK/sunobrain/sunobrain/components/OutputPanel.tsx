/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback } from "react";
import { SongTitle } from "./SongTitle";
import { LyricsOutput } from "./LyricsOutput";
import { StyleOutput } from "./StyleOutput";
import { ExcludeOutput } from "./ExcludeOutput";
import { AnalysisSection } from "./AnalysisSection";
import { PlainLyricsOutput } from "./PlainLyricsOutput";
import { AlbumCover } from "./AlbumCover";
import { LoadingAnimation } from "./LoadingAnimation";
import type { GenerateResponse } from "../types";
import type { SaveStyleParams } from "../hooks/useSavedStyles";

function extractSongTitle(lyrics: string): string {
    const match = lyrics.match(/\[Title:\s*(.+?)\]/i);
    return match?.[1]?.trim() || "UNTITLED";
}

const panelStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "var(--fui-spacing-3)",
    padding: "var(--fui-spacing-3)",
    height: "100%",
    overflow: "auto",
});

const emptyStyle = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: "var(--fui-spacing-3)",
    color: "var(--fui-text-muted)",
    fontFamily: "var(--fui-font)",
    textAlign: "center",
    padding: "var(--fui-spacing-6)",
});

const emptyTitle = css({
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "var(--fui-primary-40)",
});

const emptyDesc = css({
    fontSize: "14px",
    lineHeight: 1.6,
    maxWidth: 360,
});

interface OutputPanelProps {
    result: GenerateResponse | null;
    loading: boolean;
    apiKey: string;
    genres?: string[];
    onUpdateResult?: (patch: Partial<GenerateResponse>) => void;
    onSaveStyle?: (params: SaveStyleParams) => string | null;
}

export function OutputPanel({
    result,
    loading,
    apiKey,
    genres,
    onUpdateResult,
    onSaveStyle,
}: OutputPanelProps) {
    // When the title is edited, update the [Title: ...] tag inside lyrics too
    const handleTitleChange = useCallback(
        (newTitle: string) => {
            if (!result || !onUpdateResult) return;
            const updatedLyrics = result.lyrics.replace(
                /\[Title:\s*(.+?)\]/i,
                `[Title: ${newTitle}]`,
            );
            onUpdateResult({ lyrics: updatedLyrics });
        },
        [result, onUpdateResult],
    );

    const handleLyricsChange = useCallback(
        (newLyrics: string) => onUpdateResult?.({ lyrics: newLyrics }),
        [onUpdateResult],
    );

    const handleStylesChange = useCallback(
        (newStyles: string) => onUpdateResult?.({ styles: newStyles }),
        [onUpdateResult],
    );

    const handleExcludeChange = useCallback(
        (newExclude: string) => onUpdateResult?.({ exclude_styles: newExclude }),
        [onUpdateResult],
    );

    if (loading) {
        return (
            <div css={panelStyle}>
                <LoadingAnimation />
            </div>
        );
    }

    if (!result) {
        return (
            <div css={panelStyle}>
                <div css={emptyStyle}>
                    <div css={emptyTitle}>SunoBrain</div>
                    <div css={emptyDesc}>
                        Paste lyrics or describe a theme, then hit Generate to produce
                        Suno v5.5-optimized output.
                    </div>
                </div>
            </div>
        );
    }

    const songTitle = extractSongTitle(result.lyrics);

    return (
        <div css={panelStyle}>
            <SongTitle
                value={songTitle}
                onChange={onUpdateResult ? handleTitleChange : undefined}
            />
            <LyricsOutput
                value={result.lyrics}
                onChange={onUpdateResult ? handleLyricsChange : undefined}
            />
            <StyleOutput
                value={result.styles}
                excludeStyles={result.exclude_styles}
                genres={genres}
                onChange={onUpdateResult ? handleStylesChange : undefined}
                onSaveStyle={onSaveStyle}
            />
            <ExcludeOutput
                value={result.exclude_styles}
                onChange={onUpdateResult ? handleExcludeChange : undefined}
            />
            <AnalysisSection analysis={result.analysis} />
            <PlainLyricsOutput value={result.plain_lyrics} />
            {result.plain_lyrics && apiKey && (
                <AlbumCover
                    plainLyrics={result.plain_lyrics}
                    songTitle={songTitle}
                    styles={result.styles}
                    apiKey={apiKey}
                />
            )}
        </div>
    );
}
