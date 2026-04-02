/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CollapsibleCard } from "./CollapsibleCard";
import { CopyButton } from "./CopyButton";

const contentStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "14px",
    lineHeight: 1.7,
    color: "var(--fui-text-dim)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxHeight: 300,
    overflow: "auto",
});

const sectionLabelStyle = css({
    color: "var(--fui-primary-60)",
    fontWeight: 600,
});

interface PlainLyricsOutputProps {
    value: string;
}

function highlightSections(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
        const isLabel = /^(Verse|Chorus|Pre-Chorus|Post-Chorus|Bridge|Intro|Outro)\s*\d*:/.test(
            line.trim(),
        );
        return (
            <span key={i}>
                {isLabel ? <span css={sectionLabelStyle}>{line}</span> : line}
                {i < lines.length - 1 ? "\n" : ""}
            </span>
        );
    });
}

export function PlainLyricsOutput({ value }: PlainLyricsOutputProps) {
    return (
        <CollapsibleCard
            title="Plain Lyrics"
            titleColor="var(--fui-text-muted)"
            headerRight={value ? <CopyButton text={value} /> : undefined}
        >
            <div css={contentStyle}>
                {value ? highlightSections(value) : "Plain lyrics will appear here..."}
            </div>
        </CollapsibleCard>
    );
}
