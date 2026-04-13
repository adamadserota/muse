import { memo, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { CollapsibleCard } from "./CollapsibleCard";
import { CopyButton } from "./CopyButton";

interface ExcludeOutputProps {
    value: string;
    onChange?: (newExclude: string) => void;
    onRegenerate?: () => void;
    regenerating?: boolean;
}

export const ExcludeOutput = memo(function ExcludeOutput({
    value,
    onChange,
    onRegenerate,
    regenerating,
}: ExcludeOutputProps) {
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
        <CollapsibleCard title="Excluded styles" headerRight={headerRight}>
            {editing ? (
                <Box>
                    <TextField
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        multiline
                        minRows={3}
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
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                    }}
                >
                    {value || "Exclusions will appear here after generation…"}
                </Typography>
            )}
        </CollapsibleCard>
    );
});
