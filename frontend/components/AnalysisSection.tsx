import { memo } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { CollapsibleCard } from "./CollapsibleCard";
import type { AnalysisOutput } from "../types";

interface AnalysisSectionProps {
    analysis: AnalysisOutput;
    onRegenerate?: () => void;
    regenerating?: boolean;
}

interface FieldProps {
    label: string;
    value: string;
}

function Field({ label, value }: FieldProps) {
    if (!value) return null;
    return (
        <Stack spacing={0.5}>
            <Typography variant="overline" color="text.secondary">
                {label}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
            >
                {value}
            </Typography>
        </Stack>
    );
}

export const AnalysisSection = memo(function AnalysisSection({
    analysis,
    onRegenerate,
    regenerating,
}: AnalysisSectionProps) {
    const hasContent =
        analysis.vibe_dna || analysis.phonetic_mapping || analysis.semantic_weight;
    if (!hasContent) return null;

    const headerRight = onRegenerate ? (
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
    ) : undefined;

    return (
        <CollapsibleCard title="Analysis" headerRight={headerRight}>
            <Stack spacing={2}>
                <Field label="Vibe DNA" value={analysis.vibe_dna} />
                <Field label="Phonetic mapping" value={analysis.phonetic_mapping} />
                <Field label="Semantic weight" value={analysis.semantic_weight} />
            </Stack>
        </CollapsibleCard>
    );
});
