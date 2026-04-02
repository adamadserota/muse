/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, type ReactNode } from "react";

const containerStyle = css({
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
});

const rightStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "var(--fui-spacing-2)",
});

const chevronStyle = css({
    fontSize: "14px",
    transition: "transform 0.2s ease",
    color: "var(--fui-primary-60)",
});

const bodyStyle = css({
    padding: "0 var(--fui-spacing-3) var(--fui-spacing-3)",
});

interface CollapsibleCardProps {
    title: string;
    titleColor?: string;
    defaultOpen?: boolean;
    headerRight?: ReactNode;
    children: ReactNode;
}

export function CollapsibleCard({
    title,
    titleColor = "var(--fui-primary-100)",
    defaultOpen = true,
    headerRight,
    children,
}: CollapsibleCardProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div css={containerStyle}>
            <button css={headerStyle} onClick={() => setOpen(!open)}>
                <span css={[titleStyle, css({ color: titleColor })]}>{title}</span>
                <div css={rightStyle}>
                    {open && headerRight}
                    <span css={[chevronStyle, open && css({ transform: "rotate(180deg)" })]}>
                        &#9660;
                    </span>
                </div>
            </button>
            {open && <div css={bodyStyle}>{children}</div>}
        </div>
    );
}
