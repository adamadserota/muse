/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const overlayStyle = css({
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    padding: "60px 16px 16px",
});

const panelStyle = css({
    background: "var(--fui-bg-section)",
    border: "1px solid var(--fui-border)",
    padding: "var(--fui-spacing-4)",
    width: 340,
    display: "flex",
    flexDirection: "column",
    gap: "var(--fui-spacing-3)",
});

const titleStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "var(--fui-primary-100)",
});

const labelStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "var(--fui-text-muted)",
    marginBottom: "4px",
    display: "block",
});

const inputStyle = css({
    width: "100%",
    padding: "10px 12px",
    fontFamily: "var(--fui-font)",
    fontSize: "14px",
    background: "var(--fui-bg-input)",
    border: "1px solid var(--fui-border)",
    color: "var(--fui-text)",
    outline: "none",
    transition: "border-color 0.15s ease",
    "&:focus": {
        borderColor: "var(--fui-primary-100)",
        boxShadow: "var(--fui-glow-input)",
    },
    "&::placeholder": {
        color: "var(--fui-text-muted)",
    },
});

const selectStyle = css({
    width: "100%",
    padding: "10px 12px",
    fontFamily: "var(--fui-font)",
    fontSize: "14px",
    background: "var(--fui-bg-input)",
    border: "1px solid var(--fui-border)",
    color: "var(--fui-text)",
    outline: "none",
    cursor: "pointer",
    "&:focus": {
        borderColor: "var(--fui-primary-100)",
    },
});

const fieldStyle = css({
    display: "flex",
    flexDirection: "column",
});

interface SettingsPanelProps {
    apiKey: string;
    model: string;
    onApiKeyChange: (key: string) => void;
    onModelChange: (model: string) => void;
    onClose: () => void;
}

export function SettingsPanel({
    apiKey,
    model,
    onApiKeyChange,
    onModelChange,
    onClose,
}: SettingsPanelProps) {
    return (
        <div css={overlayStyle} onClick={onClose}>
            <div css={panelStyle} onClick={(e) => e.stopPropagation()}>
                <span css={titleStyle}>Settings</span>
                <div css={fieldStyle}>
                    <label css={labelStyle}>Gemini API Key</label>
                    <input
                        css={inputStyle}
                        type="password"
                        placeholder="AIza..."
                        value={apiKey}
                        onChange={(e) => onApiKeyChange(e.target.value)}
                    />
                </div>
                <div css={fieldStyle}>
                    <label css={labelStyle}>Model</label>
                    <select
                        css={selectStyle}
                        value={model}
                        onChange={(e) => onModelChange(e.target.value)}
                    >
                        <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
                        <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
