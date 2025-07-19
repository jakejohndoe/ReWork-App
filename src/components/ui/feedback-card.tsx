'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, ExternalLink, Lightbulb, Bug, Heart } from "lucide-react"

interface FeedbackCardProps {
  className?: string
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ className = "" }) => {
  const handleFeedbackClick = () => {
    window.open('https://reworksolutions.canny.io/', '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className={`glass-card border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:scale-[1.02] ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">Help Improve ReWork</span>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Your feedback helps us build better features for everyone
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Bug className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <span className="font-medium">Found a bug?</span> Let us know what's not working
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <span className="font-medium">Have an idea?</span> Suggest new features or improvements
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageSquare className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <span className="font-medium">General feedback?</span> Share your thoughts on the app
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleFeedbackClick}
          className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Give Feedback
          <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
        </Button>
        
        <p className="text-xs text-slate-500 text-center">
          Opens Canny feedback board in new tab
        </p>
      </CardContent>
    </Card>
  )
}

export default FeedbackCard