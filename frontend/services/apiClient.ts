import type { GenerateMode, GenerateResponse, AlbumCoverResponse, RegenerableSection } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "";
const GEMINI_KEY_STORAGE = "muse-gemini-key";

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

/** Read the user's Gemini API key from localStorage. Empty string if not set. */
function getGeminiKey(): string {
    try {
        return window.localStorage.getItem(GEMINI_KEY_STORAGE) || "";
    } catch {
        return "";
    }
}

async function apiFetch<T>(url: string, options: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "X-Gemini-API-Key": getGeminiKey(),
            ...options.headers,
        },
    });

    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            const body = await res.json();
            message = body.detail || body.error?.message || message;
        } catch {
            // Use default message
        }
        if (res.status === 401 && !message) {
            message = "Gemini API key missing or invalid — update it in Settings";
        }
        throw new ApiError(res.status, message);
    }

    return res.json() as Promise<T>;
}

export async function generateSong(params: {
    mode: GenerateMode;
    input: string;
    model?: string;
    signal?: AbortSignal;
}): Promise<GenerateResponse> {
    return apiFetch<GenerateResponse>(`${API_BASE}/api/generate`, {
        method: "POST",
        body: JSON.stringify({
            mode: params.mode,
            input: params.input,
            model: params.model || "gemini-3.1-pro-preview",
        }),
        signal: params.signal,
    });
}

export async function regenerateSection(params: {
    section: RegenerableSection;
    context: GenerateResponse;
    model?: string;
    signal?: AbortSignal;
}): Promise<Partial<GenerateResponse>> {
    return apiFetch<Partial<GenerateResponse>>(`${API_BASE}/api/regenerate`, {
        method: "POST",
        body: JSON.stringify({
            section: params.section,
            context: params.context,
            model: params.model || "gemini-3.1-pro-preview",
        }),
        signal: params.signal,
    });
}

export async function generateAlbumCover(params: {
    plainLyrics: string;
    songTitle: string;
    styles: string;
    model?: string;
    signal?: AbortSignal;
}): Promise<AlbumCoverResponse> {
    return apiFetch<AlbumCoverResponse>(`${API_BASE}/api/album-cover`, {
        method: "POST",
        body: JSON.stringify({
            plain_lyrics: params.plainLyrics,
            song_title: params.songTitle,
            styles: params.styles,
            model: params.model || "imagen-4.0-ultra-generate-001",
        }),
        signal: params.signal,
    });
}
