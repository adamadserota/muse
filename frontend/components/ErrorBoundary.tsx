import { Component, type ReactNode, type ErrorInfo } from "react";

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
                <div
                    style={{
                        padding: 32,
                        color: "var(--fui-error-100, #FF3333)",
                        fontFamily: "var(--fui-font, 'Chakra Petch', sans-serif)",
                        background: "var(--fui-bg, #00111A)",
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                    }}
                >
                    <h2 style={{ color: "var(--fui-text, #F5F5F5)" }}>Something went wrong</h2>
                    <pre style={{ color: "var(--fui-error-100, #FF3333)", fontSize: 14 }}>
                        {this.state.error?.message}
                    </pre>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{
                            background: "transparent",
                            border: "1px solid var(--fui-primary-100, #33FFFF)",
                            color: "var(--fui-primary-100, #33FFFF)",
                            padding: "8px 24px",
                            fontFamily: "var(--fui-font, 'Chakra Petch', sans-serif)",
                            cursor: "pointer",
                        }}
                        aria-label="Retry after error"
                    >
                        RETRY
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
