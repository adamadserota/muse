import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { TopMode } from "../types";

interface TopModeToggleProps {
    topMode: TopMode;
    onChange: (mode: TopMode) => void;
}

export function TopModeToggle({ topMode, onChange }: TopModeToggleProps) {
    return (
        <ToggleButtonGroup
            value={topMode}
            exclusive
            onChange={(_e, next: TopMode | null) => {
                if (next) onChange(next);
            }}
            size="small"
            color="primary"
            fullWidth
            aria-label="Input mode"
        >
            <ToggleButton value="oneshot" aria-label="One-shot mode">
                One-shot
            </ToggleButton>
            <ToggleButton value="builder" aria-label="Builder mode">
                Builder
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
