"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"
import { TutorialProvider } from "@/components/tutorial/CustomTutorial"
import { FeedbackProvider } from "@/contexts/feedback-context"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <FeedbackProvider>
        <TutorialProvider>
          {children}
        </TutorialProvider>
      </FeedbackProvider>
      <Toaster />
    </SessionProvider>
  )
}