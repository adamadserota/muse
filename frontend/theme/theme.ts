import { createTheme, type Theme } from "@mui/material/styles";

/**
 * Material Design 3 theme factory for Muse.
 *
 * Seed-derived cyan/teal palette preserves continuity with the legacy brand.
 * Uses MUI's createTheme; the rest of the M3 surface/on-surface tokens are
 * auto-derived from the primary/secondary values.
 */

const typography = {
    fontFamily: '"Roboto Flex Variable", "Roboto Flex", "Roboto", system-ui, -apple-system, sans-serif',
    // M3 display / headline / title / body / label scale (approximated via MUI variants)
    h1: { fontSize: "3.5rem", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.015em" },
    h2: { fontSize: "2.8rem", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.01em" },
    h3: { fontSize: "2.25rem", fontWeight: 400, lineHeight: 1.2 },
    h4: { fontSize: "2rem", fontWeight: 400, lineHeight: 1.25 },
    h5: { fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.3 },
    h6: { fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.35 },
    subtitle1: { fontSize: "1rem", fontWeight: 500, letterSpacing: "0.01em" },
    subtitle2: { fontSize: "0.875rem", fontWeight: 500, letterSpacing: "0.01em" },
    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5 },
    button: { fontWeight: 500, letterSpacing: "0.05em", textTransform: "none" as const },
    caption: { fontSize: "0.75rem", fontWeight: 400, letterSpacing: "0.04em" },
    overline: { fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const },
};

const shape = { borderRadius: 12 } as const;

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#00696F",          // M3 primary (cyan-teal, dark enough for light mode)
            light: "#52D7DE",
            dark: "#004F54",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#4A6365",
            light: "#B1CCCE",
            dark: "#324B4D",
            contrastText: "#FFFFFF",
        },
        error: { main: "#BA1A1A" },
        warning: { main: "#BB6A00" },
        background: {
            default: "#F5FAFA",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#171D1E",
            secondary: "#3F484A",
        },
        divider: "#BEC8CA",
    },
    typography,
    shape,
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#52D7DE",          // M3 primary (bright cyan, for dark mode)
            light: "#7DEBF0",
            dark: "#004F54",
            contrastText: "#003739",
        },
        secondary: {
            main: "#B1CCCE",
            light: "#CDE8EA",
            dark: "#324B4D",
            contrastText: "#1B3436",
        },
        error: { main: "#FFB4AB" },
        warning: { main: "#FFB95C" },
        background: {
            default: "#0E1415",
            paper: "#171D1E",
        },
        text: {
            primary: "#DDE4E5",
            secondary: "#BEC8CA",
        },
        divider: "#3F484A",
    },
    typography,
    shape,
});

/** Return the right MUI theme for the resolved mode. */
export function getTheme(mode: "light" | "dark"): Theme {
    return mode === "dark" ? darkTheme : lightTheme;
}
