import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { SongEntry } from "../types";

const STORAGE_KEY = "muse-songs";
const RECENT_LIMIT = 10;

export interface AddSongInput {
    mode: SongEntry["mode"];
    oneshotInput?: string;
    builderInputs?: SongEntry["builderInputs"];
    result: SongEntry["result"];
    songTitle?: string;
}

export interface UseSongLibraryReturn {
    /** All stored entries, newest first. */
    songs: SongEntry[];
    /** Non-pinned songs, newest first, capped at 10. */
    recent: SongEntry[];
    /** Pinned songs, newest first, unlimited. */
    pinned: SongEntry[];
    /** Append a new song and return its id. Oldest non-pinned is evicted if over the limit. */
    addSong: (input: AddSongInput) => string;
    /** Merge a partial patch into the entry with the given id. */
    updateSong: (id: string, patch: Partial<Omit<SongEntry, "id" | "createdAt">>) => void;
    togglePin: (id: string) => void;
    deleteSong: (id: string) => void;
    clearAll: () => void;
    getById: (id: string | null | undefined) => SongEntry | undefined;
}

function cryptoId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `song_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
    return new Date().toISOString();
}

/**
 * Persists the user's song library in localStorage under `muse-songs`.
 * Rolling 10 non-pinned + unlimited pinned.
 */
export function useSongLibrary(): UseSongLibraryReturn {
    const [songs, setSongs] = useLocalStorage<SongEntry[]>(STORAGE_KEY, []);

    const recent = useMemo(
        () => songs.filter((s) => !s.pinned),
        [songs],
    );
    const pinned = useMemo(
        () => songs.filter((s) => s.pinned),
        [songs],
    );

    const addSong = useCallback(
        (input: AddSongInput): string => {
            const id = cryptoId();
            const entry: SongEntry = {
                id,
                mode: input.mode,
                oneshotInput: input.oneshotInput,
                builderInputs: input.builderInputs,
                result: input.result,
                songTitle: input.songTitle,
                pinned: false,
                createdAt: nowIso(),
            };
            setSongs((prev) => {
                const next = [entry, ...prev];
                // Enforce 10-item cap on non-pinned entries (oldest non-pinned drops)
                const nonPinned = next.filter((s) => !s.pinned);
                if (nonPinned.length > RECENT_LIMIT) {
                    const excess = nonPinned.length - RECENT_LIMIT;
                    const toDrop = new Set(nonPinned.slice(-excess).map((s) => s.id));
                    return next.filter((s) => !toDrop.has(s.id));
                }
                return next;
            });
            return id;
        },
        [setSongs],
    );

    const updateSong = useCallback(
        (id: string, patch: Partial<Omit<SongEntry, "id" | "createdAt">>) => {
            setSongs((prev) =>
                prev.map((s) =>
                    s.id === id ? { ...s, ...patch, updatedAt: nowIso() } : s,
                ),
            );
        },
        [setSongs],
    );

    const togglePin = useCallback(
        (id: string) => {
            setSongs((prev) => {
                const next = prev.map((s) =>
                    s.id === id ? { ...s, pinned: !s.pinned, updatedAt: nowIso() } : s,
                );
                // Re-apply 10-cap for non-pinned after the change
                const nonPinned = next.filter((s) => !s.pinned);
                if (nonPinned.length > RECENT_LIMIT) {
                    const excess = nonPinned.length - RECENT_LIMIT;
                    const toDrop = new Set(nonPinned.slice(-excess).map((s) => s.id));
                    return next.filter((s) => !toDrop.has(s.id));
                }
                return next;
            });
        },
        [setSongs],
    );

    const deleteSong = useCallback(
        (id: string) => {
            setSongs((prev) => prev.filter((s) => s.id !== id));
        },
        [setSongs],
    );

    const clearAll = useCallback(() => {
        setSongs([]);
    }, [setSongs]);

    const getById = useCallback(
        (id: string | null | undefined) => {
            if (!id) return undefined;
            return songs.find((s) => s.id === id);
        },
        [songs],
    );

    return { songs, recent, pinned, addSong, updateSong, togglePin, deleteSong, clearAll, getById };
}
