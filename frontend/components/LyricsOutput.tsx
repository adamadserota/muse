import { memo, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { CollapsibleCard } from "./CollapsibleCard";
import { CopyButton } from "./CopyButton";
import { CharCount } from "./CharCount";

interface LyricsOutputProps {
    value: string;
    onChange?: (newLyrics: string) => void;
    onRegenerate?: () => void;
    regenerating?: boolean;
}

function renderWithTagHighlights(text: string) {
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
            <Box
                component="span"
                key={i}
                sx={{ color: "secondary.main", fontWeight: 600 }}
            >
                {part}
            </Box>
        ) : (
            part
        ),
    );
}

export const LyricsOutput = memo(function LyricsOutput({
    value,
    onChange,
    onRegenerate,
    regenerating,
}: LyricsOutputProps) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const handleEdit = () => {
        setDraft(value);
        setEditing(true);
    };
    const handleSave = () => {
        onChange?.(draft);
        setEditing(false);
    };
    const handleCancel = () => {
        setDraft(value);
        setEditing(false);
    };

    const headerRight = value ? (
        <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center" }}>
            {onRegenerate && !editing && (
                <Button
                    size="small"
                    disabled={regenerating}
                    onClick={onRegenerate}
                    startIcon={
                        regenerating ? (
                            <CircularProgress size={14} color="inherit" />
                        ) : (
                            <RefreshIcon fontSize="small" />
                        )
                    }
                >
                    {regenerating ? "…" : "Regen"}
                </Button>
            )}
            {onChange && !editing && (
                <Button size="small" onClick={handleEdit}>
                    Edit
                </Button>
            )}
            <CopyButton text={value} />
        </Stack>
    ) : undefined;

    return (
        <CollapsibleCard title="Optimized lyrics" headerRight={headerRight}>
            {editing ? (
                <Box>
                    <TextField
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        multiline
                        minRows={10}
                        maxRows={30}
                        fullWidth
                        autoFocus
                        size="small"
                    />
                    <Stack spacing={1} sx={{ flexDirection: "row", mt: 1, justifyContent: "flex-end" }}>
                        <Button size="small" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button size="small" variant="contained" onClick={handleSave}>
                            Save
                        </Button>
                    </Stack>
                </Box>
            ) : (
                <Typography
                    component="div"
                    variant="body2"
                    color="text.primary"
                    sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.75,
                    }}
                >
                    {value ? renderWithTagHighlights(value) : "Optimized lyrics will appear here…"}
                </Typography>
            )}
            {value && !editing && (
                <Box sx={{ mt: 1 }}>
                    <CharCount current={value.length} max={5000} />
                </Box>
            )}
        </CollapsibleCard>
    );
});
