'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"

interface FloatingFeedbackButtonProps {
  className?: string
}

export const FloatingFeedbackButton: React.FC<FloatingFeedbackButtonProps> = ({ className = "" }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleFeedbackClick = () => {
    console.log('Floating feedback button clicked!')
    window.open('https://reworksolutions.canny.io/', '_blank', 'noopener,noreferrer')
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      <div className="relative group">
        {/* Floating Feedback Button */}
        <button
          onClick={handleFeedbackClick}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 relative cursor-pointer z-10 flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {/* Close Button (appears on hover) */}
        <Button
          onClick={(e) => {
            e.stopPropagation()
            console.log('Close button clicked!')
            handleClose()
          }}
          variant="ghost"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 p-0 cursor-pointer"
        >
          <X className="w-3 h-3" />
        </Button>

        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-slate-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap border border-slate-600">
          Give Feedback
          <div className="absolute top-full right-4 w-2 h-2 bg-slate-800 border-r border-b border-slate-600 transform rotate-45 -translate-y-1"></div>
        </div>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-ping opacity-20 pointer-events-none"></div>
      </div>
    </div>
  )
}

export default FloatingFeedbackButton