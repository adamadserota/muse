import { useState, useCallback } from "react";
import { Button } from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckIcon from "@mui/icons-material/Check";

interface CopyButtonProps {
    text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard denied
        }
    }, [text]);

    return (
        <Button
            size="small"
            variant="outlined"
            onClick={handleCopy}
            startIcon={copied ? <CheckIcon fontSize="small" /> : <ContentCopyOutlinedIcon fontSize="small" />}
            color={copied ? "primary" : "inherit"}
            sx={{ minWidth: 0 }}
        >
            {copied ? "Copied" : "Copy"}
        </Button>
    );
}
