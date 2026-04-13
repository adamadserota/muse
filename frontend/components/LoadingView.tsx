import { useEffect, useState } from "react";
import { Box, CircularProgress, Fade, Stack, Typography } from "@mui/material";

const MESSAGES = [
    "Composing lyrics…",
    "Choosing a style…",
    "Tuning for Suno…",
    "Adding the finishing touches…",
];

interface LoadingViewProps {
    modelName?: string;
}

/**
 * Full-viewport loading state shown while a generation request is in-flight.
 * Cycles through evocative status messages every ~2.5s using a cross-fade.
 */
export function LoadingView({ modelName }: LoadingViewProps) {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const id = window.setInterval(() => {
            setMessageIndex((i) => (i + 1) % MESSAGES.length);
        }, 2500);
        return () => window.clearInterval(id);
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
            }}
        >
            <Stack spacing={4} sx={{ alignItems: "center" }}>
                <CircularProgress size={64} thickness={3.6} color="primary" />
                <Box sx={{ minHeight: 24, textAlign: "center" }}>
                    <Fade in key={messageIndex} timeout={{ enter: 400, exit: 200 }}>
                        <Typography variant="body1" color="text.secondary">
                            {MESSAGES[messageIndex]}
                        </Typography>
                    </Fade>
                </Box>
                {modelName && (
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
                        via {modelName}
                    </Typography>
                )}
            </Stack>
        </Box>
    );
}
