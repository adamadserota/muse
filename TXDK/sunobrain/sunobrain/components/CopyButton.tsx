/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useCallback } from "react";

const buttonStyle = css({
    background: "transparent",
    border: "1px solid var(--fui-border)",
    color: "var(--fui-text-dim)",
    fontFamily: "var(--fui-font)",
    fontSize: "12px",
    padding: "4px 10px",
    cursor: "pointer",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    transition: "all 0.15s ease",
    "&:hover": {
        borderColor: "var(--fui-primary-100)",
        color: "var(--fui-primary-100)",
        boxShadow: "var(--fui-glow-primary)",
    },
});

const copiedStyle = css({
    borderColor: "var(--fui-primary-60)",
    color: "var(--fui-primary-100)",
});

interface CopyButtonProps {
    text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [text]);

    return (
        <button css={[buttonStyle, copied && copiedStyle]} onClick={handleCopy}>
            {copied ? "COPIED" : "COPY"}
        </button>
    );
}
