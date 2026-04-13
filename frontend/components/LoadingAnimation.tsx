/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";

const spin = keyframes({
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
});

const pulse = keyframes({
    "0%, 100%": { transform: "scaleY(0.3)", opacity: 0.4 },
    "50%": { transform: "scaleY(1)", opacity: 1 },
});

const bounce = keyframes({
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-6px)" },
});

const containerStyle = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 32,
    padding: 48,
});

const vinylStyle = css({
    position: "relative",
    width: 140,
    height: 140,
});

const discStyle = css({
    width: 140,
    height: 140,
    borderRadius: "50%",
    background: `
        radial-gradient(circle at center,
            var(--fui-primary-100) 0%,
            var(--fui-primary-100) 6%,
            #0a1820 7%,
            #0a1820 10%,
            #112530 11%,
            #0d1d25 14%,
            #112530 17%,
            #0d1d25 20%,
            #112530 23%,
            #0d1d25 26%,
            #112530 29%,
            #0d1d25 32%,
            #112530 35%,
            #0d1d25 38%,
            #112530 41%,
            #0d1d25 44%,
            #0d1d25 100%
        )
    `,
    border: "2px solid var(--fui-primary-20)",
    boxShadow: "0 0 30px rgba(51, 255, 255, 0.15), inset 0 0 20px rgba(0,0,0,0.5)",
    animation: `${spin} 3s linear infinite`,
});

const barsContainerStyle = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 48,
});

const barBaseStyle = css({
    width: 5,
    background: "var(--fui-primary-100)",
    borderRadius: 0,
    transformOrigin: "center",
    boxShadow: "0 0 6px rgba(51, 255, 255, 0.4)",
});

const textStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "var(--fui-primary-60)",
    animation: `${bounce} 2s ease-in-out infinite`,
});

const subtextStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    color: "var(--fui-text-muted)",
    letterSpacing: "0.5px",
    marginTop: -20,
});

const BAR_COUNT = 12;
const BAR_DELAYS = [0, 0.15, 0.3, 0.1, 0.25, 0.4, 0.05, 0.2, 0.35, 0.12, 0.28, 0.08];
const BAR_HEIGHTS = [28, 40, 22, 46, 34, 48, 26, 42, 30, 44, 36, 24];

interface LoadingAnimationProps {
    modelName?: string;
}

export function LoadingAnimation({ modelName }: LoadingAnimationProps) {
    return (
        <div css={containerStyle}>
            <div css={vinylStyle}>
                <div css={discStyle} />
            </div>

            <div css={barsContainerStyle}>
                {Array.from({ length: BAR_COUNT }).map((_, i) => (
                    <div
                        key={i}
                        css={[
                            barBaseStyle,
                            css({
                                height: BAR_HEIGHTS[i],
                                animation: `${pulse} ${0.6 + (i % 3) * 0.15}s ease-in-out infinite`,
                                animationDelay: `${BAR_DELAYS[i]}s`,
                            }),
                        ]}
                    />
                ))}
            </div>

            <div css={textStyle}>Producing your track</div>
            <div css={subtextStyle}>{modelName ? `${modelName} is composing` : "Composing"} lyrics, styles, and analysis...</div>
        </div>
    );
}
