"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  className?: string
}

export function ChatBubble({ className }: ChatBubbleProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [hasNotification, setHasNotification] = useState(false)
  const [isFirstOpen, setIsFirstOpen] = useState(true)

  useEffect(() => {
    // Show notification dot on first visit after login
    if (session?.user && !localStorage.getItem('chat-seen')) {
      setHasNotification(true)
    }

    const handleChatNotification = () => {
      setHasNotification(true)
    }

    window.addEventListener('show-chat-notification', handleChatNotification)
    return () => {
      window.removeEventListener('show-chat-notification', handleChatNotification)
    }
  }, [session])

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real implementation, this would send the message to your support system
      console.log('Message sent:', message)
      setMessage('')
      // You could add a toast notification here
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    setHasNotification(false)
    setIsFirstOpen(false)
    localStorage.setItem('chat-seen', 'true')
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-card border border-border rounded-lg shadow-2xl backdrop-blur-sm animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-medium text-foreground">Support Chat</h3>
              <p className="text-xs text-muted-foreground">We're here to help</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-3 h-64 overflow-y-auto">
            {!isFirstOpen ? (
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 rounded-lg text-sm border border-purple-400/30">
                <div className="font-medium text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  ReWork Support
                </div>
                <div className="text-slate-200 mb-3">
                  Welcome back! You have {session?.user?.resumesCreated || 0} resume{(session?.user?.resumesCreated || 0) !== 1 ? 's' : ''}. Here's what's new in ReWork:
                </div>
                <div className="text-sm text-slate-300 space-y-1">
                  <div>• ✨ New AI optimization engine</div>
                  <div>• 🎨 Updated dashboard design</div>
                  <div>• 🚀 Faster PDF processing</div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 p-3 rounded-lg text-sm border border-slate-700">
                <div className="font-medium text-white mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  ReWork Support
                </div>
                <div className="text-slate-300">
                  Hi! How can we help you today?
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                disabled={!message.trim()}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send
            </p>
          </div>
        </div>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <div className="relative">
          <Button
            onClick={handleOpen}
            size="lg"
            className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>

          {/* Notification Dot */}
          {hasNotification && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-pulse" />
          )}
        </div>
      )}
    </div>
  )
}