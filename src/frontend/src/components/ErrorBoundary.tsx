import React from "react";

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
          <div className="glow-border rounded-lg p-8 max-w-md">
            <h1 className="glow-text font-display text-2xl mb-2">
              DJ System Error
            </h1>
            <p className="text-muted-foreground text-sm mb-4">
              Something went wrong. DJ is recovering.
            </p>
            <p className="text-xs text-red-400 mb-4 font-mono">
              {this.state.error?.message}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="rounded border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20"
            >
              Restart DJ
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
