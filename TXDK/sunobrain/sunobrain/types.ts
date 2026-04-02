export type TopMode = "oneshot" | "builder";
export type FlowType = "oneshot" | "twostep";
export type GenerateMode =
    | "lyrics"
    | "theme_oneshot"
    | "theme_draft"
    | "optimize_draft"
    | "builder_oneshot"
    | "builder_draft";
export type GenerateStep = "input" | "draft_review" | "complete";

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

export interface GenerateState {
    topMode: TopMode;
    flow: FlowType;
    step: GenerateStep;
    input: string;
    builderInputs: BuilderInputs;
    draft: string;
    result: GenerateResponse | null;
    loading: boolean;
    error: string | null;
}
