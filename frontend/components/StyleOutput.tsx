import { memo, useState } from "react";
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import { CollapsibleCard } from "./CollapsibleCard";
import { CopyButton } from "./CopyButton";
import { CharCount } from "./CharCount";
import type { SaveStyleParams } from "../hooks/useSavedStyles";

interface StyleOutputProps {
    value: string;
    excludeStyles?: string;
    genres?: string[];
    onChange?: (newStyles: string) => void;
    onSaveStyle?: (params: SaveStyleParams) => string | null;
    onRegenerate?: () => void;
    regenerating?: boolean;
}

export const StyleOutput = memo(function StyleOutput({
    value,
    excludeStyles,
    genres,
    onChange,
    onSaveStyle,
    onRegenerate,
    regenerating,
}: StyleOutputProps) {
    const [saving, setSaving] = useState(false);
    const [styleName, setStyleName] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [editDraft, setEditDraft] = useState(value);

    const handleSaveToLibrary = () => {
        if (!styleName.trim() || !value) return;
        const error = onSaveStyle?.({
            name: styleName.trim(),
            styleText: value,
            excludeStyles: excludeStyles || "",
            genres: genres || [],
        });
        if (error) {
            setValidationError(error);
            return;
        }
        setSaving(false);
        setStyleName("");
        setValidationError(null);
    };
    const handleCancelSave = () => {
        setSaving(false);
        setStyleName("");
        setValidationError(null);
    };
    const handleEdit = () => {
        setEditDraft(value);
        setEditing(true);
    };
    const handleEditSave = () => {
        onChange?.(editDraft);
        setEditing(false);
    };
    const handleEditCancel = () => {
        setEditDraft(value);
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
            {onSaveStyle && !editing && !saving && (
                <Button
                    size="small"
                    color="secondary"
                    onClick={() => setSaving(true)}
                    startIcon={<BookmarkAddOutlinedIcon fontSize="small" />}
                >
                    Save
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
        <CollapsibleCard title="Style prompt" headerRight={headerRight}>
            {saving && !editing && (
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center" }}>
                        <TextField
                            placeholder="Style name (must be unique)…"
                            value={styleName}
                            onChange={(e) => {
                                setStyleName(e.target.value);
                                setValidationError(null);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveToLibrary()}
                            autoFocus
                            fullWidth
                            size="small"
                        />
                        <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={handleSaveToLibrary}
                            disabled={!styleName.trim()}
                        >
                            Save
                        </Button>
                        <Button size="small" onClick={handleCancelSave}>
                            Cancel
                        </Button>
                    </Stack>
                    {validationError && (
                        <Alert severity="error" variant="outlined">
                            {validationError}
                        </Alert>
                    )}
                </Stack>
            )}

            {editing ? (
                <Box>
                    <TextField
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        multiline
                        minRows={5}
                        fullWidth
                        autoFocus
                        size="small"
                    />
                    <Stack spacing={1} sx={{ flexDirection: "row", mt: 1, justifyContent: "flex-end" }}>
                        <Button size="small" onClick={handleEditCancel}>
                            Cancel
                        </Button>
                        <Button size="small" variant="contained" onClick={handleEditSave}>
                            Save
                        </Button>
                    </Stack>
                </Box>
            ) : (
                <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                    }}
                >
                    {value || "Generate a song to see the style prompt…"}
                </Typography>
            )}

            {value && !editing && (
                <Box sx={{ mt: 1 }}>
                    <CharCount current={value.length} max={1000} />
                </Box>
            )}
        </CollapsibleCard>
    );
});
