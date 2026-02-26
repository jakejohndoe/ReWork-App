"use client"

import { useEffect, useState } from 'react'

export const avatarOptions = {
  dev: '👨‍💻',
  design: '👨‍🎨',
  business: '👔',
  creative: '🎭',
  medical: '👨‍⚕️',
  education: '👨‍🏫',
  engineer: '👨‍🔧',
  chef: '👨‍🍳'
} as const

export type AvatarId = keyof typeof avatarOptions

interface UserAvatarProps {
  avatarId?: AvatarId | null
  userId?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function UserAvatar({ avatarId, userId, className = "", size = 'md' }: UserAvatarProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>('dev')

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-7 h-7 text-base',
    lg: 'w-16 h-16 text-2xl'
  }

  useEffect(() => {
    if (avatarId) {
      setSelectedAvatar(avatarId)
    } else if (userId && typeof window !== 'undefined') {
      // Load from localStorage as fallback
      const stored = localStorage.getItem(`avatar-${userId}`)
      if (stored && stored in avatarOptions) {
        setSelectedAvatar(stored as AvatarId)
      }
    }
  }, [avatarId, userId])

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center ${className}`}>
      <span className="select-none">
        {avatarOptions[selectedAvatar]}
      </span>
    </div>
  )
}

export function saveAvatarSelection(userId: string, avatarId: AvatarId) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`avatar-${userId}`, avatarId)
  }
}

export function getAvatarSelection(userId: string): AvatarId {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`avatar-${userId}`)
    if (stored && stored in avatarOptions) {
      return stored as AvatarId
    }
  }
  return 'dev'
}