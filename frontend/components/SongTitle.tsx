import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { CollapsibleCard } from "./CollapsibleCard";
import { CopyButton } from "./CopyButton";

interface SongTitleProps {
    value: string;
    onChange?: (newTitle: string) => void;
}

export function SongTitle({ value, onChange }: SongTitleProps) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    if (!value) return null;

    const handleEdit = () => {
        setDraft(value);
        setEditing(true);
    };
    const handleSave = () => {
        const trimmed = draft.trim();
        if (trimmed && onChange) onChange(trimmed);
        setEditing(false);
    };
    const handleCancel = () => {
        setDraft(value);
        setEditing(false);
    };

    const headerRight = (
        <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center" }}>
            {onChange && !editing && (
                <Button size="small" onClick={handleEdit}>
                    Edit
                </Button>
            )}
            <CopyButton text={value} />
        </Stack>
    );

    return (
        <CollapsibleCard title="Song title" headerRight={headerRight}>
            {editing ? (
                <Box>
                    <TextField
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") handleCancel();
                        }}
                        autoFocus
                        fullWidth
                        size="small"
                    />
                    <Stack
                        spacing={1}
                        sx={{ flexDirection: "row", mt: 1, justifyContent: "flex-end" }}
                    >
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
                    variant="h5"
                    color="primary.main"
                    sx={{ fontWeight: 600, letterSpacing: "0.04em" }}
                >
                    {value}
                </Typography>
            )}
        </CollapsibleCard>
    );
}
