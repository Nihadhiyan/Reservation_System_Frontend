import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <AlertTriangle className="size-8 text-[var(--destructive)]" />
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <Button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
