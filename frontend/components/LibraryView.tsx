import { Box, Grow, Stack, Typography } from "@mui/material";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import { SongCard } from "./SongCard";
import type { SongEntry } from "../types";

interface LibraryViewProps {
    recent: SongEntry[];
    pinned: SongEntry[];
    onOpen: (id: string) => void;
    onTogglePin: (id: string) => void;
}

interface SectionProps {
    title: string;
    songs: SongEntry[];
    onOpen: (id: string) => void;
    onTogglePin: (id: string) => void;
}

function Section({ title, songs, onOpen, onTogglePin }: SectionProps) {
    if (songs.length === 0) return null;
    return (
        <Box>
            <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                {title}
            </Typography>
            <Stack spacing={1.5}>
                {songs.map((song) => (
                    <SongCard
                        key={song.id}
                        song={song}
                        onOpen={() => onOpen(song.id)}
                        onTogglePin={() => onTogglePin(song.id)}
                    />
                ))}
            </Stack>
        </Box>
    );
}

export function LibraryView({ recent, pinned, onOpen, onTogglePin }: LibraryViewProps) {
    const isEmpty = recent.length === 0 && pinned.length === 0;

    if (isEmpty) {
        return (
            <Grow in timeout={400}>
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 4,
                    }}
                >
                    <Stack spacing={2} sx={{ alignItems: "center", maxWidth: 400, textAlign: "center" }}>
                        <LibraryMusicOutlinedIcon
                            sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }}
                        />
                        <Typography variant="h5" color="text.primary">
                            No songs yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Songs you create will appear here. Tap the Create tab to make your first one.
                        </Typography>
                    </Stack>
                </Box>
            </Grow>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, overflow: "auto", height: "100%" }}>
            <Stack spacing={4} sx={{ maxWidth: 720, mx: "auto" }}>
                <Section title="Pinned" songs={pinned} onOpen={onOpen} onTogglePin={onTogglePin} />
                <Section title="Recent" songs={recent} onOpen={onOpen} onTogglePin={onTogglePin} />
            </Stack>
        </Box>
    );
}
