import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";

// Self-hosted variable font (all axes)
import "@fontsource-variable/roboto-flex";

import "./index.css";
import { App } from "./App";
import { ThemeModeProvider, useThemeMode } from "./theme/ThemeContext";
import { getTheme } from "./theme/theme";

function ThemedApp() {
    const { resolvedMode } = useThemeMode();
    return (
        <ThemeProvider theme={getTheme(resolvedMode)}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeModeProvider>
            <ThemedApp />
        </ThemeModeProvider>
    </StrictMode>,
);
