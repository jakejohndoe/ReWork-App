'use client'

import React from 'react'
import { useFeedback, FeedbackType } from '@/contexts/feedback-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MessageSquare, Bug, Lightbulb, Send, ExternalLink } from 'lucide-react'

const feedbackTypeOptions = [
  {
    value: 'BUG_REPORT' as FeedbackType,
    label: 'Bug Report',
    icon: Bug,
    description: 'Something isn\'t working correctly',
  },
  {
    value: 'FEATURE_REQUEST' as FeedbackType,
    label: 'Feature Request',
    icon: Lightbulb,
    description: 'Suggest a new feature or improvement',
  },
  {
    value: 'GENERAL_FEEDBACK' as FeedbackType,
    label: 'General Feedback',
    icon: MessageSquare,
    description: 'Share your thoughts about the app',
  },
]

export const FeedbackModal: React.FC = () => {
  const {
    isOpen,
    closeModal,
    formData,
    setFormData,
    isSubmitting,
    submitFeedback,
  } = useFeedback()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitFeedback()
  }

  const selectedOption = feedbackTypeOptions.find(option => option.value === formData.type)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Quick Feedback
            </span>
          </DialogTitle>
          <p className="text-slate-400 mt-2">
            Help us improve ReWork by sharing your thoughts
          </p>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Feedback Type */}
          <div className="space-y-2">
            <Label htmlFor="feedback-type" className="text-white font-medium">
              What type of feedback do you have?
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: FeedbackType) => setFormData({ type: value })}
            >
              <SelectTrigger className="glass-card border-white/20 text-white">
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {feedbackTypeOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-white hover:bg-slate-700 focus:bg-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-slate-400">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ message: e.target.value })}
              placeholder="Tell us what happened or what you'd like to see..."
              className="glass-card border-white/20 text-white placeholder-slate-400 min-h-[120px] resize-none"
              required
            />
            <div className="text-xs text-slate-500">
              {formData.message.length}/2000 characters
            </div>
          </div>

          {/* Email (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">
              Email (optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              placeholder="your@email.com (optional)"
              className="glass-card border-white/20 text-white placeholder-slate-400"
            />
            <div className="text-xs text-slate-500">
              Leave empty to submit anonymously
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.message.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Send Feedback</span>
                </div>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={closeModal}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>

          {/* Footer Link */}
          <div className="pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => window.open('https://reworksolutions.canny.io/', '_blank', 'noopener,noreferrer')}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
            >
              <span>View Feature Roadmap</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackModal