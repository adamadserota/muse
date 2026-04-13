/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { SongTitle } from "./SongTitle";
import { LyricsOutput } from "./LyricsOutput";
import { StyleOutput } from "./StyleOutput";
import { ExcludeOutput } from "./ExcludeOutput";
import { AnalysisSection } from "./AnalysisSection";
import { PlainLyricsOutput } from "./PlainLyricsOutput";
import { AlbumCover } from "./AlbumCover";
import type { GenerateResponse, RegenerableSection } from "../types";
import type { SaveStyleParams } from "../hooks/useSavedStyles";

function extractSongTitle(lyrics: string | null | undefined): string {
    if (!lyrics) return "UNTITLED";
    const match = lyrics.match(/\[Title:\s*(.+?)\]/i);
    return match?.[1]?.trim() || "UNTITLED";
}

const panelStyle = css({
    padding: 16,
    height: "100%",
    maxWidth: 960,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
});

interface OutputPanelProps {
    result: GenerateResponse | null;
    loading: boolean;
    genres?: string[];
    modelName?: string;
    onUpdateResult?: (patch: Partial<GenerateResponse>) => void;
    onSaveStyle?: (params: SaveStyleParams) => string | null;
    onRegenerate?: (section: RegenerableSection) => void;
    onRegenerateAll?: () => void;
    regenerating?: Record<RegenerableSection, boolean>;
}

export function OutputPanel({
    result,
    genres,
    modelName,
    onUpdateResult,
    onSaveStyle,
    onRegenerate,
    onRegenerateAll,
    regenerating,
}: OutputPanelProps) {
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

    if (!result) {
        return (
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                }}
            >
                <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center", maxWidth: 400 }}>
                    <Typography variant="h4" color="text.primary">
                        Muse
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Nothing yet. Create something on the Create tab.
                    </Typography>
                </Stack>
            </Box>
        );
    }

    const songTitle = extractSongTitle(result.lyrics);
    const anyRegenerating = regenerating && Object.values(regenerating).some(Boolean);

    return (
        <div css={panelStyle}>
            <SongTitle
                value={songTitle}
                onChange={onUpdateResult ? handleTitleChange : undefined}
            />
            {onRegenerateAll && (
                <Stack spacing={1} sx={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                    {modelName && (
                        <Typography variant="caption" color="text.secondary">
                            {modelName}
                        </Typography>
                    )}
                    <Button
                        size="small"
                        onClick={onRegenerateAll}
                        disabled={!!anyRegenerating}
                        startIcon={
                            anyRegenerating ? (
                                <CircularProgress size={14} color="inherit" />
                            ) : (
                                <RefreshIcon fontSize="small" />
                            )
                        }
                        aria-label="Regenerate all sections"
                    >
                        {anyRegenerating ? "Regenerating…" : "Regenerate all"}
                    </Button>
                </Stack>
            )}
            <LyricsOutput
                value={result.lyrics}
                onChange={onUpdateResult ? handleLyricsChange : undefined}
                onRegenerate={onRegenerate ? () => onRegenerate("lyrics") : undefined}
                regenerating={regenerating?.lyrics}
            />
            <StyleOutput
                value={result.styles}
                excludeStyles={result.exclude_styles}
                genres={genres}
                onChange={onUpdateResult ? handleStylesChange : undefined}
                onSaveStyle={onSaveStyle}
                onRegenerate={onRegenerate ? () => onRegenerate("styles") : undefined}
                regenerating={regenerating?.styles}
            />
            <ExcludeOutput
                value={result.exclude_styles}
                onChange={onUpdateResult ? handleExcludeChange : undefined}
                onRegenerate={onRegenerate ? () => onRegenerate("exclude_styles") : undefined}
                regenerating={regenerating?.exclude_styles}
            />
            <AnalysisSection
                analysis={result.analysis}
                onRegenerate={onRegenerate ? () => onRegenerate("analysis") : undefined}
                regenerating={regenerating?.analysis}
            />
            <PlainLyricsOutput value={result.plain_lyrics} />
            {result.plain_lyrics && (
                <AlbumCover
                    plainLyrics={result.plain_lyrics}
                    songTitle={songTitle}
                    styles={result.styles}
                />
            )}
        </div>
    );
}
