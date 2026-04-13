import { Box, Stack } from "@mui/material";
import { TopModeToggle } from "./TopModeToggle";
import { OneshotPanel } from "./OneshotPanel";
import { BuilderPanel } from "./BuilderPanel";
import type { TopMode, BuilderInputs, SavedStyle } from "../types";

interface InputPanelProps {
    topMode: TopMode;
    input: string;
    builderInputs: BuilderInputs;
    loading: boolean;
    modelName: string;
    savedStyles: SavedStyle[];
    onTopModeChange: (mode: TopMode) => void;
    onInputChange: (value: string) => void;
    onBuilderChange: <K extends keyof BuilderInputs>(field: K, value: BuilderInputs[K]) => void;
    onGenerate: () => void;
    onInjectStyle: (styleText: string) => void;
    onRenameStyle: (id: string, newName: string) => string | null;
    onDeleteStyle: (id: string) => void;
}

export function InputPanel({
    topMode,
    input,
    builderInputs,
    loading,
    modelName,
    savedStyles,
    onTopModeChange,
    onInputChange,
    onBuilderChange,
    onGenerate,
    onInjectStyle,
    onRenameStyle,
    onDeleteStyle,
}: InputPanelProps) {
    return (
        <Box sx={{ height: "100%", overflow: "auto", p: { xs: 2, sm: 3 } }}>
            <Stack spacing={3} sx={{ maxWidth: 720, mx: "auto" }}>
                <TopModeToggle topMode={topMode} onChange={onTopModeChange} />

                {topMode === "oneshot" ? (
                    <OneshotPanel
                        input={input}
                        loading={loading}
                        modelName={modelName}
                        onInputChange={onInputChange}
                        onGenerate={onGenerate}
                    />
                ) : (
                    <BuilderPanel
                        builderInputs={builderInputs}
                        loading={loading}
                        modelName={modelName}
                        savedStyles={savedStyles}
                        onBuilderChange={onBuilderChange}
                        onGenerate={onGenerate}
                        onInjectStyle={onInjectStyle}
                        onRenameStyle={onRenameStyle}
                        onDeleteStyle={onDeleteStyle}
                    />
                )}
            </Stack>
        </Box>
    );
}
