export type TopMode = "oneshot" | "builder";
export type GenerateMode =
    | "lyrics"
    | "theme_oneshot"
    | "builder_oneshot";
export type GenerateStep = "input" | "complete";
export type RegenerableSection = "styles" | "exclude_styles" | "lyrics" | "analysis";

export interface BuilderInputs {
    inspiration: string;
    genres: string[];
    styleInfluences: string;
    lyricInput: string;
    exclusions: string;
}

export interface SavedStyle {
    id: string;
    name: string;
    styleText: string;
    excludeStyles: string;
    genres: string[];
    charCount: number;
    createdAt: string;
}

export interface AnalysisOutput {
    vibe_dna: string;
    phonetic_mapping: string;
    semantic_weight: string;
}

export interface GenerateResponse {
    styles: string;
    exclude_styles: string;
    lyrics: string;
    plain_lyrics: string;
    analysis: AnalysisOutput;
}

export interface AlbumCoverResponse {
    image_base64: string;
    mime_type: string;
}

export interface SongEntry {
    id: string;
    mode: TopMode;
    /** Raw oneshot input (when mode === 'oneshot'). */
    oneshotInput?: string;
    /** Builder form values (when mode === 'builder'). */
    builderInputs?: BuilderInputs;
    /** Full generated blueprint (lyrics, styles, exclude_styles, analysis). */
    result: GenerateResponse;
    /** Best-effort song title extracted from the lyrics metatag. */
    songTitle?: string;
    /** True if the user has pinned this song (promotes out of the rolling 10). */
    pinned: boolean;
    /** ISO timestamp of initial creation. */
    createdAt: string;
    /** ISO timestamp of last modification (edit or section regenerate). */
    updatedAt?: string;
}

const MODEL_DISPLAY_NAMES: Record<string, string> = {
    "gemini-3.1-pro-preview": "Gemini 3.1 Pro",
    "gemini-3.1-flash-lite-preview": "Gemini 3.1 Flash",
};

export function getModelDisplayName(modelId: string): string {
    return MODEL_DISPLAY_NAMES[modelId] || modelId;
}

export interface GenerateState {
    topMode: TopMode;
    step: GenerateStep;
    input: string;
    builderInputs: BuilderInputs;
    result: GenerateResponse | null;
    loading: boolean;
    error: string | null;
}
