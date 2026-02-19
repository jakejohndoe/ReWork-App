"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import Navigation from "@/components/navigation"
import StatusBar from "@/components/status-bar"
import AutoFillButton from '@/components/auto-fill-button'
import ContactInfoSection from '@/components/resume/ContactInfoSection'
import WorkExperienceSection from '@/components/resume/WorkExperienceSection'
import SkillsSection from '@/components/resume/SkillsSection'
import EducationSection from '@/components/resume/EducationSection'
import ProfessionalSummarySection from '@/components/resume/ProfessionalSummarySection'
import { CollapsibleSectionWrapper } from '@/components/resume/CollapsibleSectionWrapper'
import { ContactInfo, StructuredResumeData, WorkExperience, SkillsStructure, Education, ProfessionalSummary } from '@/types/resume'
import ResumeLoader from '@/components/resume-loader'
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Download,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Link as LinkIcon,
  Loader2,
  X,
  Check,
  Undo2,
  Briefcase
} from "lucide-react"

// Professional Resume Preview Component
function SimpleResumePreview({ resumeData, resumeTitle, className = "" }: { resumeData: any, resumeTitle?: string, className?: string }) {
  const extractName = (contactInfo?: string | ContactInfo) => {
    if (contactInfo && typeof contactInfo === 'object') {
      const structured = contactInfo as ContactInfo
      return `${structured.firstName} ${structured.lastName}`.trim() || resumeTitle || 'Your Name'
    }
    if (!contactInfo || typeof contactInfo !== 'string') return resumeTitle || 'Your Name'
    const lines = contactInfo.split('\n').filter(line => line.trim())
    const nameLine = lines.find(line =>
      !line.includes('@') &&
      !line.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/) &&
      line.length > 2
    )
    return nameLine || resumeTitle || 'Your Name'
  }

  const getContactDetails = (contactInfo?: string | ContactInfo) => {
    if (contactInfo && typeof contactInfo === 'object') {
      const structured = contactInfo as ContactInfo
      return {
        email: structured.email || '',
        phone: structured.phone || '',
        location: structured.location || ''
      }
    }
    if (contactInfo && typeof contactInfo === 'string') {
      const lines = contactInfo.split('\n').filter(line => line.trim())
      return {
        email: lines.find(line => line.includes('@')) || '',
        phone: lines.find(line => line.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/)) || '',
        location: lines.find(line => !line.includes('@') && !line.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/) && line.length > 5) || ''
      }
    }
    return { email: '', phone: '', location: '' }
  }

  const name = extractName(resumeData?.contactInfo || resumeData?.contact)
  const contact = getContactDetails(resumeData?.contactInfo || resumeData?.contact)
  const hasResumeData = !!(resumeData?.contactInfo || resumeData?.summary || resumeData?.experience?.length)

  return (
    <div className={`bg-white text-gray-900 p-8 ${className}`}>
      {!hasResumeData ? (
        <div className="flex flex-col items-center justify-center h-[600px] text-gray-400">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Edit3 className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-lg font-medium text-gray-500 mb-2">No content yet</p>
          <p className="text-sm text-gray-400">Start editing to see your resume preview</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {contact.email && <span>{contact.email}</span>}
              {contact.phone && <span>{contact.phone}</span>}
              {contact.location && <span>{contact.location}</span>}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData?.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 uppercase tracking-wider">
                Professional Summary
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {resumeData?.experience?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                Experience
              </h2>
              {resumeData.experience.map((exp: any, index: number) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                      <p className="text-gray-600 text-sm">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">{exp.dates}</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                    {exp.achievements?.map((achievement: string, i: number) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resumeData?.education?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                Education
              </h2>
              {resumeData.education.map((edu: any, index: number) => (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600 text-sm">{edu.school}</p>
                  <p className="text-gray-500 text-sm">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resumeData?.skills && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 uppercase tracking-wider">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.values(resumeData.skills).flat().map((skill: any, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function UnifiedEditorPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const resumeId = params.id as string

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTailoring, setIsTailoring] = useState(false)
  const [isParsingUrl, setIsParsingUrl] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved')

  // View states
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [rightPanelMode, setRightPanelMode] = useState<'preview' | 'job'>('preview')
  const [isJobPanelOpen, setIsJobPanelOpen] = useState(true)

  // Resume data
  const [resumeTitle, setResumeTitle] = useState<string>('')
  const [resumeData, setResumeData] = useState<StructuredResumeData | null>(null)
  const [originalContent, setOriginalContent] = useState<StructuredResumeData | null>(null)
  const [tailoredJobCompany, setTailoredJobCompany] = useState<string | null>(null)
  const [tailoredJobTitle, setTailoredJobTitle] = useState<string | null>(null)

  // Job description data
  const [jobUrl, setJobUrl] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [jobLocation, setJobLocation] = useState("")
  const [jobDescription, setJobDescription] = useState("")

  // Fetch resume data on mount
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch(`/api/resumes/${resumeId}`)
        const data = await response.json()

        if (data.success && data.resume) {
          const resume = data.resume
          setResumeTitle(resume.title || 'Untitled Resume')
          setResumeData({
            contactInfo: resume.contactInfo || {},
            summary: resume.summary || '',
            experience: resume.experience || [],
            education: resume.education || [],
            skills: resume.skills || {},
            certifications: resume.certifications || [],
            achievements: resume.achievements || []
          })
          setOriginalContent(resume.originalContent || null)
          setTailoredJobCompany(resume.tailoredJobCompany || null)
          setTailoredJobTitle(resume.tailoredJobTitle || null)
        }
      } catch (error) {
        console.error('Failed to fetch resume:', error)
        toast.error('Failed to load resume')
      } finally {
        setIsLoading(false)
      }
    }

    if (resumeId) {
      fetchResumeData()
    }
  }, [resumeId])

  // Auto-save functionality with debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  const saveResume = async (showToast = true) => {
    if (!resumeData) return

    setIsSaving(true)
    setAutoSaveStatus('saving')
    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resumeTitle,
          contactInfo: resumeData.contactInfo,
          summary: resumeData.summary,
          experience: resumeData.experience,
          education: resumeData.education,
          skills: resumeData.skills,
          certifications: resumeData.certifications,
          achievements: resumeData.achievements
        })
      })

      const data = await response.json()
      if (data.success) {
        setAutoSaveStatus('saved')
        if (showToast) toast.success('Resume saved')
      } else {
        setAutoSaveStatus('error')
        if (showToast) toast.error('Failed to save resume')
      }
    } catch (error) {
      console.error('Save error:', error)
      setAutoSaveStatus('error')
      if (showToast) toast.error('Failed to save resume')
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save on data change
  useEffect(() => {
    if (!resumeData || isLoading) return

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      saveResume(false)
    }, 2000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [resumeData])

  // Handle job URL parsing
  const handleUrlParse = async () => {
    if (!jobUrl.trim()) {
      toast.error('Please enter a job posting URL')
      return
    }

    setIsParsingUrl(true)
    try {
      const response = await fetch('/api/job-url/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrl })
      })

      const data = await response.json()

      if (data.success) {
        setJobTitle(data.jobTitle || '')
        setCompanyName(data.company || '')
        setJobLocation(data.location || '')
        setJobDescription(data.description || '')
        toast.success('Job details extracted successfully')
      } else if (data.blocked) {
        toast.error(data.message || 'This site blocks automated access')
      } else {
        toast.error(data.message || 'Failed to extract job details')
      }
    } catch (error) {
      console.error('URL parse error:', error)
      toast.error('Failed to fetch job details')
    } finally {
      setIsParsingUrl(false)
    }
  }

  // Handle resume tailoring
  const handleTailorResume = async () => {
    if (!jobTitle || !companyName || !jobDescription) {
      toast.error('Please fill in job details first')
      return
    }

    setIsTailoring(true)
    try {
      const response = await fetch(`/api/resumes/${resumeId}/tailor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          company: companyName,
          location: jobLocation,
          description: jobDescription
        })
      })

      const data = await response.json()

      if (data.success && data.tailoredResume) {
        // Save original content if this is the first tailoring
        if (!originalContent) {
          setOriginalContent(resumeData)
        }

        // Update with tailored content
        setResumeData(data.tailoredResume)
        setTailoredJobCompany(companyName)
        setTailoredJobTitle(jobTitle)

        // Save the tailored version
        await saveResume()

        toast.success('Resume tailored successfully')
        setIsJobPanelOpen(false)
      } else {
        toast.error('Failed to tailor resume')
      }
    } catch (error) {
      console.error('Tailoring error:', error)
      toast.error('Failed to tailor resume')
    } finally {
      setIsTailoring(false)
    }
  }

  // Handle undo tailoring
  const handleUndoTailoring = async () => {
    if (!originalContent) return

    setResumeData(originalContent)
    setTailoredJobCompany(null)
    setTailoredJobTitle(null)
    setOriginalContent(null)

    // Save the restored version
    await saveResume()
    toast.success('Restored original resume')
  }

  if (isLoading) {
    return <ResumeLoader />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <Navigation showUserMenu={false} />

      {/* Sub Navigation */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-[52px] z-30">
        <div className="flex items-center justify-between px-6 h-[52px]">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-[13px] text-text-secondary hover:text-foreground transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back</span>
            </Link>
            <div className="h-4 w-px bg-white/6" />
            <span className="text-[15px] font-semibold text-white">
              {resumeTitle || 'Untitled Resume'}
            </span>
            {tailoredJobCompany && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-success/10 text-success border border-success/20">
                  <Briefcase className="w-3 h-3" />
                  Tailored for {tailoredJobCompany}
                </span>
                <button
                  onClick={handleUndoTailoring}
                  className="text-[12px] text-text-secondary hover:text-foreground transition-all flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5"
                >
                  <Undo2 className="w-3 h-3" />
                  Undo
                </button>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => saveResume(true)}
              disabled={isSaving}
              className="btn-secondary px-4 py-1.5 rounded-md text-[13px] font-medium inline-flex items-center gap-1.5"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save
            </button>

            <button className="btn-primary px-4 py-1.5 rounded-md text-[13px] font-semibold inline-flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex relative" style={{ paddingBottom: 'var(--status-bar-height)' }}>
        {/* Left Side - Resume Editor */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isJobPanelOpen ? 'mr-[420px]' : 'mr-0'
        }`}>
          <div className="max-w-4xl mx-auto p-8 space-y-6">
            {/* Auto-fill Button */}
            {resumeData && (
              <div className="flex justify-between items-center mb-6 p-4 bg-slate-800/30 border border-white/10 rounded-lg">
                <div>
                  <h3 className="text-[14px] font-semibold text-white mb-1">Need to import your resume?</h3>
                  <p className="text-[12px] text-slate-400">Upload a PDF to auto-fill all fields</p>
                </div>
                <AutoFillButton
                  resumeId={resumeId}
                  onAutoFillComplete={(data) => {
                    if (data) {
                      setResumeData({
                        contactInfo: data.contactInfo || {},
                        summary: data.professionalSummary?.summary || '',
                        experience: data.workExperience || [],
                        education: data.education || [],
                        skills: data.skills || {},
                        certifications: data.certifications || [],
                        achievements: data.achievements || []
                      })
                      toast.success('Resume auto-filled successfully')
                    }
                  }}
                />
              </div>
            )}
              {/* Contact Information */}
              <CollapsibleSectionWrapper
                title="Contact Information"
                isComplete={!!(resumeData?.contactInfo && (resumeData.contactInfo as ContactInfo).email)}
              >
                <ContactInfoSection
                  data={resumeData?.contactInfo as ContactInfo || {}}
                  onChange={(data) => setResumeData(prev => prev ? {...prev, contactInfo: data} : null)}
                />
              </CollapsibleSectionWrapper>

              {/* Professional Summary */}
              <CollapsibleSectionWrapper
                title="Professional Summary"
                isComplete={!!(resumeData?.summary && resumeData.summary.length > 50)}
              >
                <ProfessionalSummarySection
                  data={{ summary: resumeData?.summary || '' }}
                  onChange={(data) => setResumeData(prev => prev ? {...prev, summary: data.summary} : null)}
                />
              </CollapsibleSectionWrapper>

              {/* Work Experience */}
              <CollapsibleSectionWrapper
                title="Work Experience"
                isComplete={!!(resumeData?.experience && resumeData.experience.length > 0)}
              >
                <WorkExperienceSection
                  data={resumeData?.experience || []}
                  onChange={(data) => setResumeData(prev => prev ? {...prev, experience: data} : null)}
                />
              </CollapsibleSectionWrapper>

              {/* Education */}
              <CollapsibleSectionWrapper
                title="Education"
                isComplete={!!(resumeData?.education && resumeData.education.length > 0)}
              >
                <EducationSection
                  data={resumeData?.education || []}
                  onChange={(data) => setResumeData(prev => prev ? {...prev, education: data} : null)}
                />
              </CollapsibleSectionWrapper>

              {/* Skills */}
              <CollapsibleSectionWrapper
                title="Skills"
                isComplete={!!(resumeData?.skills && Object.values(resumeData.skills).flat().length > 0)}
              >
                <SkillsSection
                  data={resumeData?.skills || {}}
                  onChange={(data) => setResumeData(prev => prev ? {...prev, skills: data} : null)}
                />
              </CollapsibleSectionWrapper>
          </div>
        </div>

        {/* Right Side Panel - Preview or Job */}
        <div className={`fixed right-0 top-[104px] bottom-[32px] bg-slate-900/50 backdrop-blur-sm border-l border-white/10 transition-all duration-300 shadow-2xl ${
          isJobPanelOpen ? 'w-[420px]' : 'w-0'
        }`}>
          {/* Toggle Tab */}
          <button
            onClick={() => setIsJobPanelOpen(!isJobPanelOpen)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-10 h-24 bg-slate-900 border border-white/10 border-r-0 rounded-l-lg flex flex-col items-center justify-center hover:bg-slate-800 transition-all group"
            title={isJobPanelOpen ? "Close panel" : "Open panel"}
          >
            {isJobPanelOpen ? (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                <span className="text-[10px] text-slate-500 mt-1 writing-mode-vertical">
                  {rightPanelMode === 'preview' ? 'Preview' : 'Job'}
                </span>
              </>
            )}
          </button>

          {/* Panel Content */}
          {isJobPanelOpen && (
            <div className="h-full flex flex-col">
              {/* Panel Mode Toggle */}
              <div className="p-4 border-b border-white/10">
                <div className="flex bg-slate-800/50 border border-white/10 rounded-md p-0.5">
                  <button
                    onClick={() => setRightPanelMode('preview')}
                    className={`flex-1 px-3 py-1.5 text-[12px] font-medium rounded transition-all ${
                      rightPanelMode === 'preview'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3 h-3 inline mr-1.5" />
                    Preview
                  </button>
                  <button
                    onClick={() => setRightPanelMode('job')}
                    className={`flex-1 px-3 py-1.5 text-[12px] font-medium rounded transition-all ${
                      rightPanelMode === 'job'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-3 h-3 inline mr-1.5" />
                    Target Job
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              {rightPanelMode === 'preview' ? (
                /* Resume Preview */
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <SimpleResumePreview resumeData={resumeData} resumeTitle={resumeTitle} className="scale-90 origin-top" />
                  </div>
                </div>
              ) : (
                /* Job Description Panel */
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-[14px] font-semibold text-white mb-1">
                      Target Job Description
                    </h2>
                    <p className="text-[12px] text-slate-400">
                      Add job details to tailor your resume
                    </p>
                  </div>

                  {/* URL Input */}
                  <div className="mb-5">
                    <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-2">
                      Job Posting URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md text-[13px] text-white placeholder:text-slate-500 hover:border-white/20 focus:border-white/30 focus:outline-none transition-all"
                      />
                      <button
                        onClick={handleUrlParse}
                        disabled={isParsingUrl}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-white/10 hover:border-white/20 rounded-md text-[12px] font-medium text-white transition-all disabled:opacity-50"
                        title="Fetch job details"
                      >
                        {isParsingUrl ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <LinkIcon className="w-3.5 h-3.5 inline mr-1" />
                            Fetch
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1.5">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md text-[13px] text-white placeholder:text-slate-500 hover:border-white/20 focus:border-white/30 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1.5">
                        Company
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Google"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md text-[13px] text-white placeholder:text-slate-500 hover:border-white/20 focus:border-white/30 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md text-[13px] text-white placeholder:text-slate-500 hover:border-white/20 focus:border-white/30 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1.5">
                        Job Description
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                        rows={10}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md text-[13px] text-white placeholder:text-slate-500 hover:border-white/20 focus:border-white/30 focus:outline-none transition-all resize-none"
                        style={{ minHeight: '160px' }}
                      />
                      {jobDescription && (
                        <p className="text-[10px] text-slate-500 mt-1">
                          {jobDescription.length} characters
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-6 border-t border-white/10" />

                  {/* Tailor Button */}
                  <button
                    onClick={handleTailorResume}
                    disabled={isTailoring || !jobTitle || !companyName || !jobDescription}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-md inline-flex items-center justify-center gap-2 text-[13px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTailoring ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Tailoring Resume...
                      </>
                    ) : tailoredJobCompany ? (
                      <>
                        <Check className="w-4 h-4" />
                        Resume Tailored
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        ⚡ Tailor Resume
                      </>
                    )}
                  </button>

                  {tailoredJobCompany && (
                    <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 text-[12px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Tailored for this job</span>
                        </div>
                        <button
                          onClick={handleUndoTailoring}
                          className="text-[11px] text-emerald-400/80 hover:text-emerald-400 transition-all"
                        >
                          Undo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar autoSaveStatus={autoSaveStatus} />
    </div>
  )
}