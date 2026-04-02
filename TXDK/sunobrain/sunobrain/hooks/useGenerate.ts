import { useState, useCallback } from "react";
import { generateSong } from "../services/apiClient";
import type {
    TopMode,
    FlowType,
    GenerateStep,
    GenerateResponse,
    GenerateMode,
    BuilderInputs,
} from "../types";

const EMPTY_BUILDER: BuilderInputs = {
    inspiration: "",
    genres: [],
    styleInfluences: "",
    lyricInput: "",
    exclusions: "",
};

function compileBuilderInput(inputs: BuilderInputs): string {
    const sections: string[] = [];
    if (inputs.inspiration.trim())
        sections.push(`---INSPIRATION---\n${inputs.inspiration.trim()}`);
    if (inputs.genres.length > 0)
        sections.push(`---GENRES---\n${inputs.genres.join(", ")}`);
    if (inputs.styleInfluences.trim())
        sections.push(`---STYLE_INFLUENCES---\n${inputs.styleInfluences.trim()}`);
    if (inputs.lyricInput.trim())
        sections.push(`---LYRICS_INPUT---\n${inputs.lyricInput.trim()}`);
    if (inputs.exclusions.trim())
        sections.push(`---EXCLUSIONS---\n${inputs.exclusions.trim()}`);
    return sections.join("\n\n");
}

function hasBuilderContent(inputs: BuilderInputs): boolean {
    return (
        inputs.inspiration.trim() !== "" ||
        inputs.genres.length > 0 ||
        inputs.styleInfluences.trim() !== "" ||
        inputs.lyricInput.trim() !== "" ||
        inputs.exclusions.trim() !== ""
    );
}

interface UseGenerateReturn {
    topMode: TopMode;
    flow: FlowType;
    step: GenerateStep;
    input: string;
    builderInputs: BuilderInputs;
    draft: string;
    result: GenerateResponse | null;
    loading: boolean;
    error: string | null;
    setTopMode: (mode: TopMode) => void;
    setFlow: (flow: FlowType) => void;
    setInput: (input: string) => void;
    setBuilderInputs: (inputs: BuilderInputs) => void;
    updateBuilderField: <K extends keyof BuilderInputs>(field: K, value: BuilderInputs[K]) => void;
    setDraft: (draft: string) => void;
    updateResult: (patch: Partial<GenerateResponse>) => void;
    generate: (apiKey: string, model?: string) => Promise<void>;
    optimize: (apiKey: string, model?: string) => Promise<void>;
    reset: () => void;
}

export function useGenerate(): UseGenerateReturn {
    const [topMode, setTopMode] = useState<TopMode>("oneshot");
    const [flow, setFlow] = useState<FlowType>("oneshot");
    const [step, setStep] = useState<GenerateStep>("input");
    const [input, setInput] = useState("");
    const [builderInputs, setBuilderInputs] = useState<BuilderInputs>(EMPTY_BUILDER);
    const [draft, setDraft] = useState("");
    const [result, setResult] = useState<GenerateResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateBuilderField = useCallback(
        <K extends keyof BuilderInputs>(field: K, value: BuilderInputs[K]) => {
            setBuilderInputs((prev) => ({ ...prev, [field]: value }));
        },
        [],
    );

    const generate = useCallback(
        async (apiKey: string, model?: string) => {
            let apiMode: GenerateMode;
            let apiInput: string;

            if (topMode === "oneshot") {
                if (!input.trim()) return;
                apiMode = "theme_oneshot";
                apiInput = input;
            } else {
                if (!hasBuilderContent(builderInputs)) return;
                apiInput = compileBuilderInput(builderInputs);
                apiMode = flow === "oneshot" ? "builder_oneshot" : "builder_draft";
            }

            setLoading(true);
            setError(null);

            try {
                const res = await generateSong({ mode: apiMode, input: apiInput, apiKey, model });

                if (apiMode === "builder_draft") {
                    setDraft(res.lyrics);
                    setStep("draft_review");
                } else {
                    setResult(res);
                    setStep("complete");
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        },
        [input, topMode, flow, builderInputs],
    );

    const optimize = useCallback(
        async (apiKey: string, model?: string) => {
            if (!draft.trim()) return;
            setLoading(true);
            setError(null);

            try {
                const res = await generateSong({
                    mode: "optimize_draft",
                    input: draft,
                    apiKey,
                    model,
                });
                setResult(res);
                setStep("complete");
            } catch (e) {
                setError(e instanceof Error ? e.message : "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        },
        [draft],
    );

    const updateResult = useCallback(
        (patch: Partial<GenerateResponse>) => {
            setResult((prev) => (prev ? { ...prev, ...patch } : prev));
        },
        [],
    );

    const reset = useCallback(() => {
        setStep("input");
        setInput("");
        setDraft("");
        setResult(null);
        setError(null);
        // Builder inputs are intentionally preserved so "Start Over" keeps them
    }, []);

    return {
        topMode,
        flow,
        step,
        input,
        builderInputs,
        draft,
        result,
        loading,
        error,
        setTopMode,
        setFlow,
        setInput,
        setBuilderInputs,
        updateBuilderField,
        setDraft,
        updateResult,
        generate,
        optimize,
        reset,
    };
}
