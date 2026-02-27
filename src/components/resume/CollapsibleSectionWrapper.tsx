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
  defaultOpen?: boolean
  className?: string
}

export const CollapsibleSectionWrapper: React.FC<CollapsibleSectionWrapperProps> = ({
  title,
  icon,
  children,
  isComplete = false,
  defaultOpen = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card className={`bg-slate-800/30 border border-white/10 hover:border-white/20 transition-all ${className}`}>
      <CardHeader
        className="cursor-pointer hover:bg-white/5 transition-all p-4 rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg transition-colors ${isComplete ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
              {icon}
            </div>
            <div className="flex items-center gap-3">
              <h3 className="text-[15px] font-semibold text-slate-200">{title}</h3>
              <div className={`w-2 h-2 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-gray-600'}`}
                   title={isComplete ? 'Section complete' : 'Section incomplete'}></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isComplete && (
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
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