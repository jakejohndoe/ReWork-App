"use client"

import { useState, useEffect } from "react"
import { X, Download, Edit, Sparkles, Check, FileText } from "lucide-react"
import ResumePreview from "@/components/resume/templates/ResumePreview"
import TemplateSelector, { TemplateType } from "@/components/resume/templates/TemplateSelector"

interface ComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  jobTitle: string
  company: string
}

export default function ComparisonModal({
  isOpen,
  onClose,
  applicationId,
  jobTitle,
  company
}: ComparisonModalProps) {
  const [originalData, setOriginalData] = useState<any>(null)
  const [tailoredData, setTailoredData] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('classic')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !applicationId) return

    const fetchApplicationData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/resumes/applications/${applicationId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch application data')
        }

        const data = await response.json()

        if (data.success) {
          setOriginalData(data.originalContent)
          setTailoredData(data.optimizedStructured || data.optimizedContent)
        } else {
          throw new Error('Failed to load resume data')
        }
      } catch (err) {
        console.error('Error fetching application:', err)
        setError('Failed to load comparison data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplicationData()
  }, [isOpen, applicationId])

  const handleDownload = async () => {
    // Download the tailored version as PDF
    try {
      const response = await fetch(`/api/resumes/applications/${applicationId}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: selectedTemplate })
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${jobTitle.replace(/\s+/g, '_')}_${company.replace(/\s+/g, '_')}_Resume.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to download PDF. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-white/10 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200"
           style={{ width: '90vw', height: '85vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Resume Optimized for {jobTitle} at {company}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Compare your original and tailored versions side-by-side
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector */}
        <div className="px-6 py-3 border-b border-white/10 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">Preview Template:</div>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              className="scale-90"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100% - 140px)' }}>
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading comparison...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Original Resume - Left Column */}
              <div className="flex-1 flex flex-col border-r border-white/10" style={{ width: '48%' }}>
                <div className="px-4 py-2 bg-slate-800/50 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">Original</span>
                    <div className="text-xs text-slate-500">Before tailoring</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 opacity-70">
                  <div className="bg-white rounded-lg shadow-lg" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                    <ResumePreview
                      resumeData={originalData}
                      template={selectedTemplate}
                      className="pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tailored Resume - Right Column */}
              <div className="flex-1 flex flex-col" style={{ width: '48%' }}>
                <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Tailored
                    </span>
                    <div className="text-xs text-emerald-400">Optimized for this role</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="bg-white rounded-lg shadow-lg ring-2 ring-emerald-500/20"
                       style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                    <ResumePreview
                      resumeData={tailoredData}
                      template={selectedTemplate}
                      className="pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-3">
          <button
            onClick={() => {
              // Navigate to edit the tailored resume
              window.location.href = `/dashboard/resume/${tailoredData?.resumeId || applicationId}`
            }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-white/10 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Resume
          </button>
          <button
            onClick={handleDownload}
            disabled={!tailoredData}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}