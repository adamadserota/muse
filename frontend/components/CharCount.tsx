import { Typography } from "@mui/material";

interface CharCountProps {
    current: number;
    max: number;
}

export function CharCount({ current, max }: CharCountProps) {
    const ratio = current / max;
    const color = ratio > 1 ? "error.main" : ratio > 0.9 ? "warning.main" : "text.secondary";

    return (
        <Typography variant="caption" sx={{ color }}>
            {current.toLocaleString()} / {max.toLocaleString()}
        </Typography>
    );
}
