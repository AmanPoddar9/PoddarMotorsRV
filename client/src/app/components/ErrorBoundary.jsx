'use client';

import React from 'react';
import Link from 'next/link';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import { event } from '../utils/analytics';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to analytics
    event({
      action: 'error',
      category: 'Error',
      label: `${error.toString()} - ${errorInfo.componentStack}`,
    });

    // Log to console
    console.error('Error caught by boundary:', error, errorInfo);

    // Send to error reporting service (optional)
    if (process.env.NEXT_PUBLIC_ERROR_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ERROR_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.toString(),
          errorInfo: errorInfo.componentStack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-custom-black via-custom-jet to-custom-black flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="glass-dark rounded-3xl p-12 border border-white/10">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/20 mb-8">
                <FaExclamationTriangle className="text-red-500 text-4xl" />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-custom-platinum text-lg mb-8 max-w-md mx-auto">
                We apologize for the inconvenience. Our team has been notified and is working on a fix.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-8 text-left glass-dark rounded-xl p-4 border border-white/10">
                  <summary className="cursor-pointer text-custom-accent font-semibold mb-2">
                    Error Details
                  </summary>
                  <pre className="text-xs text-custom-seasalt overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
                >
                  <FaRedo /> Try Again
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 glass-dark border border-white/20 text-white font-semibold rounded-xl hover:border-custom-accent transition-all"
                >
                  <FaHome /> Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
