import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import type { BuilderInputs, SavedStyle } from "../types";

const BEGINNER_GENRES = [
    "Pop",
    "Rock",
    "Hip-Hop",
    "Electronic",
    "Folk",
    "R&B",
    "Country",
    "Jazz",
    "Classical",
    "Metal",
    "Indie",
    "Ambient",
];

interface BuilderPanelProps {
    builderInputs: BuilderInputs;
    loading: boolean;
    modelName: string;
    savedStyles: SavedStyle[];
    onBuilderChange: <K extends keyof BuilderInputs>(field: K, value: BuilderInputs[K]) => void;
    onGenerate: () => void;
    onInjectStyle: (styleText: string) => void;
    onRenameStyle: (id: string, newName: string) => string | null;
    onDeleteStyle: (id: string) => void;
}

function hasContent(inputs: BuilderInputs): boolean {
    return (
        inputs.inspiration.trim() !== "" ||
        inputs.genres.length > 0 ||
        inputs.styleInfluences.trim() !== "" ||
        inputs.lyricInput.trim() !== "" ||
        inputs.exclusions.trim() !== ""
    );
}

/**
 * Builder mode — Simple (Song Idea + Genre) with Advanced accordion
 * (Inspired By, Your Lyrics, Avoid).
 */
export function BuilderPanel({
    builderInputs,
    loading,
    modelName,
    onBuilderChange,
    onGenerate,
}: BuilderPanelProps) {
    const disabled = loading || !hasContent(builderInputs);

    const toggleGenre = (genre: string) => {
        const selected = builderInputs.genres.includes(genre);
        const next = selected
            ? builderInputs.genres.filter((g) => g !== genre)
            : [...builderInputs.genres, genre];
        onBuilderChange("genres", next);
    };

    return (
        <Stack spacing={3}>
            {/* Simple — Song Idea */}
            <TextField
                label="Song idea"
                placeholder="A bittersweet summer memory at the beach…"
                value={builderInputs.inspiration}
                onChange={(e) => onBuilderChange("inspiration", e.target.value)}
                multiline
                minRows={3}
                maxRows={10}
                fullWidth
                disabled={loading}
                helperText="What is the song about? Mood, vibe, concept, or story."
            />

            {/* Simple — Genre */}
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Genre
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {BEGINNER_GENRES.map((genre) => {
                        const selected = builderInputs.genres.includes(genre);
                        return (
                            <Chip
                                key={genre}
                                label={genre}
                                onClick={() => toggleGenre(genre)}
                                color={selected ? "primary" : "default"}
                                variant={selected ? "filled" : "outlined"}
                                disabled={loading}
                                clickable
                            />
                        );
                    })}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    Pick one or mix several — Muse blends them.
                </Typography>
            </Box>

            {/* Advanced */}
            <Accordion
                disableGutters
                elevation={0}
                sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    "&:before": { display: "none" },
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="builder-advanced-content"
                    id="builder-advanced-header"
                >
                    <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center" }}>
                        <TuneOutlinedIcon fontSize="small" color="action" />
                        <Typography variant="subtitle2">Advanced options</Typography>
                        <Typography variant="caption" color="text.secondary">
                            optional
                        </Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2}>
                        <TextField
                            label="Inspired by"
                            placeholder="Taylor Swift, Phoebe Bridgers, late-90s Radiohead…"
                            value={builderInputs.styleInfluences}
                            onChange={(e) => onBuilderChange("styleInfluences", e.target.value)}
                            multiline
                            minRows={2}
                            fullWidth
                            disabled={loading}
                            helperText="Artists, sounds, or specific production tricks to channel."
                        />
                        <TextField
                            label="Your lyrics"
                            placeholder={"Got a verse already? Paste it here.\n\nVerse 1:\n…"}
                            value={builderInputs.lyricInput}
                            onChange={(e) => onBuilderChange("lyricInput", e.target.value)}
                            multiline
                            minRows={3}
                            maxRows={14}
                            fullWidth
                            disabled={loading}
                            helperText="If provided, Muse will refine these instead of writing from scratch."
                        />
                        <TextField
                            label="Avoid"
                            placeholder="Rap breaks, distorted vocals, auto-tune…"
                            value={builderInputs.exclusions}
                            onChange={(e) => onBuilderChange("exclusions", e.target.value)}
                            multiline
                            minRows={2}
                            fullWidth
                            disabled={loading}
                            helperText="Things you don't want in the output."
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>

            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={onGenerate}
                disabled={disabled}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{ minHeight: 52 }}
                aria-label={loading ? `Generating with ${modelName}` : "Generate song"}
            >
                {loading ? "Generating…" : "Generate"}
            </Button>
        </Stack>
    );
}
