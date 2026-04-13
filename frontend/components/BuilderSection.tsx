/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { ReactNode } from "react";

const wrapperStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "var(--fui-spacing-1)",
});

const labelStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "var(--fui-text-muted)",
});

const helpStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    lineHeight: 1.4,
    color: "var(--fui-text-dim)",
    marginBottom: "2px",
});

interface BuilderSectionProps {
    label: string;
    helpText?: string;
    children: ReactNode;
}

export function BuilderSection({ label, helpText, children }: BuilderSectionProps) {
    return (
        <div css={wrapperStyle}>
            <span css={labelStyle}>{label}</span>
            {helpText && <span css={helpStyle}>{helpText}</span>}
            {children}
        </div>
    );
}
