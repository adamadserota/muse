import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Popover,
    Stack,
    Typography,
} from "@mui/material";

interface TourStep {
    id: string;
    /** CSS selector for the element this step highlights. Null for a centered intro/outro dialog. */
    targetSelector?: string;
    title: string;
    body: string;
}

const STEPS: TourStep[] = [
    {
        id: "welcome",
        title: "Quick tour",
        body: "Three places to find everything in Muse. Tap Next.",
    },
    {
        id: "create",
        targetSelector: '[data-tour="create"]',
        title: "Create",
        body: "Describe a song idea here. Muse turns it into Suno-ready prompts.",
    },
    {
        id: "library",
        targetSelector: '[data-tour="library"]',
        title: "Library",
        body: "Every song you make lives here. Pin favorites to keep them forever.",
    },
    {
        id: "settings",
        targetSelector: '[data-tour="settings"]',
        title: "Settings",
        body: "Theme, model, and your API key — everything you can tweak.",
    },
];

interface GuidedTourProps {
    open: boolean;
    onFinish: () => void;
}

export function GuidedTour({ open, onFinish }: GuidedTourProps) {
    const [idx, setIdx] = useState(0);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const step = STEPS[idx] ?? STEPS[0]!;
    const isLast = idx >= STEPS.length - 1;

    // Resolve the anchor element whenever the step changes
    useEffect(() => {
        if (!open) return;
        if (step.targetSelector) {
            const el = document.querySelector(step.targetSelector);
            setAnchorEl(el);
        } else {
            setAnchorEl(null);
        }
    }, [open, step.targetSelector]);

    // Reset to first step each time the tour opens
    useEffect(() => {
        if (open) setIdx(0);
    }, [open]);

    const next = () => {
        if (isLast) {
            onFinish();
        } else {
            setIdx(idx + 1);
        }
    };

    const skip = () => onFinish();

    if (!open) return null;

    const progressDots = (
        <Stack spacing={0.5} sx={{ flexDirection: "row", justifyContent: "center", mt: 1 }}>
            {STEPS.map((_s, i) => (
                <Box
                    key={i}
                    sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: i === idx ? "primary.main" : "divider",
                        transition: "background-color 200ms",
                    }}
                />
            ))}
        </Stack>
    );

    // Intro step — centered dialog
    if (!step.targetSelector) {
        return (
            <Dialog open maxWidth="xs" fullWidth>
                <DialogTitle>{step.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        {step.body}
                    </Typography>
                    {progressDots}
                </DialogContent>
                <DialogActions>
                    <Button onClick={skip}>Skip tour</Button>
                    <Button onClick={next} variant="contained">
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    // Step with anchor — popover
    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            transformOrigin={{ vertical: "bottom", horizontal: "center" }}
            onClose={skip}
            disableScrollLock
            slotProps={{
                paper: {
                    sx: {
                        maxWidth: 320,
                        p: 2,
                        mb: 1,
                    },
                },
            }}
        >
            <Stack spacing={1.5}>
                <Typography variant="subtitle1">{step.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {step.body}
                </Typography>
                {progressDots}
                <Stack spacing={1} sx={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <Button size="small" onClick={skip}>
                        Skip
                    </Button>
                    <Button size="small" variant="contained" onClick={next}>
                        {isLast ? "Done" : "Next"}
                    </Button>
                </Stack>
            </Stack>
        </Popover>
    );
}
