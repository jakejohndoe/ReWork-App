"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Zap } from "lucide-react"

interface StatusBarProps {
  resumeCount?: number
  autoSaveStatus?: "saving" | "saved" | "error"
  className?: string
}

export default function StatusBar({ resumeCount, autoSaveStatus, className = "" }: StatusBarProps) {
  const { data: session } = useSession()
  const isPremium = session?.user?.plan === "PREMIUM"

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/80 backdrop-blur-md ${className}`}
      style={{ height: 'var(--status-bar-height)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[32px]">
          {/* Left Side - Plan Info or Auto-save Status */}
          <div className="flex items-center space-x-3 text-[12px]">
            {autoSaveStatus ? (
              <span className={`flex items-center gap-1.5 ${
                autoSaveStatus === 'saving' ? 'text-text-secondary' :
                autoSaveStatus === 'saved' ? 'text-success' :
                'text-destructive'
              }`}>
                {autoSaveStatus === 'saving' && (
                  <>
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
                    Saving...
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <span className="w-1.5 h-1.5 bg-current rounded-full" />
                    All changes saved
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <span className="w-1.5 h-1.5 bg-current rounded-full" />
                    Error saving changes
                  </>
                )}
              </span>
            ) : (
              <>
                <span className="text-text-secondary">
                  {isPremium ? 'Premium Plan' : 'Free Plan'}
                </span>
                {!isPremium && resumeCount !== undefined && (
                  <>
                    <span className="text-text-muted">•</span>
                    <span className="text-text-secondary">
                      {resumeCount}/3 resumes used
                    </span>
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Side - Upgrade Link */}
          {!isPremium && !autoSaveStatus && (
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 text-[12px] text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              Upgrade to Premium
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}