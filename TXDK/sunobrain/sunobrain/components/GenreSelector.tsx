/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useRef, useEffect } from "react";

const GENRES = [
    "Pop", "Rock", "Indie", "Alternative", "Hip-Hop",
    "R&B", "Soul", "Jazz", "Blues", "Country",
    "Folk", "Electronic", "House", "Techno", "Trance",
    "DnB", "Dubstep", "Ambient", "Classical", "Orchestral",
    "Metal", "Punk", "Reggae", "Latin", "Afrobeats",
    "K-Pop", "Lo-Fi", "Trap", "Funk", "Gospel",
];

const wrapperStyle = css({
    position: "relative",
});

const triggerStyle = css({
    width: "100%",
    minHeight: 38,
    padding: "8px 12px",
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    background: "var(--fui-bg-input)",
    border: "1px solid var(--fui-border)",
    color: "var(--fui-text)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
    transition: "border-color 0.15s ease",
    "&:hover": {
        borderColor: "var(--fui-primary-60)",
    },
});

const triggerOpenStyle = css({
    borderColor: "var(--fui-primary-100)",
    boxShadow: "var(--fui-glow-input)",
});

const placeholderStyle = css({
    color: "var(--fui-text-muted)",
    fontSize: "13px",
});

const chipStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 8px",
    fontSize: "11px",
    fontFamily: "var(--fui-font)",
    fontWeight: 500,
    letterSpacing: "0.5px",
    background: "var(--fui-primary-10)",
    border: "1px solid var(--fui-primary-40)",
    color: "var(--fui-primary-100)",
});

const chipRemoveStyle = css({
    cursor: "pointer",
    fontSize: "13px",
    lineHeight: 1,
    opacity: 0.6,
    "&:hover": {
        opacity: 1,
    },
});

const dropdownStyle = css({
    position: "absolute",
    top: "calc(100% + 2px)",
    left: 0,
    right: 0,
    maxHeight: 240,
    overflowY: "auto",
    background: "var(--fui-bg-section)",
    border: "1px solid var(--fui-primary-40)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
    zIndex: 100,
    "&::-webkit-scrollbar": {
        width: 6,
    },
    "&::-webkit-scrollbar-track": {
        background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
        background: "var(--fui-border)",
        "&:hover": {
            background: "var(--fui-primary-40)",
        },
    },
});

const rowStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    color: "var(--fui-text)",
    transition: "background 0.1s ease",
    "&:hover": {
        background: "var(--fui-bg-hover)",
    },
});

const checkboxStyle = css({
    width: 14,
    height: 14,
    accentColor: "var(--fui-primary-100)",
});

interface GenreSelectorProps {
    selected: string[];
    onChange: (genres: string[]) => void;
    disabled?: boolean;
}

export function GenreSelector({ selected, onChange, disabled }: GenreSelectorProps) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const toggle = (genre: string) => {
        if (selected.includes(genre)) {
            onChange(selected.filter((g) => g !== genre));
        } else {
            onChange([...selected, genre]);
        }
    };

    const removeChip = (genre: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selected.filter((g) => g !== genre));
    };

    return (
        <div css={wrapperStyle} ref={wrapperRef}>
            <div
                css={[triggerStyle, open && triggerOpenStyle]}
                onClick={() => !disabled && setOpen(!open)}
                style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            >
                {selected.length === 0 ? (
                    <span css={placeholderStyle}>Select genres...</span>
                ) : (
                    selected.map((genre) => (
                        <span key={genre} css={chipStyle}>
                            {genre}
                            <span css={chipRemoveStyle} onClick={(e) => removeChip(genre, e)}>
                                &times;
                            </span>
                        </span>
                    ))
                )}
            </div>

            {open && !disabled && (
                <div css={dropdownStyle}>
                    {GENRES.map((genre) => (
                        <div key={genre} css={rowStyle} onClick={() => toggle(genre)}>
                            <input
                                type="checkbox"
                                css={checkboxStyle}
                                checked={selected.includes(genre)}
                                readOnly
                            />
                            {genre}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
