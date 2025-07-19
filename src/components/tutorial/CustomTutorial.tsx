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
    target: '.dashboard-overview',
    title: 'Welcome to ReWork! 🎉',
    content: 'This is your dashboard where you can manage your resumes and track your optimization progress. Let\'s take a quick tour to help you create your first AI-optimized resume!',
    placement: 'center',
    page: '/dashboard',
    showProgress: true
  },
  {
    id: 'upload-resume',
    target: '.upload-resume-section',
    title: 'Upload Your Resume 📄',
    content: 'Start by uploading your existing resume PDF. Don\'t worry if it\'s not perfect - our AI will help optimize it! You can drag and drop or click to browse for your file.',
    placement: 'bottom',
    page: '/dashboard',
    showProgress: true
  },
  {
    id: 'auto-fill',
    target: '.auto-fill-section',
    title: 'Auto-Fill Your Information ✨',
    content: 'Click "Auto-fill from PDF" to quickly populate all sections with your existing resume data. Then review and complete each section - contact info, summary, work experience, education, and skills.',
    placement: 'bottom',
    page: 'edit',
    showProgress: true
  },
  {
    id: 'continue-job',
    target: '.continue-to-job-button',
    title: 'Add Job Details 🎯',
    content: 'Once you\'ve filled out your resume information, click here to continue to the job description page.',
    placement: 'top',
    page: 'edit',
    showProgress: true
  },
  {
    id: 'job-form',
    target: '.job-description-form',
    title: 'Enter Job Details 💼',
    content: 'Fill in all the job details you can find from the job posting: job title, company name, location, full job description, requirements, and benefits.',
    placement: 'right',
    page: 'job-description',
    showProgress: true
  },
  {
    id: 'start-analysis',
    target: '.start-ai-analysis-button',
    title: 'Start AI Analysis 🤖',
    content: 'This is where the magic happens! Click here to start the AI analysis. Note: This process may take 60-90 seconds as our AI optimizes your resume for this specific job.',
    placement: 'top',
    page: 'job-description',
    showProgress: true
  },
  {
    id: 'suggestions',
    target: '.suggestions-interface',
    title: 'Review AI Suggestions 🔄',
    content: 'Here you can swap individual sections with AI suggestions, apply all optimizations at once, reset changes if needed, and watch your compatibility score improve!',
    placement: 'left',
    page: 'analysis',
    showProgress: true
  },
  {
    id: 'finalize',
    target: '.finalize-options',
    title: 'Finalize Your Resume 🎨',
    content: 'Almost done! Here you can choose from different templates, customize colors to match your style, preview your optimized resume, and download when you\'re ready! Congratulations! You\'ve created your first AI-optimized resume! 🎉',
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

  // Auto-start tutorial for new users on dashboard
  useEffect(() => {
    if (session?.user?.email && pathname === '/dashboard') {
      const tutorialCompleted = localStorage.getItem(`tutorial_completed_${session.user.email}`)
      const hasSeenTutorial = localStorage.getItem(`tutorial_seen_${session.user.email}`)
      
      if (!tutorialCompleted && !hasSeenTutorial) {
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

  // Handle cross-page tutorial continuation and auto-advancement
  useEffect(() => {
    if (tutorialActive && session?.user?.email) {
      const currentPageType = getCurrentPageType(pathname)
      const currentTutorialStep = tutorialSteps[currentStep]
      
      console.log('Tutorial Debug:', {
        currentPageType,
        currentStep,
        currentTutorialStep: currentTutorialStep?.id,
        tutorialActive,
        pathname
      })
      
      // Auto-advance tutorial based on page navigation
      if (currentPageType && currentTutorialStep && currentPageType !== currentTutorialStep.page) {
        // User navigated to a different page, find the appropriate step
        const nextStepIndex = tutorialSteps.findIndex(step => step.page === currentPageType)
        if (nextStepIndex !== -1 && nextStepIndex > currentStep) {
          console.log('Auto-advancing tutorial to step:', nextStepIndex)
          // Advance to the step for this page
          setCurrentStep(nextStepIndex)
          localStorage.setItem(`tutorial_step_${session.user.email}`, nextStepIndex.toString())
        }
      }
      
      // Check if we should show tutorial on this page
      if (currentPageType) {
        const stepForThisPage = tutorialSteps.find((step, index) => 
          step.page === currentPageType && index >= currentStep
        )
        
        if (stepForThisPage) {
          console.log('Showing tutorial step:', stepForThisPage.id)
          setTimeout(() => {
            setRun(true)
            setIsVisible(true)
          }, 800) // Delay to ensure page has loaded
        } else {
          console.log('No tutorial step for this page, hiding tutorial')
          setIsVisible(false)
          setRun(false)
        }
      } else {
        console.log('Unknown page type, hiding tutorial')
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
      
      // Check if next step is on a different page
      const nextStepPage = tutorialSteps[newStep]?.page
      const currentPageType = getCurrentPageType(pathname)
      
      if (nextStepPage !== currentPageType) {
        // Hide tutorial until user navigates to the correct page
        setRun(false)
        setIsVisible(false)
        
        // Show a brief hint about continuing the tutorial
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('tutorial_hint', `Tutorial will continue on the next page!`)
          setTimeout(() => localStorage.removeItem('tutorial_hint'), 5000)
        }
      }
    } else {
      skipTutorial()
    }
  }, [currentStep, pathname, session, skipTutorial])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      
      if (session?.user?.email) {
        localStorage.setItem(`tutorial_step_${session.user.email}`, newStep.toString())
      }
      
      // Check if previous step is on a different page
      const prevStepPage = tutorialSteps[newStep]?.page
      const currentPageType = getCurrentPageType(pathname)
      
      if (prevStepPage !== currentPageType) {
        setRun(false)
        setIsVisible(false)
      }
    }
  }, [currentStep, pathname, session])

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
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [elementFound, setElementFound] = useState(false)

  // Add escape key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onSkip()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSkip])

  // Auto-skip if element not found after 5 seconds
  useEffect(() => {
    if (!elementFound) {
      const autoSkipTimer = setTimeout(() => {
        console.warn(`Tutorial auto-skipping step ${currentStep} - element not found after 5 seconds`)
        onNext()
      }, 5000)

      return () => clearTimeout(autoSkipTimer)
    }
  }, [elementFound, currentStep, onNext])

  useEffect(() => {
    // Reset element found flag when step changes
    setElementFound(false)
    
    // Wait a bit for the page to render before trying to find the element
    const findElement = () => {
      const element = document.querySelector(step.target) as HTMLElement
      if (element) {
        setTargetElement(element)
        setElementFound(true)
        element.style.position = 'relative'
        element.style.zIndex = '10001'
        element.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.5)'
        element.style.borderRadius = '8px'
        element.style.pointerEvents = 'auto'

        // Calculate tooltip position
        const rect = element.getBoundingClientRect()
        const tooltipWidth = 380
        const tooltipHeight = 200

        let top = rect.bottom + 10
        let left = rect.left + (rect.width / 2) - (tooltipWidth / 2)

        // Adjust for screen boundaries
        if (left < 10) left = 10
        if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10
        if (top + tooltipHeight > window.innerHeight - 10) top = rect.top - tooltipHeight - 10

        // For center placement
        if (step.placement === 'center') {
          top = (window.innerHeight / 2) - (tooltipHeight / 2)
          left = (window.innerWidth / 2) - (tooltipWidth / 2)
        }

        setTooltipPosition({ top, left })
      } else {
        // Element not found, center the tooltip as fallback
        console.warn(`Tutorial target element "${step.target}" not found`)
        setElementFound(false)
        setTooltipPosition({ 
          top: (window.innerHeight / 2) - 100, 
          left: (window.innerWidth / 2) - 190 
        })
      }
    }

    // Try immediately and with a small delay
    findElement()
    const timeoutId = setTimeout(findElement, 500)

    return () => {
      clearTimeout(timeoutId)
      const element = document.querySelector(step.target) as HTMLElement
      if (element) {
        element.style.position = ''
        element.style.zIndex = ''
        element.style.boxShadow = ''
        element.style.borderRadius = ''
        element.style.pointerEvents = ''
      }
    }
  }, [step])

  return (
    <>
      {/* Dark overlay - allows clicks through except on tooltip */}
      <div 
        className="fixed inset-0 bg-black/70 z-10000" 
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Tutorial tooltip */}
      <Card 
        className="fixed z-10002 w-96 bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl"
        style={{ 
          top: tooltipPosition.top, 
          left: tooltipPosition.left,
          pointerEvents: 'auto'
        }}
      >
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
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onSkip}>
                <SkipForward className="w-4 h-4 mr-1" />
                Skip Tour
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSkip}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <X className="w-4 h-4 mr-1" />
                Force Exit
              </Button>
            </div>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={onPrev}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              <Button 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                size="sm" 
                onClick={onNext}
              >
                {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-slate-400 text-center">
            Press <kbd className="px-1 py-0.5 bg-slate-700 rounded text-xs">Esc</kbd> to exit tutorial anytime
          </div>
        </CardContent>
      </Card>
    </>
  )
}