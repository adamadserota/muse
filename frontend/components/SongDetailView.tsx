import { useState, useCallback } from "react";
import {
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText,
    Slide,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { OutputPanel } from "./OutputPanel";
import { regenerateSection } from "../services/apiClient";
import type { SongEntry, GenerateResponse, RegenerableSection } from "../types";

interface SongDetailViewProps {
    entry: SongEntry;
    model: string;
    modelName: string;
    onBack: () => void;
    onUpdate: (id: string, patch: Partial<Omit<SongEntry, "id" | "createdAt">>) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
    onEdit: (entry: SongEntry) => void;
}

function buildTextExport(entry: SongEntry): string {
    const r = entry.result;
    const title = entry.songTitle || "Untitled";
    const lines = [
        `# ${title}`,
        "",
        "## STYLE",
        r.styles || "—",
        "",
        "## EXCLUDE STYLES",
        r.exclude_styles || "—",
        "",
        "## LYRICS",
        r.lyrics || "—",
        "",
        "## ANALYSIS",
        `Vibe DNA: ${r.analysis.vibe_dna || "—"}`,
        `Phonetic Mapping: ${r.analysis.phonetic_mapping || "—"}`,
        `Semantic Weight: ${r.analysis.semantic_weight || "—"}`,
    ];
    return lines.join("\n");
}

function downloadText(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function SongDetailView({
    entry,
    model,
    modelName,
    onBack,
    onUpdate,
    onDelete,
    onTogglePin,
    onEdit,
}: SongDetailViewProps) {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [regenerating, setRegenerating] = useState<Record<RegenerableSection, boolean>>({
        styles: false,
        exclude_styles: false,
        lyrics: false,
        analysis: false,
    });

    const closeMenu = () => setMenuAnchor(null);

    const handleUpdateResult = useCallback(
        (patch: Partial<GenerateResponse>) => {
            onUpdate(entry.id, { result: { ...entry.result, ...patch } });
        },
        [entry.id, entry.result, onUpdate],
    );

    const handleRegenerateSection = useCallback(
        async (section: RegenerableSection) => {
            setRegenerating((prev) => ({ ...prev, [section]: true }));
            try {
                const patch = await regenerateSection({
                    section,
                    context: entry.result,
                    model,
                });
                onUpdate(entry.id, {
                    result: { ...entry.result, ...patch } as GenerateResponse,
                });
            } catch (e) {
                console.error(`Failed to regenerate ${section}:`, e);
            } finally {
                setRegenerating((prev) => ({ ...prev, [section]: false }));
            }
        },
        [entry.id, entry.result, model, onUpdate],
    );

    const handleRegenerateAll = useCallback(async () => {
        const sections: RegenerableSection[] = ["styles", "exclude_styles", "lyrics", "analysis"];
        await Promise.allSettled(sections.map((s) => handleRegenerateSection(s)));
    }, [handleRegenerateSection]);

    const handleDownload = () => {
        const filename = `${(entry.songTitle || "muse-song").replace(/[^\w\s-]/g, "")}.txt`;
        downloadText(filename, buildTextExport(entry));
        closeMenu();
    };

    const handleConfirmDelete = () => {
        if (window.confirm(`Delete "${entry.songTitle || "this song"}"? This can't be undone.`)) {
            onDelete(entry.id);
        }
        closeMenu();
    };

    return (
        <Slide direction="up" in mountOnEnter unmountOnExit timeout={250}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <Box
                sx={{
                    px: 2,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Button startIcon={<ArrowBackIcon />} onClick={onBack} size="small" color="primary">
                    Library
                </Button>
                <Box>
                    <IconButton
                        aria-label={entry.pinned ? "Unpin" : "Pin"}
                        onClick={() => onTogglePin(entry.id)}
                        color={entry.pinned ? "primary" : "default"}
                    >
                        {entry.pinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                    </IconButton>
                    <IconButton
                        aria-label="More actions"
                        onClick={(e) => setMenuAnchor(e.currentTarget)}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            </Box>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                <MenuItem
                    onClick={() => {
                        onEdit(entry);
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <EditOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit inputs</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleRegenerateAll();
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <RefreshIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Regenerate all sections</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDownload}>
                    <ListItemIcon>
                        <DownloadOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download as .txt</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleConfirmDelete} sx={{ color: "error.main" }}>
                    <ListItemIcon>
                        <DeleteOutlineIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            <Box sx={{ flex: 1, overflow: "auto" }}>
                <OutputPanel
                    result={entry.result}
                    loading={false}
                    genres={entry.builderInputs?.genres}
                    modelName={modelName}
                    onUpdateResult={handleUpdateResult}
                    onRegenerate={handleRegenerateSection}
                    onRegenerateAll={handleRegenerateAll}
                    regenerating={regenerating}
                />
            </Box>
        </Box>
        </Slide>
    );
}
