"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Settings, User, LogOut } from "lucide-react"
import { useState } from "react"
import { SettingsModal } from "@/components/settings-modal"

interface NavigationProps {
  className?: string
  showUserMenu?: boolean
}

export default function Navigation({ className = "", showUserMenu = true }: NavigationProps) {
  const { data: session } = useSession()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-slate-900/30 ${className}`}
        style={{ height: 'var(--nav-height)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[52px]">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 group"
            >
              <span className="text-[15px] font-semibold text-slate-200 tracking-tight transition-all group-hover:text-white">
                ReWork
              </span>
            </Link>

            {/* Right Side Actions */}
            {showUserMenu && session && (
              <div className="flex items-center space-x-2">
                {/* Settings Button */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-slate-400 hover:text-white transition-all rounded-md hover:bg-white/5"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-3 ml-1 border-l border-white/6">
                  {/* User Avatar */}
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="text-[13px] text-slate-400 hidden sm:block">
                      {session.user?.name?.split(' ')[0] || 'User'}
                    </span>
                  </div>

                  {/* Sign Out */}
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-slate-400 hover:text-white transition-all rounded-md hover:bg-white/5"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Spacer to prevent content from going under fixed nav */}
      <div style={{ height: 'var(--nav-height)' }} />
    </>
  )
}