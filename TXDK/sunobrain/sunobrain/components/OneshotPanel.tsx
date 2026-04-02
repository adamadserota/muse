/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { GenerateStep } from "../types";

const containerStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "var(--fui-spacing-3)",
    flex: 1,
    minHeight: 0,
});

const textareaStyle = css({
    width: "100%",
    flex: 1,
    minHeight: 200,
    padding: "var(--fui-spacing-3)",
    fontFamily: "var(--fui-font)",
    fontSize: "14px",
    lineHeight: 1.7,
    background: "var(--fui-bg-input)",
    border: "1px solid var(--fui-border)",
    color: "var(--fui-text)",
    resize: "none",
    outline: "none",
    transition: "border-color 0.15s ease",
    "&:focus": {
        borderColor: "var(--fui-primary-100)",
        boxShadow: "var(--fui-glow-input)",
    },
    "&::placeholder": {
        color: "var(--fui-text-muted)",
    },
});

const buttonStyle = css({
    width: "100%",
    padding: "14px 24px",
    fontFamily: "var(--fui-font)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid var(--fui-primary-100)",
    background: "var(--fui-primary-20)",
    color: "var(--fui-primary-100)",
    transition: "all 0.15s ease",
    "&:hover:not(:disabled)": {
        background: "var(--fui-primary-40)",
        boxShadow: "var(--fui-glow-primary)",
    },
    "&:disabled": {
        opacity: 0.4,
        cursor: "not-allowed",
    },
});

const secondaryButtonStyle = css({
    borderColor: "var(--fui-text-muted)",
    background: "transparent",
    color: "var(--fui-text-dim)",
    "&:hover:not(:disabled)": {
        background: "var(--fui-bg-hover)",
        borderColor: "var(--fui-text)",
        boxShadow: "none",
    },
});

const loadingStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "var(--fui-spacing-2)",
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    color: "var(--fui-primary-80)",
    padding: "var(--fui-spacing-3)",
    border: "1px solid var(--fui-primary-20)",
    background: "var(--fui-primary-5)",
    "@keyframes pulse": {
        "0%, 100%": { opacity: 0.4 },
        "50%": { opacity: 1 },
    },
    animation: "pulse 1.5s ease-in-out infinite",
});

const errorStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    color: "var(--fui-error-100)",
    padding: "var(--fui-spacing-2) var(--fui-spacing-3)",
    border: "1px solid var(--fui-error-100)",
    background: "rgba(255, 51, 51, 0.08)",
});

const completeStyle = css({
    padding: "var(--fui-spacing-3)",
    border: "1px solid var(--fui-primary-40)",
    background: "var(--fui-primary-5)",
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    color: "var(--fui-primary-80)",
});

interface OneshotPanelProps {
    input: string;
    step: GenerateStep;
    loading: boolean;
    error: string | null;
    onInputChange: (value: string) => void;
    onGenerate: () => void;
    onReset: () => void;
}

export function OneshotPanel({
    input,
    step,
    loading,
    error,
    onInputChange,
    onGenerate,
    onReset,
}: OneshotPanelProps) {
    if (step === "complete") {
        return (
            <div css={containerStyle}>
                <div css={completeStyle}>
                    Generation complete. Copy the outputs on the right and paste into Suno v5.5.
                </div>
                <button css={[buttonStyle, secondaryButtonStyle]} onClick={onReset}>
                    New Song
                </button>
            </div>
        );
    }

    return (
        <div css={containerStyle}>
            <textarea
                css={textareaStyle}
                placeholder={
                    "Enter anything \u2014 a theme, lyrics, a URL, a single word, a concept...\n\n" +
                    "e.g., A melancholic yet hopeful song about leaving your hometown, " +
                    "with imagery of autumn leaves and empty train stations..."
                }
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                disabled={loading}
            />
            {loading && <div css={loadingStyle}>Generating with Gemini...</div>}
            {error && <div css={errorStyle}>{error}</div>}
            <button
                css={buttonStyle}
                onClick={onGenerate}
                disabled={loading || !input.trim()}
            >
                {loading ? "Generating..." : "Generate"}
            </button>
        </div>
    );
}
