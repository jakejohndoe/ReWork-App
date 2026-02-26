"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import ResumeUploader from "@/components/resume-uploader"
import ResumeLoader from "@/components/resume-loader"
import Navigation from "@/components/navigation"
import StatusBar from "@/components/status-bar"
import {
  FileText,
  Plus,
  Trash2,
  ChevronRight,
  Briefcase
} from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  // Loading state management
  const [shouldShowContent, setShouldShowContent] = useState(false)
  const [loadingStartTime] = useState(() => Date.now())
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false)

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [resumes, setResumes] = useState<any[]>([])
  const [deletingResumeId, setDeletingResumeId] = useState<string | null>(null)

  // Coordinated loading check
  useEffect(() => {
    if (isDataLoaded && isMinTimeElapsed) {
      setShouldShowContent(true)
    }
  }, [isDataLoaded, isMinTimeElapsed])

  // Main data loading effect
  useEffect(() => {
    if (status === 'loading') return
    if (status !== 'authenticated') return

    // Start minimum time timer (1.5 seconds for smooth transition)
    const minTimeTimer = setTimeout(() => {
      setIsMinTimeElapsed(true)
    }, 1500)

    // Start data fetching
    const fetchData = async () => {
      try {
        const response = await fetch('/api/resumes')
        const data = await response.json()

        if (data.success) {
          setResumes(data.resumes)
        }
      } catch (error) {
        console.error('Failed to fetch resumes:', error)
      } finally {
        setIsDataLoaded(true)
      }
    }

    fetchData()

    return () => {
      clearTimeout(minTimeTimer)
    }
  }, [status, session])

  // Show loader while loading
  if (!shouldShowContent) {
    return <ResumeLoader />
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/auth/signin")
  }

  const handleUploadComplete = (resumes: any[]) => {
    setIsUploadOpen(false)
    fetchResumes()
  }

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes')
      const data = await response.json()

      if (data.success) {
        setResumes(data.resumes)
      }
    } catch (error) {
      console.error('Failed to refresh resumes:', error)
    }
  }

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      setDeletingResumeId(resumeId)

      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setResumes(prev => prev.filter(resume => resume.id !== resumeId))
      } else {
        alert('Failed to delete resume. Please try again.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete resume. Please try again.')
    } finally {
      setDeletingResumeId(null)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'just now'
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return 'yesterday'
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const isPremium = session?.user?.plan === "PREMIUM"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black">
      {/* Top Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ paddingBottom: 'calc(var(--status-bar-height) + 32px)' }}>
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-200 mb-1">
              Your Resumes
            </h1>
            <p className="text-[14px] text-slate-400">
              Create and manage your professional resumes
            </p>
          </div>
          {resumes.length > 0 && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-5 py-2.5 bg-white text-slate-900 rounded-md inline-flex items-center gap-2 text-[13px] font-semibold hover:bg-slate-100 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Resume
            </button>
          )}
        </div>

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/30 border border-white/10 mb-4">
              <FileText className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-slate-200 mb-2">
              No resumes yet
            </h3>
            <p className="text-slate-400 text-[14px] mb-6 max-w-sm mx-auto">
              Create your first resume to get started with job applications
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-6 py-3 bg-white text-slate-900 rounded-md inline-flex items-center gap-2 text-[14px] font-semibold hover:bg-slate-100 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Resume
            </button>
          </div>
        ) : (
          <>
            {/* Resume count */}
            <div className="mb-6">
              <p className="text-[13px] text-slate-500">
                {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Resume Cards */}
            <div className="grid gap-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-slate-800/40 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-lg p-4 transition-all duration-300 hover:scale-[1.01] group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-md bg-slate-700/50 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-[15px] font-semibold text-slate-200 group-hover:text-white transition-colors">
                              {resume.title}
                            </h3>
                            {resume.tailoredJobCompany && (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Briefcase className="w-3 h-3" />
                                Tailored for {resume.tailoredJobCompany}
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-slate-400">
                            Modified {formatTimeAgo(resume.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/resume/${resume.id}`}
                        className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 border border-white/10 hover:border-white/20 rounded-md text-[13px] font-medium text-white inline-flex items-center gap-1.5 transition-all"
                      >
                        Edit
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        disabled={deletingResumeId === resume.id}
                        className="p-2 text-slate-500 hover:text-red-400 transition-all rounded-md hover:bg-red-500/10"
                      >
                        {deletingResumeId === resume.id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </main>

      {/* Bottom Status Bar */}
      <StatusBar resumeCount={resumes.length} />

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsUploadOpen(false)}
          />

          <div className="relative bg-background border border-white/8 rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-semibold text-white">
                  Upload Resume
                </h2>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-foreground hover:bg-white/5 transition-all"
                >
                  ✕
                </button>
              </div>

              <ResumeUploader
                onUploadComplete={handleUploadComplete}
                maxFiles={3}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}