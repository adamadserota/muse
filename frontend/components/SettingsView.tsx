import { useState } from "react";
import {
    Box,
    Button,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
    FormControlLabel,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useThemeMode, type ThemeMode } from "../theme/ThemeContext";

interface SettingsViewProps {
    apiKey: string;
    onApiKeyChange: (key: string) => void;
    model: string;
    onModelChange: (model: string) => void;
    onRestartTour?: () => void;
    onClearLibrary?: () => void;
    libraryCount?: number;
}

/**
 * Settings tab view. Exposes theme mode, API key, model, library actions,
 * and onboarding restart.
 */
export function SettingsView({
    apiKey,
    onApiKeyChange,
    model,
    onModelChange,
    onRestartTour,
    onClearLibrary,
    libraryCount = 0,
}: SettingsViewProps) {
    const { mode, setMode } = useThemeMode();
    const [showKey, setShowKey] = useState(false);

    return (
        <Box sx={{ p: 3, maxWidth: 560, mx: "auto", overflow: "auto", height: "100%" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Settings
            </Typography>

            <List disablePadding>
                {/* Account */}
                <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "stretch", gap: 1, mb: 2 }}>
                    <ListItemText
                        primary="Gemini API key"
                        secondary={
                            <>
                                Your key stays in your browser.{" "}
                                <Link href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
                                    Get a key
                                </Link>
                            </>
                        }
                        slotProps={{
                            primary: { variant: "subtitle1" },
                            secondary: { component: "span" },
                        }}
                    />
                    <TextField
                        type={showKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => onApiKeyChange(e.target.value)}
                        placeholder="AIza..."
                        fullWidth
                        size="small"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            aria-label={showKey ? "Hide key" : "Show key"}
                                            onClick={() => setShowKey((s) => !s)}
                                        >
                                            {showKey ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </ListItem>

                <Divider sx={{ my: 2 }} />

                {/* Appearance */}
                <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "stretch", gap: 1, mb: 2 }}>
                    <ListItemText
                        primary="Appearance"
                        secondary="Follow your system, or force light or dark."
                        slotProps={{ primary: { variant: "subtitle1" } }}
                    />
                    <RadioGroup
                        row
                        value={mode}
                        onChange={(e) => setMode(e.target.value as ThemeMode)}
                    >
                        <FormControlLabel value="system" control={<Radio />} label="System" />
                        <FormControlLabel value="light" control={<Radio />} label="Light" />
                        <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                    </RadioGroup>
                </ListItem>

                <Divider sx={{ my: 2 }} />

                {/* Model */}
                <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "stretch", gap: 1, mb: 2 }}>
                    <ListItemText
                        primary="Model"
                        secondary="Gemini Pro produces the best results; Flash is faster and cheaper."
                        slotProps={{ primary: { variant: "subtitle1" } }}
                    />
                    <FormControl fullWidth size="small">
                        <InputLabel id="settings-model-label">Model</InputLabel>
                        <Select
                            labelId="settings-model-label"
                            label="Model"
                            value={model}
                            onChange={(e) => onModelChange(e.target.value)}
                        >
                            <MenuItem value="gemini-3.1-pro-preview">Gemini 3.1 Pro</MenuItem>
                            <MenuItem value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash</MenuItem>
                        </Select>
                    </FormControl>
                </ListItem>

                <Divider sx={{ my: 2 }} />

                {/* Library */}
                {onClearLibrary && (
                    <>
                        <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "stretch", gap: 1, mb: 2 }}>
                            <ListItemText
                                primary="Library"
                                secondary={`${libraryCount} song${libraryCount === 1 ? "" : "s"} saved locally in your browser.`}
                                slotProps={{ primary: { variant: "subtitle1" } }}
                            />
                            <Box>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    disabled={libraryCount === 0}
                                    onClick={() => {
                                        if (window.confirm("Delete all songs from the library? This can't be undone.")) {
                                            onClearLibrary();
                                        }
                                    }}
                                >
                                    Clear library
                                </Button>
                            </Box>
                        </ListItem>
                        <Divider sx={{ my: 2 }} />
                    </>
                )}

                {/* Help */}
                {onRestartTour && (
                    <>
                        <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "stretch", gap: 1, mb: 2 }}>
                            <ListItemText
                                primary="Help"
                                secondary="Replay the welcome tour highlighting the main sections."
                                slotProps={{ primary: { variant: "subtitle1" } }}
                            />
                            <Box>
                                <Button variant="outlined" onClick={onRestartTour} size="small">
                                    Restart welcome tour
                                </Button>
                            </Box>
                        </ListItem>
                        <Divider sx={{ my: 2 }} />
                    </>
                )}

                {/* About */}
                <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "stretch", gap: 1 }}>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle1">About</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Muse — your muse, your music.
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
                            Made with Gemini. No server-side keys, no tracking.
                        </Typography>
                    </Stack>
                </ListItem>
            </List>
        </Box>
    );
}
