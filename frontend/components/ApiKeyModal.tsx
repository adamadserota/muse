import { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    Link,
    TextField,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

interface ApiKeyModalProps {
    open: boolean;
    /** Called when the user saves a non-empty key. */
    onSave: (key: string) => void;
}

/**
 * First-launch (and re-prompt) modal that collects the user's Gemini API key.
 * Cannot be dismissed without entering a key — the app is not usable without one.
 */
export function ApiKeyModal({ open, onSave }: ApiKeyModalProps) {
    const [key, setKey] = useState("");
    const [show, setShow] = useState(false);

    const handleSave = () => {
        const trimmed = key.trim();
        if (!trimmed) return;
        onSave(trimmed);
    };

    return (
        <Dialog
            open={open}
            maxWidth="xs"
            fullWidth
            onClose={(_e, reason) => {
                // Block both backdrop and escape-key dismiss; only explicit Save closes this dialog.
                if (reason === "backdropClick" || reason === "escapeKeyDown") return;
            }}
        >
            <DialogTitle>Add your Gemini API key</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Muse runs on Google's Gemini. Your key stays in your browser — never sent anywhere except Google.
                    {" "}
                    <Link
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                        rel="noreferrer"
                        underline="always"
                    >
                        Get a free key
                    </Link>
                    .
                </DialogContentText>
                <TextField
                    autoFocus
                    type={show ? "text" : "password"}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="AIzaSy..."
                    fullWidth
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                    }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setShow((s) => !s)}
                                        aria-label={show ? "Hide key" : "Show key"}
                                    >
                                        {show ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleSave} disabled={!key.trim()} variant="contained">
                    Save key
                </Button>
            </DialogActions>
        </Dialog>
    );
}
