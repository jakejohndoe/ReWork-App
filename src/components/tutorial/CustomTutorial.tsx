'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, ArrowLeft, ArrowRight, Play, SkipForward } from 'lucide-react'

interface TutorialStep {
  id: string
  target: string
  title: string
  content: string
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center'
  page: string
  showProgress?: boolean
}

interface TutorialContextType {
  run: boolean
  currentStep: number
  resumeUploaded: boolean
  setResumeUploaded: (uploaded: boolean) => void
  startTutorial: () => void
  skipTutorial: () => void
  nextStep: () => void
  prevStep: () => void
  isVisible: boolean
  tutorialActive: boolean
  setTutorialActive: (active: boolean) => void
  advanceToStep: (stepIndex: number) => void
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined)

export const useTutorial = () => {
  const context = useContext(TutorialContext)
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider')
  }
  return context
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'dashboard-welcome',
    target: '',
    title: 'Welcome to ReWork! 🎉',
    content: 'This tutorial will guide you through creating your first AI-optimized resume. We\'ll walk through each step: uploading your resume, adding job details, getting AI suggestions, and downloading your optimized resume.',
    placement: 'center',
    page: '/dashboard',
    showProgress: true
  },
  {
    id: 'upload-resume',
    target: '',
    title: 'Step 1: Upload Your Resume 📄',
    content: 'Click the "Create New Resume" button to upload your existing resume PDF. Don\'t worry if it\'s not perfect - our AI will help optimize it!',
    placement: 'center',
    page: '/dashboard',
    showProgress: true
  },
  {
    id: 'auto-fill',
    target: '',
    title: 'Step 2: Fill Out Your Information ✨',
    content: 'Use the "Auto-fill from PDF" button to quickly populate your resume sections. Then complete any missing information in the contact, summary, work experience, education, and skills sections.',
    placement: 'center',
    page: 'edit',
    showProgress: true
  },
  {
    id: 'continue-job',
    target: '',
    title: 'Step 3: Continue to Job Description 🎯',
    content: 'Once you\'ve filled out your resume information, click the "Next: Job Description" button at the bottom of the page to continue.',
    placement: 'center',
    page: 'edit',
    showProgress: true
  },
  {
    id: 'job-form',
    target: '',
    title: 'Step 4: Enter Job Details 💼',
    content: 'Fill in the job posting details: job title, company name, location, and paste the full job description. The more details you provide, the better our AI can optimize your resume.',
    placement: 'center',
    page: 'job-description',
    showProgress: true
  },
  {
    id: 'start-analysis',
    target: '',
    title: 'Step 5: Start AI Analysis 🤖',
    content: 'Click "Start AI Analysis" to begin the optimization process. This may take 60-90 seconds as our AI analyzes the job requirements and optimizes your resume.',
    placement: 'center',
    page: 'job-description',
    showProgress: true
  },
  {
    id: 'suggestions',
    target: '',
    title: 'Step 6: Review AI Suggestions 🔄',
    content: 'Review the AI suggestions and apply the ones you like. You can swap individual sections, apply all suggestions, or reset changes. Watch your compatibility score improve!',
    placement: 'center',
    page: 'analysis',
    showProgress: true
  },
  {
    id: 'finalize',
    target: '',
    title: 'Step 7: Finalize & Download 🎨',
    content: 'Choose your template, customize colors, preview your optimized resume, and download when ready. Congratulations - you\'ve created your first AI-optimized resume!',
    placement: 'center',
    page: 'finalize',
    showProgress: true
  }
]

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [run, setRun] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [tutorialActive, setTutorialActive] = useState(false)

  // Helper function to determine current page type
  const getCurrentPageType = (path: string) => {
    if (path === '/dashboard') return '/dashboard'
    if (path?.includes('/dashboard/resume/') && path?.match(/\/dashboard\/resume\/[^\/]+$/)) return 'edit'
    if (path?.includes('/job-description')) return 'job-description'
    if (path?.includes('/analysis')) return 'analysis'
    if (path?.includes('/finalize')) return 'finalize'
    return null
  }

  // Load tutorial state from localStorage
  useEffect(() => {
    if (session?.user?.email) {
      const tutorialCompleted = localStorage.getItem(`tutorial_completed_${session.user.email}`)
      const activeTutorialStep = localStorage.getItem(`tutorial_step_${session.user.email}`)
      const tutorialInProgress = localStorage.getItem(`tutorial_active_${session.user.email}`)
      
      if (!tutorialCompleted && tutorialInProgress === 'true') {
        setTutorialActive(true)
        if (activeTutorialStep) {
          setCurrentStep(parseInt(activeTutorialStep))
        }
      }
    }
  }, [session])

  // Auto-start tutorial for new users on dashboard (only once)
  useEffect(() => {
    if (session?.user?.email && pathname === '/dashboard') {
      const tutorialCompleted = localStorage.getItem(`tutorial_completed_${session.user.email}`)
      const hasSeenTutorial = localStorage.getItem(`tutorial_seen_${session.user.email}`)
      const tutorialDismissed = localStorage.getItem(`tutorial_dismissed_${session.user.email}`)

      // Only show tutorial if: not completed, not dismissed, and not seen before
      if (!tutorialCompleted && !tutorialDismissed && !hasSeenTutorial) {
        localStorage.setItem(`tutorial_seen_${session.user.email}`, 'true')
        setTimeout(() => {
          setTutorialActive(true)
          setRun(true)
          setIsVisible(true)
          localStorage.setItem(`tutorial_active_${session.user.email}`, 'true')
          localStorage.setItem(`tutorial_step_${session.user.email}`, '0')
        }, 1500)
      }
    }
  }, [session, pathname])

  // Simple cross-page tutorial continuation
  useEffect(() => {
    if (tutorialActive && session?.user?.email) {
      const currentPageType = getCurrentPageType(pathname)
      const currentTutorialStep = tutorialSteps[currentStep]
      
      // Show tutorial if current step matches current page
      if (currentTutorialStep && currentPageType === currentTutorialStep.page) {
        setTimeout(() => {
          setRun(true)
          setIsVisible(true)
        }, 500) // Short delay for page load
      } else {
        setIsVisible(false)
        setRun(false)
      }
    }
  }, [pathname, currentStep, tutorialActive, session])

  // Handle resume upload to advance tutorial
  useEffect(() => {
    if (resumeUploaded && tutorialActive && currentStep === 1) {
      // User uploaded resume, advance to edit page steps
      setTimeout(() => {
        setCurrentStep(2)
        if (session?.user?.email) {
          localStorage.setItem(`tutorial_step_${session.user.email}`, '2')
        }
      }, 1000)
    }
  }, [resumeUploaded, tutorialActive, currentStep, session])

  const currentTutorialStep = tutorialSteps[currentStep]
  const currentPageType = getCurrentPageType(pathname)
  const isCurrentPage = currentTutorialStep && currentPageType === currentTutorialStep.page

  const startTutorial = useCallback(() => {
    setTutorialActive(true)
    setRun(true)
    setIsVisible(true)
    setCurrentStep(0)
    if (session?.user?.email) {
      localStorage.setItem(`tutorial_active_${session.user.email}`, 'true')
      localStorage.setItem(`tutorial_step_${session.user.email}`, '0')
    }
  }, [session])

  const skipTutorial = useCallback(() => {
    setTutorialActive(false)
    setRun(false)
    setIsVisible(false)
    if (session?.user?.email) {
      localStorage.setItem(`tutorial_completed_${session.user.email}`, 'true')
      localStorage.removeItem(`tutorial_active_${session.user.email}`)
      localStorage.removeItem(`tutorial_step_${session.user.email}`)
    }
  }, [session])

  const nextStep = useCallback(() => {
    if (currentStep < tutorialSteps.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      
      if (session?.user?.email) {
        localStorage.setItem(`tutorial_step_${session.user.email}`, newStep.toString())
      }
    } else {
      skipTutorial()
    }
  }, [currentStep, session, skipTutorial])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      
      if (session?.user?.email) {
        localStorage.setItem(`tutorial_step_${session.user.email}`, newStep.toString())
      }
    }
  }, [currentStep, session])

  const advanceToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < tutorialSteps.length && tutorialActive) {
      setCurrentStep(stepIndex)
      
      if (session?.user?.email) {
        localStorage.setItem(`tutorial_step_${session.user.email}`, stepIndex.toString())
      }
      
      // Check if we should show tutorial on current page
      const currentPageType = getCurrentPageType(pathname)
      const stepPage = tutorialSteps[stepIndex]?.page
      
      if (stepPage === currentPageType) {
        setTimeout(() => {
          setRun(true)
          setIsVisible(true)
        }, 500)
      }
    }
  }, [tutorialActive, session, pathname])

  return (
    <TutorialContext.Provider value={{
      run,
      currentStep,
      resumeUploaded,
      setResumeUploaded,
      startTutorial,
      skipTutorial,
      nextStep,
      prevStep,
      isVisible,
      tutorialActive,
      setTutorialActive,
      advanceToStep
    }}>
      {children}
      
      {/* Custom Tutorial Overlay */}
      {run && isVisible && isCurrentPage && currentTutorialStep && tutorialActive && (
        <TutorialOverlay
          step={currentTutorialStep}
          currentStep={currentStep}
          totalSteps={tutorialSteps.length}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipTutorial}
        />
      )}
    </TutorialContext.Provider>
  )
}

interface TutorialOverlayProps {
  step: TutorialStep
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip
}) => {
  // Simple escape key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onSkip()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSkip])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Simple tutorial card - no complex overlays */}
      <Card className="w-full max-w-md bg-slate-900 border border-purple-500/30 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-400">{step.title}</h3>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-slate-300 mb-6 leading-relaxed">{step.content}</p>
          
          {step.showProgress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Simple, clearly positioned buttons */}
          <div className="flex justify-between gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={onSkip}
              className="flex-1"
            >
              Exit Tutorial
            </Button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={onPrev}>
                  Back
                </Button>
              )}
              <Button 
                onClick={onNext}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-slate-400 text-center">
            Step {currentStep + 1} of {totalSteps} • Press Esc to exit
          </div>
        </CardContent>
      </Card>
    </div>
  )
}