/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { TopModeToggle } from "./TopModeToggle";
import { OneshotPanel } from "./OneshotPanel";
import { BuilderPanel } from "./BuilderPanel";
import type { TopMode, FlowType, GenerateStep, BuilderInputs, SavedStyle } from "../types";

const panelStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "var(--fui-spacing-3)",
    padding: "var(--fui-spacing-3)",
    height: "100%",
    overflow: "auto",
});

interface InputPanelProps {
    topMode: TopMode;
    flow: FlowType;
    step: GenerateStep;
    input: string;
    builderInputs: BuilderInputs;
    draft: string;
    loading: boolean;
    error: string | null;
    savedStyles: SavedStyle[];
    onTopModeChange: (mode: TopMode) => void;
    onFlowChange: (flow: FlowType) => void;
    onInputChange: (value: string) => void;
    onBuilderChange: <K extends keyof BuilderInputs>(field: K, value: BuilderInputs[K]) => void;
    onDraftChange: (value: string) => void;
    onGenerate: () => void;
    onOptimize: () => void;
    onReset: () => void;
    onInjectStyle: (styleText: string) => void;
    onRenameStyle: (id: string, newName: string) => string | null;
    onDeleteStyle: (id: string) => void;
}

export function InputPanel({
    topMode,
    flow,
    step,
    input,
    builderInputs,
    draft,
    loading,
    error,
    savedStyles,
    onTopModeChange,
    onFlowChange,
    onInputChange,
    onBuilderChange,
    onDraftChange,
    onGenerate,
    onOptimize,
    onReset,
    onInjectStyle,
    onRenameStyle,
    onDeleteStyle,
}: InputPanelProps) {
    return (
        <div css={panelStyle}>
            <TopModeToggle topMode={topMode} onChange={onTopModeChange} />

            {topMode === "oneshot" ? (
                <OneshotPanel
                    input={input}
                    step={step}
                    loading={loading}
                    error={error}
                    onInputChange={onInputChange}
                    onGenerate={onGenerate}
                    onReset={onReset}
                />
            ) : (
                <BuilderPanel
                    builderInputs={builderInputs}
                    flow={flow}
                    step={step}
                    draft={draft}
                    loading={loading}
                    error={error}
                    savedStyles={savedStyles}
                    onBuilderChange={onBuilderChange}
                    onFlowChange={onFlowChange}
                    onDraftChange={onDraftChange}
                    onGenerate={onGenerate}
                    onOptimize={onOptimize}
                    onReset={onReset}
                    onInjectStyle={onInjectStyle}
                    onRenameStyle={onRenameStyle}
                    onDeleteStyle={onDeleteStyle}
                />
            )}
        </div>
    );
}
