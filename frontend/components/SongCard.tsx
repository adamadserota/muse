import { Box, Card, CardActionArea, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import type { SongEntry } from "../types";

function relativeTime(iso: string): string {
    try {
        const then = new Date(iso).getTime();
        const diff = Date.now() - then;
        const minute = 60_000;
        const hour = 60 * minute;
        const day = 24 * hour;
        if (diff < minute) return "just now";
        if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
        if (diff < day) return `${Math.floor(diff / hour)}h ago`;
        if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
        return new Date(iso).toLocaleDateString();
    } catch {
        return "";
    }
}

interface SongCardProps {
    song: SongEntry;
    onOpen: () => void;
    onTogglePin: () => void;
}

export function SongCard({ song, onOpen, onTogglePin }: SongCardProps) {
    const preview = (song.result.plain_lyrics || song.result.lyrics || "").slice(0, 120);
    const title = song.songTitle || "Untitled";

    return (
        <Card
            variant="outlined"
            sx={{
                position: "relative",
                transition: "box-shadow 150ms, transform 150ms",
                "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-1px)",
                },
            }}
        >
            <CardActionArea onClick={onOpen}>
                <CardContent>
                    <Stack spacing={1}>
                        <Stack
                            spacing={1}
                            sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                        >
                            <Typography variant="subtitle1" noWrap sx={{ flex: 1, pr: 1 }}>
                                {title}
                            </Typography>
                            <Chip
                                label={song.mode === "oneshot" ? "Oneshot" : "Builder"}
                                size="small"
                                variant="outlined"
                            />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            {relativeTime(song.updatedAt || song.createdAt)}
                            {song.updatedAt && " • edited"}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                whiteSpace: "pre-wrap",
                                minHeight: 40,
                            }}
                        >
                            {preview || "—"}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
            <Box sx={{ position: "absolute", top: 4, right: 4 }}>
                <IconButton
                    size="small"
                    aria-label={song.pinned ? "Unpin song" : "Pin song"}
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin();
                    }}
                    color={song.pinned ? "primary" : "default"}
                >
                    {song.pinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                </IconButton>
            </Box>
        </Card>
    );
}
