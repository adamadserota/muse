/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const baseStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    letterSpacing: "0.5px",
});

const normalStyle = css({ color: "var(--fui-text-muted)" });
const warningStyle = css({ color: "var(--fui-warning-100)" });
const errorStyle = css({ color: "var(--fui-error-100)" });

interface CharCountProps {
    current: number;
    max: number;
}

export function CharCount({ current, max }: CharCountProps) {
    const ratio = current / max;
    const colorStyle = ratio > 1 ? errorStyle : ratio > 0.9 ? warningStyle : normalStyle;

    return (
        <span css={[baseStyle, colorStyle]}>
            {current.toLocaleString()} / {max.toLocaleString()}
        </span>
    );
}
