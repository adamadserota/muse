import { useState, type ReactNode } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface CollapsibleCardProps {
    title: string;
    defaultOpen?: boolean;
    headerRight?: ReactNode;
    children: ReactNode;
}

/**
 * Outlined MUI Accordion used by all output sections to keep a consistent look.
 * (Note: `titleColor` from the legacy API is dropped — colors come from the theme.)
 */
export function CollapsibleCard({ title, defaultOpen = true, headerRight, children }: CollapsibleCardProps) {
    const [expanded, setExpanded] = useState(defaultOpen);

    return (
        <Accordion
            expanded={expanded}
            onChange={(_e, v) => setExpanded(v)}
            disableGutters
            variant="outlined"
            sx={{
                "&:before": { display: "none" },
                bgcolor: "background.paper",
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                    variant="overline"
                    color="text.primary"
                    sx={{ flex: 1, letterSpacing: "0.1em" }}
                >
                    {title}
                </Typography>
                {headerRight && (
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{ mr: 1, display: "flex", alignItems: "center", gap: 1 }}
                    >
                        {headerRight}
                    </Box>
                )}
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
}
