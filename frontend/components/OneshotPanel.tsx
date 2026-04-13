import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";

interface OneshotPanelProps {
    input: string;
    loading: boolean;
    modelName: string;
    onInputChange: (value: string) => void;
    onGenerate: () => void;
}

const MAX_INPUT = 10000;

export function OneshotPanel({
    input,
    loading,
    modelName,
    onInputChange,
    onGenerate,
}: OneshotPanelProps) {
    const disabled = loading || !input.trim();
    const charCount = input.length;

    return (
        <Stack spacing={2}>
            <TextField
                label="Song idea"
                placeholder={
                    "What's the song about?\n\n" +
                    "e.g. A melancholic yet hopeful song about leaving your hometown, " +
                    "with imagery of autumn leaves and empty train stations."
                }
                value={input}
                onChange={(e) => onInputChange(e.target.value.slice(0, MAX_INPUT))}
                multiline
                minRows={6}
                maxRows={14}
                fullWidth
                disabled={loading}
                slotProps={{ htmlInput: { maxLength: MAX_INPUT, "aria-label": "Song input" } }}
                helperText={
                    <Box
                        component="span"
                        sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                        <Typography component="span" variant="caption">
                            Describe a theme, lyrics, vibe, or concept.
                        </Typography>
                        <Typography
                            component="span"
                            variant="caption"
                            color={charCount >= MAX_INPUT ? "error" : "text.secondary"}
                        >
                            {charCount} / {MAX_INPUT}
                        </Typography>
                    </Box>
                }
            />

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
