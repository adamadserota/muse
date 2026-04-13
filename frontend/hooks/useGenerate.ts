import { useState, useCallback, useRef } from "react";
import { generateSong } from "../services/apiClient";
import type {
    TopMode,
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
    step: GenerateStep;
    input: string;
    builderInputs: BuilderInputs;
    result: GenerateResponse | null;
    loading: boolean;
    error: string | null;
    setTopMode: (mode: TopMode) => void;
    setInput: (input: string) => void;
    setBuilderInputs: (inputs: BuilderInputs) => void;
    updateBuilderField: <K extends keyof BuilderInputs>(field: K, value: BuilderInputs[K]) => void;
    updateResult: (patch: Partial<GenerateResponse>) => void;
    generate: (model?: string) => Promise<void>;
    reset: () => void;
}

export function useGenerate(): UseGenerateReturn {
    const [topMode, setTopMode] = useState<TopMode>("oneshot");
    const [step, setStep] = useState<GenerateStep>("input");
    const [input, setInput] = useState("");
    const [builderInputs, setBuilderInputs] = useState<BuilderInputs>(EMPTY_BUILDER);
    const [result, setResult] = useState<GenerateResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const updateBuilderField = useCallback(
        <K extends keyof BuilderInputs>(field: K, value: BuilderInputs[K]) => {
            setBuilderInputs((prev) => ({ ...prev, [field]: value }));
        },
        [],
    );

    const generate = useCallback(
        async (model?: string) => {
            let apiMode: GenerateMode;
            let apiInput: string;

            if (topMode === "oneshot") {
                if (!input.trim()) return;
                apiMode = "theme_oneshot";
                apiInput = input;
            } else {
                if (!hasBuilderContent(builderInputs)) return;
                apiInput = compileBuilderInput(builderInputs);
                apiMode = "builder_oneshot";
            }

            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setLoading(true);
            setError(null);

            try {
                const res = await generateSong({
                    mode: apiMode,
                    input: apiInput,
                    model,
                    signal: controller.signal,
                });
                setResult(res);
                setStep("complete");
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                setError(e instanceof Error ? e.message : "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        },
        [input, topMode, builderInputs],
    );

    const updateResult = useCallback((patch: Partial<GenerateResponse>) => {
        setResult((prev) => {
            if (!prev) return prev;
            // Only merge non-null/undefined values to avoid wiping fields
            const merged = { ...prev };
            for (const [key, value] of Object.entries(patch)) {
                if (value != null) {
                    (merged as Record<string, unknown>)[key] = value;
                }
            }
            return merged;
        });
    }, []);

    const reset = useCallback(() => {
        abortRef.current?.abort();
        setStep("input");
        setInput("");
        setResult(null);
        setError(null);
        // Builder inputs are intentionally preserved so "New Song" keeps them
    }, []);

    return {
        topMode,
        step,
        input,
        builderInputs,
        result,
        loading,
        error,
        setTopMode,
        setInput,
        setBuilderInputs,
        updateBuilderField,
        updateResult,
        generate,
        reset,
    };
}
