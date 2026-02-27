'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900/50 border border-white/10 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-slate-400">
                Don't worry - your data is saved. You can reload the page or return to the dashboard.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-slate-800/50 rounded-lg text-left">
                <p className="text-xs font-mono text-red-400 mb-2">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-slate-500">
                    <summary className="cursor-pointer hover:text-slate-400">
                      Stack trace
                    </summary>
                    <pre className="mt-2 overflow-auto max-h-40 text-[10px]">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-md text-sm font-medium transition-all inline-flex items-center gap-2 border border-emerald-500/30"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Page
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm font-medium transition-all inline-flex items-center gap-2 border border-white/10"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Wrapper component for easier use in app directory
export default function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}