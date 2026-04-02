/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { TopMode } from "../types";

const containerStyle = css({
    display: "flex",
    gap: 0,
});

const tabStyle = css({
    flex: 1,
    padding: "10px 16px",
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid var(--fui-border)",
    background: "transparent",
    color: "var(--fui-text-muted)",
    transition: "all 0.15s ease",
    "&:hover": {
        background: "var(--fui-bg-hover)",
        color: "var(--fui-text)",
    },
});

const activeTabStyle = css({
    background: "var(--fui-primary-20)",
    borderColor: "var(--fui-primary-100)",
    color: "var(--fui-primary-100)",
    "&:hover": {
        background: "var(--fui-primary-20)",
        color: "var(--fui-primary-100)",
    },
});

interface TopModeToggleProps {
    topMode: TopMode;
    onChange: (mode: TopMode) => void;
}

export function TopModeToggle({ topMode, onChange }: TopModeToggleProps) {
    return (
        <div css={containerStyle}>
            <button
                css={[tabStyle, topMode === "oneshot" && activeTabStyle]}
                onClick={() => onChange("oneshot")}
            >
                One-shot
            </button>
            <button
                css={[tabStyle, topMode === "builder" && activeTabStyle]}
                onClick={() => onChange("builder")}
            >
                Builder
            </button>
        </div>
    );
}
