/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import type { SavedStyle } from "../types";

const drawerStyle = css({
    border: "1px solid var(--fui-border)",
    background: "var(--fui-bg-section)",
});

const headerStyle = css({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px var(--fui-spacing-3)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:hover": {
        background: "var(--fui-bg-hover)",
    },
});

const titleStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "var(--fui-secondary-100)",
});

const countBadgeStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "10px",
    fontWeight: 600,
    padding: "1px 6px",
    background: "rgba(51, 187, 255, 0.15)",
    border: "1px solid var(--fui-secondary-100)",
    color: "var(--fui-secondary-100)",
    marginLeft: "var(--fui-spacing-2)",
});

const chevronStyle = css({
    fontSize: "14px",
    transition: "transform 0.2s ease",
    color: "var(--fui-secondary-100)",
});

const bodyStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "var(--fui-spacing-2)",
    padding: "0 var(--fui-spacing-3) var(--fui-spacing-3)",
    maxHeight: 400,
    overflowY: "auto",
    "&::-webkit-scrollbar": {
        width: 5,
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

const emptyStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "12px",
    color: "var(--fui-text-dim)",
    padding: "var(--fui-spacing-2) 0",
    textAlign: "center",
});

// -- Style Card --

const cardStyle = css({
    border: "1px solid var(--fui-border)",
    background: "var(--fui-bg-input)",
    transition: "border-color 0.15s ease",
    "&:hover": {
        borderColor: "var(--fui-secondary-100)",
    },
});

const cardHeaderStyle = css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    cursor: "pointer",
    "&:hover": {
        background: "var(--fui-bg-hover)",
    },
});

const cardNameStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--fui-text)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
});

const cardMetaRowStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "var(--fui-spacing-2)",
    flexShrink: 0,
});

const metaTextStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "10px",
    color: "var(--fui-text-dim)",
    letterSpacing: "0.3px",
});

const cardBodyStyle = css({
    padding: "0 10px 10px",
    display: "flex",
    flexDirection: "column",
    gap: "var(--fui-spacing-2)",
});

const genreChipsStyle = css({
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
});

const genreChipStyle = css({
    display: "inline-block",
    padding: "1px 6px",
    fontFamily: "var(--fui-font)",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.3px",
    background: "var(--fui-primary-10)",
    border: "1px solid var(--fui-primary-40)",
    color: "var(--fui-primary-80)",
});

const fieldLabelStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: "var(--fui-text-muted)",
    marginBottom: "2px",
});

const styleTextStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "12px",
    lineHeight: 1.5,
    color: "var(--fui-text)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxHeight: 100,
    overflowY: "auto",
    padding: "6px 8px",
    background: "rgba(0, 0, 0, 0.2)",
    border: "1px solid var(--fui-border)",
    "&::-webkit-scrollbar": {
        width: 4,
    },
    "&::-webkit-scrollbar-thumb": {
        background: "var(--fui-border)",
    },
});

const excludeTextStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    lineHeight: 1.4,
    color: "var(--fui-text-dim)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
});

const actionsRowStyle = css({
    display: "flex",
    gap: "var(--fui-spacing-2)",
    paddingTop: "var(--fui-spacing-1)",
});

const actionButtonStyle = css({
    padding: "5px 12px",
    fontFamily: "var(--fui-font)",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid var(--fui-secondary-100)",
    background: "rgba(51, 187, 255, 0.1)",
    color: "var(--fui-secondary-100)",
    transition: "all 0.15s ease",
    "&:hover": {
        background: "rgba(51, 187, 255, 0.2)",
    },
});

const deleteButtonStyle = css({
    borderColor: "var(--fui-border)",
    background: "transparent",
    color: "var(--fui-text-muted)",
    "&:hover": {
        borderColor: "var(--fui-error-100)",
        color: "var(--fui-error-100)",
        background: "rgba(255, 51, 51, 0.08)",
    },
});

const renameInputStyle = css({
    flex: 1,
    padding: "4px 8px",
    fontFamily: "var(--fui-font)",
    fontSize: "12px",
    background: "transparent",
    border: "1px solid var(--fui-secondary-100)",
    color: "var(--fui-text)",
    outline: "none",
    "&::placeholder": {
        color: "var(--fui-text-muted)",
    },
});

const renameRowStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "var(--fui-spacing-1)",
});

const renameErrorStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "10px",
    color: "var(--fui-error-100)",
});

const smallBtnStyle = css({
    padding: "4px 8px",
    fontFamily: "var(--fui-font)",
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid var(--fui-secondary-100)",
    background: "rgba(51, 187, 255, 0.1)",
    color: "var(--fui-secondary-100)",
    "&:hover": {
        background: "rgba(51, 187, 255, 0.2)",
    },
    "&:disabled": {
        opacity: 0.4,
        cursor: "not-allowed",
    },
});

const smallCancelStyle = css({
    borderColor: "var(--fui-border)",
    background: "transparent",
    color: "var(--fui-text-muted)",
    "&:hover": {
        borderColor: "var(--fui-text)",
        color: "var(--fui-text)",
    },
});

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) + " " + d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

// -- Individual saved style card --

interface StyleCardProps {
    style: SavedStyle;
    onInject: (styleText: string) => void;
    onRename: (id: string, newName: string) => string | null;
    onDelete: (id: string) => void;
}

function StyleCard({ style, onInject, onRename, onDelete }: StyleCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [renameDraft, setRenameDraft] = useState(style.name);
    const [renameError, setRenameError] = useState<string | null>(null);

    const handleRename = () => {
        const err = onRename(style.id, renameDraft);
        if (err) {
            setRenameError(err);
            return;
        }
        setRenaming(false);
        setRenameError(null);
    };

    const cancelRename = () => {
        setRenaming(false);
        setRenameDraft(style.name);
        setRenameError(null);
    };

    return (
        <div css={cardStyle}>
            <div css={cardHeaderStyle} onClick={() => setExpanded(!expanded)}>
                <span css={cardNameStyle}>{style.name}</span>
                <div css={cardMetaRowStyle}>
                    <span css={metaTextStyle}>{style.charCount} chars</span>
                    <span
                        css={[chevronStyle, css({ fontSize: "11px" }), expanded && css({ transform: "rotate(180deg)" })]}
                    >
                        &#9660;
                    </span>
                </div>
            </div>

            {expanded && (
                <div css={cardBodyStyle}>
                    {/* Rename row */}
                    {renaming ? (
                        <div>
                            <div css={renameRowStyle}>
                                <input
                                    css={renameInputStyle}
                                    value={renameDraft}
                                    onChange={(e) => {
                                        setRenameDraft(e.target.value);
                                        setRenameError(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleRename();
                                        if (e.key === "Escape") cancelRename();
                                    }}
                                    autoFocus
                                />
                                <button
                                    css={smallBtnStyle}
                                    onClick={handleRename}
                                    disabled={!renameDraft.trim()}
                                >
                                    Save
                                </button>
                                <button css={[smallBtnStyle, smallCancelStyle]} onClick={cancelRename}>
                                    Cancel
                                </button>
                            </div>
                            {renameError && <span css={renameErrorStyle}>{renameError}</span>}
                        </div>
                    ) : null}

                    {/* Metadata */}
                    <span css={metaTextStyle}>Created {formatDate(style.createdAt)}</span>

                    {/* Genres */}
                    {style.genres.length > 0 && (
                        <div>
                            <div css={fieldLabelStyle}>Genres</div>
                            <div css={genreChipsStyle}>
                                {style.genres.map((g) => (
                                    <span key={g} css={genreChipStyle}>{g}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Style text */}
                    <div>
                        <div css={fieldLabelStyle}>Style Prompt ({style.charCount} / 1,000)</div>
                        <div css={styleTextStyle}>{style.styleText}</div>
                    </div>

                    {/* Exclude styles */}
                    {style.excludeStyles && (
                        <div>
                            <div css={fieldLabelStyle}>Exclude Styles</div>
                            <div css={excludeTextStyle}>{style.excludeStyles}</div>
                        </div>
                    )}

                    {/* Actions */}
                    <div css={actionsRowStyle}>
                        <button css={actionButtonStyle} onClick={() => onInject(style.styleText)}>
                            Inject into Builder
                        </button>
                        <button
                            css={actionButtonStyle}
                            onClick={() => {
                                setRenaming(true);
                                setRenameDraft(style.name);
                            }}
                        >
                            Rename
                        </button>
                        <button
                            css={[actionButtonStyle, deleteButtonStyle]}
                            onClick={() => onDelete(style.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// -- Main Drawer --

interface SavedStylesDrawerProps {
    savedStyles: SavedStyle[];
    onInject: (styleText: string) => void;
    onRename: (id: string, newName: string) => string | null;
    onDelete: (id: string) => void;
}

export function SavedStylesDrawer({
    savedStyles,
    onInject,
    onRename,
    onDelete,
}: SavedStylesDrawerProps) {
    const [open, setOpen] = useState(false);

    return (
        <div css={drawerStyle}>
            <button css={headerStyle} onClick={() => setOpen(!open)}>
                <div css={css({ display: "flex", alignItems: "center" })}>
                    <span css={titleStyle}>Saved Styles</span>
                    {savedStyles.length > 0 && (
                        <span css={countBadgeStyle}>{savedStyles.length}</span>
                    )}
                </div>
                <span css={[chevronStyle, open && css({ transform: "rotate(180deg)" })]}>
                    &#9660;
                </span>
            </button>

            {open && (
                <div css={bodyStyle}>
                    {savedStyles.length === 0 ? (
                        <div css={emptyStyle}>
                            No saved styles yet. Generate a track in Builder mode and save the
                            style prompt from the output panel.
                        </div>
                    ) : (
                        savedStyles.map((style) => (
                            <StyleCard
                                key={style.id}
                                style={style}
                                onInject={onInject}
                                onRename={onRename}
                                onDelete={onDelete}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
