'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

export type FeedbackType = 'BUG_REPORT' | 'FEATURE_REQUEST' | 'GENERAL_FEEDBACK'

interface FeedbackData {
  type: FeedbackType
  message: string
  email?: string
}

interface FeedbackContextType {
  // Modal state
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  
  // Form state
  formData: FeedbackData
  setFormData: (data: Partial<FeedbackData>) => void
  resetForm: () => void
  
  // Submission
  isSubmitting: boolean
  submitFeedback: () => Promise<boolean>
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

export const useFeedback = () => {
  const context = useContext(FeedbackContext)
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}

const initialFormData: FeedbackData = {
  type: 'GENERAL_FEEDBACK',
  message: '',
  email: '',
}

interface FeedbackProviderProps {
  children: React.ReactNode
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormDataState] = useState<FeedbackData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const setFormData = useCallback((data: Partial<FeedbackData>) => {
    setFormDataState(prev => ({ ...prev, ...data }))
  }, [])

  const resetForm = useCallback(() => {
    setFormDataState(initialFormData)
  }, [])

  const submitFeedback = useCallback(async (): Promise<boolean> => {
    if (!formData.message.trim()) {
      toast.error('Please enter a message')
      return false
    }

    if (formData.message.length < 10) {
      toast.error('Message must be at least 10 characters')
      return false
    }

    if (formData.email && !isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          message: formData.message.trim(),
          email: formData.email?.trim() || undefined,
          pageUrl: window.location.href,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit feedback')
      }

      toast.success('Thank you! Your feedback has been submitted.')
      resetForm()
      closeModal()
      return true
      
    } catch (error) {
      console.error('Feedback submission error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit feedback')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, resetForm, closeModal])

  const value: FeedbackContextType = {
    isOpen,
    openModal,
    closeModal,
    formData,
    setFormData,
    resetForm,
    isSubmitting,
    submitFeedback,
  }

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  )
}

// Helper function for email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}