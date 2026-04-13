import { Component, type ReactNode, type ErrorInfo } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 4,
                        bgcolor: "background.default",
                    }}
                >
                    <Stack
                        spacing={2}
                        sx={{ alignItems: "center", maxWidth: 420, textAlign: "center" }}
                    >
                        <Typography variant="h5" color="text.primary">
                            Something went wrong
                        </Typography>
                        <Typography variant="body2" color="error.main">
                            {this.state.error?.message || "Unknown error"}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => this.setState({ hasError: false, error: null })}
                            aria-label="Retry after error"
                        >
                            Retry
                        </Button>
                    </Stack>
                </Box>
            );
        }
        return this.props.children;
    }
}
