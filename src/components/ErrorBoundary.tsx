import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: () => void;
}

/**
 * Keeps a failing subtree (e.g. a lazy chunk that won't load) from unmounting the whole page.
 * Renders `fallback` (nothing by default) and reports the failure once through `onError`.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    return this.state.hasError ? this.props.fallback ?? null : this.props.children;
  }
}
