import type { GenerateMode, GenerateResponse, AlbumCoverResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "";

class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

async function apiFetch<T>(url: string, options: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
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
        throw new ApiError(res.status, message);
    }

    return res.json() as Promise<T>;
}

export async function generateSong(params: {
    mode: GenerateMode;
    input: string;
    apiKey: string;
    model?: string;
}): Promise<GenerateResponse> {
    return apiFetch<GenerateResponse>(`${API_BASE}/api/generate`, {
        method: "POST",
        body: JSON.stringify({
            mode: params.mode,
            input: params.input,
            api_key: params.apiKey,
            model: params.model || "gemini-3.1-pro-preview",
        }),
    });
}

export async function generateAlbumCover(params: {
    plainLyrics: string;
    songTitle: string;
    styles: string;
    apiKey: string;
    model?: string;
}): Promise<AlbumCoverResponse> {
    return apiFetch<AlbumCoverResponse>(`${API_BASE}/api/album-cover`, {
        method: "POST",
        body: JSON.stringify({
            plain_lyrics: params.plainLyrics,
            song_title: params.songTitle,
            styles: params.styles,
            api_key: params.apiKey,
            model: params.model || "imagen-4.0-ultra-generate-001",
        }),
    });
}
