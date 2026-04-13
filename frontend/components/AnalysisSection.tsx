/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { memo } from "react";
import { CollapsibleCard } from "./CollapsibleCard";
import type { AnalysisOutput } from "../types";

const regenBtnStyle = css({
    padding: "4px 10px",
    fontFamily: "var(--fui-font)",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid var(--fui-primary-60)",
    background: "var(--fui-primary-10)",
    color: "var(--fui-primary-100)",
    transition: "all 0.15s ease",
    "&:hover:not(:disabled)": {
        background: "var(--fui-primary-20)",
        boxShadow: "var(--fui-glow-primary)",
    },
    "&:disabled": {
        opacity: 0.4,
        cursor: "not-allowed",
    },
});

const regenLoadingStyle = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--fui-spacing-3)",
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    color: "var(--fui-primary-80)",
    border: "1px solid var(--fui-primary-20)",
    background: "var(--fui-primary-5)",
    "@keyframes pulse": {
        "0%, 100%": { opacity: 0.4 },
        "50%": { opacity: 1 },
    },
    animation: "pulse 1.5s ease-in-out infinite",
});

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
    onRegenerate?: () => void;
    regenerating?: boolean;
}

export const AnalysisSection = memo(function AnalysisSection({ analysis, onRegenerate, regenerating }: AnalysisSectionProps) {
    const hasContent = analysis.vibe_dna || analysis.phonetic_mapping || analysis.semantic_weight;

    if (!hasContent) return null;

    const headerRight = onRegenerate && !regenerating ? (
        <button css={regenBtnStyle} onClick={onRegenerate}>{"\u21BB"} Regen</button>
    ) : undefined;

    return (
        <CollapsibleCard title="Analysis" titleColor="var(--fui-text-muted)" headerRight={headerRight}>
            {regenerating && (
                <div css={regenLoadingStyle}>Regenerating analysis...</div>
            )}
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
});
