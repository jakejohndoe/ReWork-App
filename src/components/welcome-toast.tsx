"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export function WelcomeToast() {
  const { data: session } = useSession()
  const [hasShownWelcome, setHasShownWelcome] = useState(false)

  useEffect(() => {
    if (!session?.user || hasShownWelcome) return

    // Check if we've already shown welcome in this session
    const sessionKey = `welcome-shown-${session.user.id}`
    const hasShownThisSession = sessionStorage.getItem(sessionKey) === 'true'

    if (hasShownThisSession) {
      setHasShownWelcome(true)
      return
    }

    // Show welcome toast after a brief delay
    const timer = setTimeout(() => {
      const firstName = session.user.name?.split(' ')[0] || 'there'
      toast.success(`Welcome back, ${firstName}! 👋`, {
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white'
        }
      })

      // Mark as shown for this session
      sessionStorage.setItem(sessionKey, 'true')
      setHasShownWelcome(true)

      // Trigger chat bubble notification
      const event = new CustomEvent('show-chat-notification')
      window.dispatchEvent(event)
    }, 1000)

    return () => clearTimeout(timer)
  }, [session, hasShownWelcome])

  return null
}