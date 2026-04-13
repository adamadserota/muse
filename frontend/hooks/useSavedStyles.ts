import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { SavedStyle } from "../types";

export interface SaveStyleParams {
    name: string;
    styleText: string;
    excludeStyles: string;
    genres: string[];
}

export function useSavedStyles() {
    const [savedStyles, setSavedStyles] = useLocalStorage<SavedStyle[]>(
        "muse-saved-styles",
        [],
    );

    const isNameTaken = useCallback(
        (name: string, excludeId?: string) =>
            savedStyles.some(
                (s) => s.name.toLowerCase() === name.toLowerCase() && s.id !== excludeId,
            ),
        [savedStyles],
    );

    const saveStyle = useCallback(
        (params: SaveStyleParams): string | null => {
            const trimmed = params.name.trim();
            if (!trimmed) return "Name is required";
            if (isNameTaken(trimmed)) return "A style with this name already exists";

            const entry: SavedStyle = {
                id: crypto.randomUUID(),
                name: trimmed,
                styleText: params.styleText,
                excludeStyles: params.excludeStyles,
                genres: params.genres,
                charCount: params.styleText.length,
                createdAt: new Date().toISOString(),
            };
            setSavedStyles((prev) => [entry, ...prev]);
            return null; // success
        },
        [setSavedStyles, isNameTaken],
    );

    const renameStyle = useCallback(
        (id: string, newName: string): string | null => {
            const trimmed = newName.trim();
            if (!trimmed) return "Name is required";
            if (isNameTaken(trimmed, id)) return "A style with this name already exists";

            setSavedStyles((prev) =>
                prev.map((s) => (s.id === id ? { ...s, name: trimmed } : s)),
            );
            return null;
        },
        [setSavedStyles, isNameTaken],
    );

    const deleteStyle = useCallback(
        (id: string) => {
            setSavedStyles((prev) => prev.filter((s) => s.id !== id));
        },
        [setSavedStyles],
    );

    return { savedStyles, saveStyle, renameStyle, deleteStyle, isNameTaken };
}
