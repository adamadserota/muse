import { Box, Typography } from "@mui/material";
import { CollapsibleCard } from "./CollapsibleCard";
import { CopyButton } from "./CopyButton";

interface PlainLyricsOutputProps {
    value: string;
}

const SECTION_LABEL_RE = /^(Verse|Chorus|Pre-Chorus|Post-Chorus|Bridge|Intro|Outro)\s*\d*:/;

function renderWithSectionLabels(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
        const isLabel = SECTION_LABEL_RE.test(line.trim());
        return (
            <Box component="span" key={i}>
                {isLabel ? (
                    <Box
                        component="span"
                        sx={{ color: "primary.main", fontWeight: 600 }}
                    >
                        {line}
                    </Box>
                ) : (
                    line
                )}
                {i < lines.length - 1 ? "\n" : ""}
            </Box>
        );
    });
}

export function PlainLyricsOutput({ value }: PlainLyricsOutputProps) {
    return (
        <CollapsibleCard
            title="Plain lyrics"
            headerRight={value ? <CopyButton text={value} /> : undefined}
        >
            <Typography
                component="div"
                variant="body2"
                color="text.secondary"
                sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxHeight: 300,
                    overflow: "auto",
                    lineHeight: 1.7,
                }}
            >
                {value ? renderWithSectionLabels(value) : "Plain lyrics will appear here…"}
            </Typography>
        </CollapsibleCard>
    );
}
