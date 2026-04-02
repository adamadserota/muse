/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FlowToggle } from "./FlowToggle";
import { BuilderSection } from "./BuilderSection";
import { GenreSelector } from "./GenreSelector";
import { SavedStylesDrawer } from "./SavedStylesDrawer";
import type { BuilderInputs, FlowType, GenerateStep, SavedStyle } from "../types";

const containerStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "var(--fui-spacing-3)",
    flex: 1,
    minHeight: 0,
});

const sectionLabel = css({
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "var(--fui-text-muted)",
});

const textareaStyle = css({
    width: "100%",
    minHeight: 80,
    padding: "var(--fui-spacing-2) var(--fui-spacing-3)",
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    lineHeight: 1.6,
    background: "var(--fui-bg-input)",
    border: "1px solid var(--fui-border)",
    color: "var(--fui-text)",
    resize: "vertical",
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

const lyricTextareaStyle = css({
    minHeight: 120,
});

const draftTextareaStyle = css({
    flex: 1,
    minHeight: 200,
    resize: "none",
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

interface BuilderPanelProps {
    builderInputs: BuilderInputs;
    flow: FlowType;
    step: GenerateStep;
    draft: string;
    loading: boolean;
    error: string | null;
    savedStyles: SavedStyle[];
    onBuilderChange: <K extends keyof BuilderInputs>(field: K, value: BuilderInputs[K]) => void;
    onFlowChange: (flow: FlowType) => void;
    onDraftChange: (value: string) => void;
    onGenerate: () => void;
    onOptimize: () => void;
    onReset: () => void;
    onInjectStyle: (styleText: string) => void;
    onRenameStyle: (id: string, newName: string) => string | null;
    onDeleteStyle: (id: string) => void;
}

function hasContent(inputs: BuilderInputs): boolean {
    return (
        inputs.inspiration.trim() !== "" ||
        inputs.genres.length > 0 ||
        inputs.styleInfluences.trim() !== "" ||
        inputs.lyricInput.trim() !== "" ||
        inputs.exclusions.trim() !== ""
    );
}

export function BuilderPanel({
    builderInputs,
    flow,
    step,
    draft,
    loading,
    error,
    savedStyles,
    onBuilderChange,
    onFlowChange,
    onDraftChange,
    onGenerate,
    onOptimize,
    onReset,
    onInjectStyle,
    onRenameStyle,
    onDeleteStyle,
}: BuilderPanelProps) {
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

    if (step === "draft_review") {
        return (
            <div css={containerStyle}>
                <span css={sectionLabel}>Edit Your Draft</span>
                <textarea
                    css={[textareaStyle, draftTextareaStyle]}
                    value={draft}
                    onChange={(e) => onDraftChange(e.target.value)}
                    disabled={loading}
                />
                {loading && <div css={loadingStyle}>Optimizing with Gemini...</div>}
                {error && <div css={errorStyle}>{error}</div>}
                <button
                    css={buttonStyle}
                    onClick={onOptimize}
                    disabled={loading || !draft.trim()}
                >
                    {loading ? "Optimizing..." : "Optimize for Suno"}
                </button>
                <button
                    css={[buttonStyle, secondaryButtonStyle]}
                    onClick={onReset}
                    disabled={loading}
                >
                    Start Over
                </button>
            </div>
        );
    }

    return (
        <div css={containerStyle}>
            <div>
                <span css={sectionLabel}>Generation Flow</span>
                <FlowToggle flow={flow} onChange={onFlowChange} />
            </div>

            {/* Saved Styles — browse & inject previously saved style prompts */}
            <SavedStylesDrawer
                savedStyles={savedStyles}
                onInject={onInjectStyle}
                onRename={onRenameStyle}
                onDelete={onDeleteStyle}
            />

            <BuilderSection
                label="General Inspiration"
                helpText="Mood, vibe, concept or theme — influences all outputs"
            >
                <textarea
                    css={textareaStyle}
                    placeholder="Describe the vibe, mood, concept, or theme..."
                    value={builderInputs.inspiration}
                    onChange={(e) => onBuilderChange("inspiration", e.target.value)}
                    disabled={loading}
                />
            </BuilderSection>

            <BuilderSection
                label="Style Selector"
                helpText="Select genres to influence the style output — multi-select for fusion"
            >
                <GenreSelector
                    selected={builderInputs.genres}
                    onChange={(genres) => onBuilderChange("genres", genres)}
                    disabled={loading}
                />
            </BuilderSection>

            <BuilderSection
                label="Style Influences"
                helpText="Additional style details — vocal type, BPM, instruments, artist references, production preferences"
            >
                <textarea
                    css={textareaStyle}
                    placeholder="e.g., male vocals, 120 BPM, analog synths, reverb-heavy, lo-fi warmth..."
                    value={builderInputs.styleInfluences}
                    onChange={(e) => onBuilderChange("styleInfluences", e.target.value)}
                    disabled={loading}
                />
            </BuilderSection>

            <BuilderSection
                label="Lyric Input"
                helpText="Existing lyrics or ideas — only affects lyrics output, not style"
            >
                <textarea
                    css={[textareaStyle, lyricTextareaStyle]}
                    placeholder={"Paste existing lyrics or lyric ideas...\n\nVerse 1:\nWalking through the city lights..."}
                    value={builderInputs.lyricInput}
                    onChange={(e) => onBuilderChange("lyricInput", e.target.value)}
                    disabled={loading}
                />
            </BuilderSection>

            <BuilderSection
                label="Exclusions"
                helpText="Things to avoid — style elements, words, or vocal types to exclude"
            >
                <textarea
                    css={textareaStyle}
                    placeholder="e.g., no female voices, no autotune, no trap beats, no profanity..."
                    value={builderInputs.exclusions}
                    onChange={(e) => onBuilderChange("exclusions", e.target.value)}
                    disabled={loading}
                />
            </BuilderSection>

            {loading && <div css={loadingStyle}>Generating with Gemini...</div>}
            {error && <div css={errorStyle}>{error}</div>}

            <button
                css={buttonStyle}
                onClick={onGenerate}
                disabled={loading || !hasContent(builderInputs)}
            >
                {loading ? "Generating..." : "Generate"}
            </button>
        </div>
    );
}
