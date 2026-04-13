/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, memo } from "react";
import { CollapsibleCard } from "./CollapsibleCard";
import { CopyButton } from "./CopyButton";

const contentStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "14px",
    lineHeight: 1.6,
    color: "var(--fui-text-dim)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
});

const editTextareaStyle = css({
    width: "100%",
    minHeight: 80,
    padding: "var(--fui-spacing-3)",
    fontFamily: "var(--fui-font)",
    fontSize: "14px",
    lineHeight: 1.6,
    background: "var(--fui-bg-input)",
    border: "1px solid var(--fui-error-100)",
    color: "var(--fui-text)",
    resize: "vertical",
    outline: "none",
    boxShadow: "0 0 6px rgba(255, 51, 51, 0.15)",
});

const editActionsStyle = css({
    display: "flex",
    gap: "var(--fui-spacing-2)",
    marginTop: "var(--fui-spacing-2)",
});

const editBtnStyle = css({
    padding: "4px 10px",
    fontFamily: "var(--fui-font)",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid var(--fui-border)",
    background: "transparent",
    color: "var(--fui-text-muted)",
    transition: "all 0.15s ease",
    "&:hover": {
        borderColor: "var(--fui-primary-100)",
        color: "var(--fui-primary-100)",
    },
});

const saveBtnStyle = css({
    borderColor: "var(--fui-primary-100)",
    color: "var(--fui-primary-100)",
    background: "var(--fui-primary-10)",
    "&:hover": {
        background: "var(--fui-primary-20)",
    },
});

const regenBtnStyle = css({
    padding: "4px 10px",
    fontFamily: "var(--fui-font)",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid var(--fui-primary-60)",
    background: "var(--fui-primary-10)",
    color: "var(--fui-primary-100)",
    transition: "all 0.15s ease",
    "&:hover:not(:disabled)": {
        background: "var(--fui-primary-20)",
        boxShadow: "var(--fui-glow-primary)",
    },
    "&:disabled": {
        opacity: 0.4,
        cursor: "not-allowed",
    },
});

const regenLoadingStyle = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--fui-spacing-3)",
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    color: "var(--fui-primary-80)",
    border: "1px solid var(--fui-primary-20)",
    background: "var(--fui-primary-5)",
    "@keyframes pulse": {
        "0%, 100%": { opacity: 0.4 },
        "50%": { opacity: 1 },
    },
    animation: "pulse 1.5s ease-in-out infinite",
});

interface ExcludeOutputProps {
    value: string;
    onChange?: (newExclude: string) => void;
    onRegenerate?: () => void;
    regenerating?: boolean;
}

export const ExcludeOutput = memo(function ExcludeOutput({ value, onChange, onRegenerate, regenerating }: ExcludeOutputProps) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const handleEdit = () => {
        setDraft(value);
        setEditing(true);
    };

    const handleSave = () => {
        onChange?.(draft);
        setEditing(false);
    };

    const handleCancel = () => {
        setDraft(value);
        setEditing(false);
    };

    const headerRight = value ? (
        <div css={css({ display: "flex", alignItems: "center", gap: "var(--fui-spacing-2)" })}>
            {onRegenerate && !editing && !regenerating && (
                <button css={regenBtnStyle} onClick={onRegenerate}>{"\u21BB"} Regen</button>
            )}
            {onChange && !editing && (
                <button css={editBtnStyle} onClick={handleEdit}>Edit</button>
            )}
            <CopyButton text={value} />
        </div>
    ) : undefined;

    return (
        <CollapsibleCard
            title="Excluded Styles"
            titleColor="var(--fui-error-100)"
            headerRight={headerRight}
        >
            {regenerating && (
                <div css={regenLoadingStyle}>Regenerating exclusions...</div>
            )}
            {editing ? (
                <>
                    <textarea
                        css={editTextareaStyle}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        autoFocus
                    />
                    <div css={editActionsStyle}>
                        <button css={[editBtnStyle, saveBtnStyle]} onClick={handleSave}>Save</button>
                        <button css={editBtnStyle} onClick={handleCancel}>Cancel</button>
                    </div>
                </>
            ) : (
                <div css={contentStyle}>
                    {value || "Exclusions will appear here after generation..."}
                </div>
            )}
        </CollapsibleCard>
    );
});
