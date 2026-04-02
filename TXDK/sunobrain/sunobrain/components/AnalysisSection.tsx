/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CollapsibleCard } from "./CollapsibleCard";
import type { AnalysisOutput } from "../types";

const bodyStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "var(--fui-spacing-3)",
});

const fieldStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "var(--fui-spacing-1)",
});

const labelStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "var(--fui-secondary-100)",
});

const valueStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    lineHeight: 1.6,
    color: "var(--fui-text-dim)",
    whiteSpace: "pre-wrap",
});

interface AnalysisSectionProps {
    analysis: AnalysisOutput;
}

export function AnalysisSection({ analysis }: AnalysisSectionProps) {
    const hasContent = analysis.vibe_dna || analysis.phonetic_mapping || analysis.semantic_weight;

    if (!hasContent) return null;

    return (
        <CollapsibleCard title="Analysis" titleColor="var(--fui-text-muted)">
            <div css={bodyStyle}>
                {analysis.vibe_dna && (
                    <div css={fieldStyle}>
                        <span css={labelStyle}>Vibe DNA</span>
                        <div css={valueStyle}>{analysis.vibe_dna}</div>
                    </div>
                )}
                {analysis.phonetic_mapping && (
                    <div css={fieldStyle}>
                        <span css={labelStyle}>Phonetic Mapping</span>
                        <div css={valueStyle}>{analysis.phonetic_mapping}</div>
                    </div>
                )}
                {analysis.semantic_weight && (
                    <div css={fieldStyle}>
                        <span css={labelStyle}>Semantic Weight</span>
                        <div css={valueStyle}>{analysis.semantic_weight}</div>
                    </div>
                )}
            </div>
        </CollapsibleCard>
    );
}
