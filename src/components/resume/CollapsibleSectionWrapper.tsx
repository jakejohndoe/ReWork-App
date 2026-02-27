// src/components/resume/CollapsibleSectionWrapper.tsx
"use client"

import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface CollapsibleSectionWrapperProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  isComplete?: boolean
  completionPercentage?: number
  defaultOpen?: boolean
  className?: string
}

export const CollapsibleSectionWrapper: React.FC<CollapsibleSectionWrapperProps> = ({
  title,
  icon,
  children,
  isComplete,
  completionPercentage = 0,
  defaultOpen = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Determine completion status based on percentage or isComplete prop
  const isCompleted = isComplete !== undefined ? isComplete : completionPercentage >= 85

  // Determine status color based on completion percentage
  const getStatusColor = () => {
    if (completionPercentage >= 85) return 'text-emerald-400 bg-emerald-500/20'
    if (completionPercentage >= 50) return 'text-amber-400 bg-amber-500/20'
    return 'text-slate-400 bg-slate-600/20'
  }

  const getIconBgColor = () => {
    if (completionPercentage >= 85) return 'bg-emerald-500/20'
    if (completionPercentage >= 50) return 'bg-amber-500/20'
    return 'bg-slate-700/50'
  }

  return (
    <Card className={`bg-slate-800/30 border border-white/10 hover:border-white/20 transition-all ${className}`}>
      <CardHeader
        className="cursor-pointer hover:bg-white/5 transition-all p-4 rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg transition-colors ${getIconBgColor()}`}>
              {icon}
            </div>
            <div className="flex items-center gap-3">
              <h3 className="text-[15px] font-semibold text-slate-200">{title}</h3>
              {!isOpen && completionPercentage > 0 && (
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${getStatusColor()}`}>
                  {completionPercentage}%
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {completionPercentage >= 85 && (
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {completionPercentage > 0 && completionPercentage < 85 && (
              <div className={`w-2 h-2 rounded-full ${
                completionPercentage >= 50 ? 'bg-amber-400' : 'bg-slate-500'
              }`} />
            )}
            <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <CardContent className="pt-0 pb-6 px-6">
          <div className="border-t border-white/10 pt-6">
            {children}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}