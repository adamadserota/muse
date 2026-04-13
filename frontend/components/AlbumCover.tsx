import { useState, useCallback } from "react";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { CollapsibleCard } from "./CollapsibleCard";
import { generateAlbumCover } from "../services/apiClient";
import { compositeAlbumCover } from "../services/coverCompositor";

interface AlbumCoverProps {
    plainLyrics: string;
    songTitle: string;
    styles: string;
}

export function AlbumCover({ plainLyrics, songTitle, styles }: AlbumCoverProps) {
    const [compositeDataUrl, setCompositeDataUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<"idle" | "generating" | "compositing">("idle");

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);
        setStep("generating");
        try {
            const res = await generateAlbumCover({ plainLyrics, songTitle, styles });
            setStep("compositing");
            const dataUrl = await compositeAlbumCover({
                artworkBase64: res.image_base64,
                mimeType: res.mime_type,
                songTitle,
            });
            setCompositeDataUrl(dataUrl);
            setStep("idle");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to generate album cover");
            setStep("idle");
        } finally {
            setLoading(false);
        }
    }, [plainLyrics, songTitle, styles]);

    const handleDownload = useCallback(() => {
        if (!compositeDataUrl) return;
        const link = document.createElement("a");
        link.href = compositeDataUrl;
        const safeName = songTitle.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        link.download = `muse_${safeName || "song"}.png`;
        link.click();
    }, [compositeDataUrl, songTitle]);

    const headerRight =
        !compositeDataUrl && !loading ? (
            <Button
                size="small"
                variant="outlined"
                startIcon={<ImageOutlinedIcon fontSize="small" />}
                onClick={(e) => {
                    e.stopPropagation();
                    handleGenerate();
                }}
            >
                Generate cover
            </Button>
        ) : undefined;

    return (
        <CollapsibleCard title="Album cover" headerRight={headerRight}>
            {loading && (
                <Stack
                    spacing={1}
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                    }}
                >
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                        {step === "generating"
                            ? "Generating artwork with Imagen…"
                            : "Compositing typography overlay…"}
                    </Typography>
                </Stack>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 1 }}>
                    {error}
                </Alert>
            )}

            {compositeDataUrl && (
                <Stack spacing={1}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src={compositeDataUrl}
                            alt={`Album cover for ${songTitle}`}
                            sx={{
                                maxWidth: "100%",
                                maxHeight: 500,
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 1,
                            }}
                        />
                    </Box>
                    <Stack spacing={1} sx={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <Button
                            size="small"
                            disabled={loading}
                            startIcon={<RefreshIcon fontSize="small" />}
                            onClick={handleGenerate}
                        >
                            Regenerate
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<DownloadOutlinedIcon fontSize="small" />}
                            onClick={handleDownload}
                        >
                            Download PNG
                        </Button>
                    </Stack>
                </Stack>
            )}
        </CollapsibleCard>
    );
}
