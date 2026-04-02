/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useCallback, useRef } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { InputPanel } from "./components/InputPanel";
import { OutputPanel } from "./components/OutputPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { useGenerate } from "./hooks/useGenerate";
import { useSavedStyles } from "./hooks/useSavedStyles";
import { useLocalStorage } from "./hooks/useLocalStorage";

const MIN_PANEL_WIDTH = 260;
const DEFAULT_PANEL_WIDTH = 420;
const COLLAPSED_WIDTH = 40;

const layoutStyle = css({
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
});

const headerStyle = css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "var(--fui-spacing-2) var(--fui-spacing-3)",
    borderBottom: "1px solid var(--fui-border)",
    background: "var(--fui-bg-section)",
});

const logoStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "var(--fui-primary-100)",
});

const subtitleStyle = css({
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    color: "var(--fui-text-muted)",
    letterSpacing: "0.5px",
    marginLeft: "var(--fui-spacing-2)",
});

const gearButtonStyle = css({
    background: "transparent",
    border: "1px solid var(--fui-border)",
    color: "var(--fui-text-muted)",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
    transition: "all 0.15s ease",
    "&:hover": {
        borderColor: "var(--fui-primary-100)",
        color: "var(--fui-primary-100)",
    },
});

const mainStyle = css({
    display: "flex",
    flex: 1,
    overflow: "hidden",
    minHeight: 0,
});

const inputWrapperStyle = css({
    position: "relative",
    overflow: "hidden",
    transition: "width 0.2s ease",
    flexShrink: 0,
});

const collapsedStyle = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    cursor: "pointer",
    "&:hover": {
        background: "var(--fui-bg-hover)",
    },
});

const collapseToggleStyle = css({
    writingMode: "vertical-rl",
    fontFamily: "var(--fui-font)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "var(--fui-primary-60)",
    userSelect: "none",
});

const resizeHandleStyle = css({
    position: "absolute",
    top: 0,
    right: 0,
    width: 5,
    height: "100%",
    cursor: "col-resize",
    background: "var(--fui-border)",
    zIndex: 10,
    transition: "background 0.15s ease",
    "&:hover, &:active": {
        background: "var(--fui-primary-60)",
    },
});

const collapseButtonStyle = css({
    position: "absolute",
    top: 8,
    right: 10,
    background: "var(--fui-bg-section)",
    border: "1px solid var(--fui-border)",
    color: "var(--fui-text-muted)",
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "12px",
    zIndex: 11,
    transition: "all 0.15s ease",
    "&:hover": {
        borderColor: "var(--fui-primary-100)",
        color: "var(--fui-primary-100)",
    },
});

const outputWrapperStyle = css({
    flex: 1,
    overflow: "hidden",
    minWidth: 0,
});

const noKeyBanner = css({
    padding: "var(--fui-spacing-2) var(--fui-spacing-3)",
    background: "rgba(255, 129, 51, 0.1)",
    borderBottom: "1px solid var(--fui-warning-100)",
    fontFamily: "var(--fui-font)",
    fontSize: "12px",
    color: "var(--fui-warning-100)",
    textAlign: "center",
    cursor: "pointer",
    "&:hover": {
        background: "rgba(255, 129, 51, 0.15)",
    },
});

export function App() {
    const [apiKey, setApiKey] = useLocalStorage(
        "sunobrain-api-key",
        import.meta.env.VITE_GEMINI_API_KEY || "",
    );
    const [model, setModel] = useLocalStorage("sunobrain-model", "gemini-3.1-pro-preview");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [panelWidth, setPanelWidth] = useLocalStorage("sunobrain-panel-width", DEFAULT_PANEL_WIDTH);
    const [collapsed, setCollapsed] = useState(false);
    const dragging = useRef(false);

    const gen = useGenerate();
    const { savedStyles, saveStyle, renameStyle, deleteStyle } = useSavedStyles();

    const handleGenerate = () => {
        if (!apiKey) {
            setSettingsOpen(true);
            return;
        }
        gen.generate(apiKey, model);
    };

    const handleOptimize = () => {
        if (!apiKey) {
            setSettingsOpen(true);
            return;
        }
        gen.optimize(apiKey, model);
    };

    const handleInjectStyle = useCallback(
        (styleText: string) => {
            gen.updateBuilderField("styleInfluences", styleText);
        },
        [gen.updateBuilderField],
    );

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            dragging.current = true;

            const startX = e.clientX;
            const startWidth = panelWidth;

            const onMouseMove = (ev: MouseEvent) => {
                if (!dragging.current) return;
                const delta = ev.clientX - startX;
                const newWidth = Math.max(MIN_PANEL_WIDTH, startWidth + delta);
                setPanelWidth(newWidth);
            };

            const onMouseUp = () => {
                dragging.current = false;
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            };

            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [panelWidth, setPanelWidth],
    );

    // Only show save style in Builder mode
    const handleSaveStyle = gen.topMode === "builder" ? saveStyle : undefined;

    return (
        <ErrorBoundary>
            <div css={layoutStyle}>
                <header css={headerStyle}>
                    <div>
                        <span css={logoStyle}>SunoBrain</span>
                        <span css={subtitleStyle}>Suno v5.5 Production Studio</span>
                    </div>
                    <button css={gearButtonStyle} onClick={() => setSettingsOpen(true)}>
                        &#9881;
                    </button>
                </header>

                {!apiKey && (
                    <div css={noKeyBanner} onClick={() => setSettingsOpen(true)}>
                        No API key set — click here or the gear icon to configure your Gemini API
                        key
                    </div>
                )}

                <main css={mainStyle}>
                    <div
                        css={inputWrapperStyle}
                        style={{ width: collapsed ? COLLAPSED_WIDTH : panelWidth }}
                    >
                        {collapsed ? (
                            <div css={collapsedStyle} onClick={() => setCollapsed(false)}>
                                <span css={collapseToggleStyle}>Input Panel</span>
                            </div>
                        ) : (
                            <>
                                <button
                                    css={collapseButtonStyle}
                                    onClick={() => setCollapsed(true)}
                                    title="Collapse panel"
                                >
                                    &#9664;
                                </button>
                                <InputPanel
                                    topMode={gen.topMode}
                                    flow={gen.flow}
                                    step={gen.step}
                                    input={gen.input}
                                    builderInputs={gen.builderInputs}
                                    draft={gen.draft}
                                    loading={gen.loading}
                                    error={gen.error}
                                    savedStyles={savedStyles}
                                    onTopModeChange={gen.setTopMode}
                                    onFlowChange={gen.setFlow}
                                    onInputChange={gen.setInput}
                                    onBuilderChange={gen.updateBuilderField}
                                    onDraftChange={gen.setDraft}
                                    onGenerate={handleGenerate}
                                    onOptimize={handleOptimize}
                                    onReset={gen.reset}
                                    onInjectStyle={handleInjectStyle}
                                    onRenameStyle={renameStyle}
                                    onDeleteStyle={deleteStyle}
                                />
                                <div css={resizeHandleStyle} onMouseDown={handleMouseDown} />
                            </>
                        )}
                    </div>
                    <div css={outputWrapperStyle}>
                        <OutputPanel
                            result={gen.result}
                            loading={gen.loading}
                            apiKey={apiKey}
                            genres={gen.builderInputs.genres}
                            onUpdateResult={gen.updateResult}
                            onSaveStyle={handleSaveStyle}
                        />
                    </div>
                </main>

                {settingsOpen && (
                    <SettingsPanel
                        apiKey={apiKey}
                        model={model}
                        onApiKeyChange={setApiKey}
                        onModelChange={setModel}
                        onClose={() => setSettingsOpen(false)}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
}
