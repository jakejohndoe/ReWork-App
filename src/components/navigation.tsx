"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Settings, User, LogOut } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { useState } from "react"
import { SettingsModal } from "@/components/settings-modal"
import { LogoutModal } from "@/components/logout-modal"
import { UserAvatar } from "@/components/ui/avatar"

interface NavigationProps {
  className?: string
  showUserMenu?: boolean
  children?: React.ReactNode
}

export default function Navigation({ className = "", showUserMenu = true, children }: NavigationProps) {
  const { data: session } = useSession()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

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
              <Logo size="xs" variant="simple" showBadge={false} className="group-hover:scale-110 transition-all duration-300" />
              <span className="text-[15px] font-semibold text-slate-200 tracking-tight transition-all group-hover:text-white">
                ReWork
              </span>
            </Link>

            {/* Custom children content */}
            {children}

            {/* Right Side Actions */}
            {showUserMenu && session && (
              <div className="flex items-center space-x-2">
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  {/* Clickable User Avatar */}
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/5 transition-all group"
                    title="Account Settings"
                  >
                    <UserAvatar
                      userId={session.user?.id}
                      size="md"
                      className="group-hover:border-white/20 transition-colors"
                    />
                    <span className="text-[13px] text-slate-400 hidden sm:block group-hover:text-white transition-colors">
                      {session.user?.name?.split(' ')[0] || 'User'}
                    </span>
                  </button>

                  {/* Sign Out */}
                  <button
                    onClick={() => setIsLogoutOpen(true)}
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

      {/* Logout Modal */}
      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />

      {/* Spacer to prevent content from going under fixed nav */}
      <div style={{ height: 'var(--nav-height)' }} />
    </>
  )
}