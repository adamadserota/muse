/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { FlowType } from "../types";

const containerStyle = css({
    display: "flex",
    gap: "var(--fui-spacing-2)",
});

const chipStyle = css({
    padding: "6px 14px",
    fontFamily: "var(--fui-font)",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.5px",
    cursor: "pointer",
    border: "1px solid var(--fui-border)",
    background: "transparent",
    color: "var(--fui-text-muted)",
    transition: "all 0.15s ease",
    "&:hover": {
        borderColor: "var(--fui-primary-60)",
        color: "var(--fui-text)",
    },
});

const activeChipStyle = css({
    borderColor: "var(--fui-secondary-100)",
    color: "var(--fui-secondary-100)",
    background: "rgba(51, 187, 255, 0.08)",
    "&:hover": {
        borderColor: "var(--fui-secondary-100)",
        color: "var(--fui-secondary-100)",
    },
});

interface FlowToggleProps {
    flow: FlowType;
    onChange: (flow: FlowType) => void;
}

export function FlowToggle({ flow, onChange }: FlowToggleProps) {
    return (
        <div css={containerStyle}>
            <button
                css={[chipStyle, flow === "oneshot" && activeChipStyle]}
                onClick={() => onChange("oneshot")}
            >
                One-shot
            </button>
            <button
                css={[chipStyle, flow === "twostep" && activeChipStyle]}
                onClick={() => onChange("twostep")}
            >
                Two-step
            </button>
        </div>
    );
}
