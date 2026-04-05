import React, { type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details (could send to logging service)
    console.error('Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full rounded-lg border border-error-container bg-error-container/10 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-error text-2xl flex-shrink-0">
              warning
            </span>
            <div>
              <h3 className="font-headline font-bold text-error mb-2">
                {this.props.fallback || 'Widget Failed to Load'}
              </h3>
              <p className="text-sm text-on-surface-variant">
                {this.state.errorMessage || 'This component encountered an error. Please try refreshing the page.'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
