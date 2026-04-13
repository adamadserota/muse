import { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    Fade,
    Paper,
    Snackbar,
} from "@mui/material";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { InputPanel } from "./components/InputPanel";
import { OutputPanel } from "./components/OutputPanel";
import { LoadingView } from "./components/LoadingView";
import { LibraryView } from "./components/LibraryView";
import { SongDetailView } from "./components/SongDetailView";
import { SettingsView } from "./components/SettingsView";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { GuidedTour } from "./components/GuidedTour";
import { useGenerate } from "./hooks/useGenerate";
import { useSavedStyles } from "./hooks/useSavedStyles";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSongLibrary } from "./hooks/useSongLibrary";
import { regenerateSection } from "./services/apiClient";
import { extractSongTitle } from "./utils/songTitle";
import {
    getModelDisplayName,
    type BuilderInputs,
    type RegenerableSection,
    type SongEntry,
} from "./types";

type Tab = "library" | "create" | "settings";

const EMPTY_BUILDER: BuilderInputs = {
    inspiration: "",
    genres: [],
    styleInfluences: "",
    lyricInput: "",
    exclusions: "",
};

export function App() {
    const [activeTab, setActiveTab] = useState<Tab>("create");
    const [apiKey, setApiKey] = useLocalStorage("muse-gemini-key", "");
    const [model, setModel] = useLocalStorage("muse-model", "gemini-3.1-pro-preview");
    const [onboardingComplete, setOnboardingComplete] = useLocalStorage(
        "muse-onboarding-complete",
        false,
    );

    // Onboarding state machine
    const [welcomeDismissed, setWelcomeDismissed] = useState(false);
    const [tourOpen, setTourOpen] = useState(false);
    const [tourOfferOpen, setTourOfferOpen] = useState(false);
    const keySavedOnceRef = useRef(false);

    const showWelcome = !apiKey && !onboardingComplete && !welcomeDismissed;
    const showApiKey = !apiKey && (welcomeDismissed || onboardingComplete);

    const handleWelcomeContinue = () => setWelcomeDismissed(true);
    const handleApiKeySave = (key: string) => {
        setApiKey(key);
        if (!keySavedOnceRef.current && !onboardingComplete) {
            keySavedOnceRef.current = true;
            setTourOfferOpen(true);
        }
    };
    const handleAcceptTour = () => {
        setTourOfferOpen(false);
        setTourOpen(true);
    };
    const handleSkipTour = () => {
        setTourOfferOpen(false);
        setOnboardingComplete(true);
    };
    const handleTourFinish = () => {
        setTourOpen(false);
        setOnboardingComplete(true);
    };
    const handleRestartTour = () => {
        setTourOpen(true);
    };

    const gen = useGenerate();
    const { savedStyles, saveStyle, renameStyle, deleteStyle } = useSavedStyles();
    const library = useSongLibrary();

    // Library navigation state
    const [openSongId, setOpenSongId] = useState<string | null>(null);
    const [editingSongId, setEditingSongId] = useState<string | null>(null);
    const openedSong = library.getById(openSongId);

    const [regenerating, setRegenerating] = useState<Record<RegenerableSection, boolean>>({
        styles: false,
        exclude_styles: false,
        lyrics: false,
        analysis: false,
    });
    const regenAbortRefs = useRef<Record<string, AbortController>>({});

    // Save to library on generation complete (or update if editing an existing entry)
    const lastSavedResultRef = useRef<unknown>(null);
    useEffect(() => {
        if (gen.step !== "complete" || !gen.result) {
            if (gen.step === "input") lastSavedResultRef.current = null;
            return;
        }
        // Dedup: only save once per completed result object
        if (lastSavedResultRef.current === gen.result) return;
        lastSavedResultRef.current = gen.result;

        const songTitle = extractSongTitle(gen.result.lyrics);

        if (editingSongId) {
            library.updateSong(editingSongId, {
                mode: gen.topMode,
                oneshotInput: gen.topMode === "oneshot" ? gen.input : undefined,
                builderInputs: gen.topMode === "builder" ? gen.builderInputs : undefined,
                result: gen.result,
                songTitle,
            });
            setEditingSongId(null);
        } else {
            library.addSong({
                mode: gen.topMode,
                oneshotInput: gen.topMode === "oneshot" ? gen.input : undefined,
                builderInputs: gen.topMode === "builder" ? gen.builderInputs : undefined,
                result: gen.result,
                songTitle,
            });
        }
    }, [gen.step, gen.result, gen.topMode, gen.input, gen.builderInputs, editingSongId, library]);

    const handleRegenerate = useCallback(
        async (section: RegenerableSection) => {
            if (!gen.result) return;
            regenAbortRefs.current[section]?.abort();
            const controller = new AbortController();
            regenAbortRefs.current[section] = controller;
            const timeout = window.setTimeout(() => controller.abort(), 120_000);

            setRegenerating((prev) => ({ ...prev, [section]: true }));
            try {
                const patch = await regenerateSection({
                    section,
                    context: gen.result,
                    model,
                    signal: controller.signal,
                });
                gen.updateResult(patch);
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") {
                    setRegenerating((prev) => ({ ...prev, [section]: false }));
                    return;
                }
                console.error(`Failed to regenerate ${section}:`, e);
            } finally {
                window.clearTimeout(timeout);
                setRegenerating((prev) => ({ ...prev, [section]: false }));
            }
        },
        [gen.result, model, gen.updateResult],
    );

    const handleRegenerateAll = useCallback(async () => {
        if (!gen.result) return;
        const sections: RegenerableSection[] = ["styles", "exclude_styles", "lyrics", "analysis"];
        await Promise.allSettled(sections.map((s) => handleRegenerate(s)));
    }, [gen.result, handleRegenerate]);

    const handleGenerate = () => {
        gen.generate(model);
    };

    const handleInjectStyle = useCallback(
        (styleText: string) => {
            gen.updateBuilderField("styleInfluences", styleText);
        },
        [gen.updateBuilderField],
    );

    // Library handlers
    const handleOpenSong = (id: string) => setOpenSongId(id);
    const handleCloseSong = () => setOpenSongId(null);
    const handleEditSong = (entry: SongEntry) => {
        setEditingSongId(entry.id);
        // Load inputs back into gen state, then navigate to Create
        gen.reset();
        gen.setTopMode(entry.mode);
        if (entry.mode === "oneshot") {
            gen.setInput(entry.oneshotInput || "");
        } else {
            gen.setBuilderInputs(entry.builderInputs || EMPTY_BUILDER);
        }
        setOpenSongId(null);
        setActiveTab("create");
    };

    const handleSaveStyle = gen.topMode === "builder" ? saveStyle : undefined;
    const isComplete = gen.step === "complete" && gen.result !== null;

    useEffect(() => {
        if (tourOpen) setTourOfferOpen(false);
    }, [tourOpen]);

    const renderCreateView = () => {
        if (gen.loading) {
            return <LoadingView modelName={getModelDisplayName(model)} />;
        }

        if (isComplete) {
            return (
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center" }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={gen.reset}
                            color="primary"
                            size="small"
                        >
                            New song
                        </Button>
                    </Box>
                    <Box sx={{ flex: 1, overflow: "auto" }}>
                        <OutputPanel
                            result={gen.result}
                            loading={false}
                            genres={gen.builderInputs.genres}
                            modelName={getModelDisplayName(model)}
                            onUpdateResult={gen.updateResult}
                            onSaveStyle={handleSaveStyle}
                            onRegenerate={handleRegenerate}
                            onRegenerateAll={handleRegenerateAll}
                            regenerating={regenerating}
                        />
                    </Box>
                </Box>
            );
        }

        return (
            <InputPanel
                topMode={gen.topMode}
                input={gen.input}
                builderInputs={gen.builderInputs}
                loading={false}
                modelName={getModelDisplayName(model)}
                savedStyles={savedStyles}
                onTopModeChange={gen.setTopMode}
                onInputChange={gen.setInput}
                onBuilderChange={gen.updateBuilderField}
                onGenerate={handleGenerate}
                onInjectStyle={handleInjectStyle}
                onRenameStyle={renameStyle}
                onDeleteStyle={deleteStyle}
            />
        );
    };

    const renderLibraryView = () => {
        if (openedSong) {
            return (
                <SongDetailView
                    entry={openedSong}
                    model={model}
                    modelName={getModelDisplayName(model)}
                    onBack={handleCloseSong}
                    onUpdate={library.updateSong}
                    onDelete={(id) => {
                        library.deleteSong(id);
                        handleCloseSong();
                    }}
                    onTogglePin={library.togglePin}
                    onEdit={handleEditSong}
                />
            );
        }
        return (
            <LibraryView
                recent={library.recent}
                pinned={library.pinned}
                onOpen={handleOpenSong}
                onTogglePin={library.togglePin}
            />
        );
    };

    return (
        <ErrorBoundary>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    overflow: "hidden",
                    bgcolor: "background.default",
                    color: "text.primary",
                }}
            >
                <Box sx={{ flex: 1, minHeight: 0, pb: 7 }}>
                    <Fade in key={activeTab} timeout={200} appear={false}>
                        <Box sx={{ height: "100%" }}>
                            {activeTab === "library" && renderLibraryView()}
                            {activeTab === "create" && renderCreateView()}
                            {activeTab === "settings" && (
                                <SettingsView
                                    apiKey={apiKey}
                                    onApiKeyChange={setApiKey}
                                    model={model}
                                    onModelChange={setModel}
                                    onRestartTour={handleRestartTour}
                                    onClearLibrary={library.clearAll}
                                    libraryCount={library.songs.length}
                                />
                            )}
                        </Box>
                    </Fade>
                </Box>

                <Paper
                    elevation={3}
                    sx={{
                        position: "fixed",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 0,
                        zIndex: (t) => t.zIndex.appBar,
                    }}
                >
                    <BottomNavigation
                        showLabels
                        value={activeTab}
                        onChange={(_e, value: Tab) => {
                            setActiveTab(value);
                            if (value !== "library") setOpenSongId(null);
                        }}
                    >
                        <BottomNavigationAction
                            value="library"
                            label="Library"
                            icon={<LibraryMusicOutlinedIcon />}
                            data-tour="library"
                        />
                        <BottomNavigationAction
                            value="create"
                            label="Create"
                            icon={<EditOutlinedIcon />}
                            data-tour="create"
                        />
                        <BottomNavigationAction
                            value="settings"
                            label="Settings"
                            icon={<SettingsOutlinedIcon />}
                            data-tour="settings"
                        />
                    </BottomNavigation>
                </Paper>
            </Box>

            <Snackbar
                open={Boolean(gen.error) && !tourOpen && !showWelcome && !showApiKey}
                autoHideDuration={6000}
                onClose={() => { /* error clears on next generate() */ }}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                sx={{ bottom: { xs: 72, sm: 72 } }}
            >
                <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
                    {gen.error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={tourOfferOpen}
                onClose={() => {}}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                sx={{ bottom: { xs: 72, sm: 72 } }}
            >
                <Alert
                    severity="info"
                    variant="filled"
                    sx={{ width: "100%", alignItems: "center" }}
                    action={
                        <>
                            <Button color="inherit" size="small" onClick={handleSkipTour}>
                                Skip
                            </Button>
                            <Button color="inherit" size="small" onClick={handleAcceptTour}>
                                Take tour
                            </Button>
                        </>
                    }
                >
                    Take a 30-second tour?
                </Alert>
            </Snackbar>

            <WelcomeScreen open={showWelcome} onContinue={handleWelcomeContinue} />
            <ApiKeyModal open={showApiKey} onSave={handleApiKeySave} />
            <GuidedTour open={tourOpen} onFinish={handleTourFinish} />
        </ErrorBoundary>
    );
}
