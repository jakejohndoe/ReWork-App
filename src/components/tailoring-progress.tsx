import { useState, useEffect } from 'react'
import { Sparkles, Check } from 'lucide-react'

interface TailoringStep {
  id: number
  text: string
  appearAfter: number // milliseconds
  icon?: string
}

const TAILORING_STEPS: TailoringStep[] = [
  { id: 1, text: "Reading your resume...", appearAfter: 0, icon: "📄" },
  { id: 2, text: "Analyzing job requirements...", appearAfter: 1200, icon: "🎯" },
  { id: 3, text: "Optimizing your experience...", appearAfter: 2800, icon: "🔄" },
  { id: 4, text: "Polishing final details...", appearAfter: 4500, icon: "✨" },
  { id: 5, text: "Almost there...", appearAfter: 6000, icon: "🚀" }
]

interface TailoringProgressProps {
  isActive: boolean
  jobTitle?: string
  companyName?: string
}

export default function TailoringProgress({
  isActive,
  jobTitle,
  companyName
}: TailoringProgressProps) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [progressPercent, setProgressPercent] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setVisibleSteps([])
      setCompletedSteps([])
      setProgressPercent(0)
      return
    }

    // Reset state when starting
    setVisibleSteps([1])
    setCompletedSteps([])
    setProgressPercent(15)

    // Set up timers for step progression
    const timers: NodeJS.Timeout[] = []

    TAILORING_STEPS.forEach((step) => {
      if (step.appearAfter === 0) return

      const timer = setTimeout(() => {
        setVisibleSteps(prev => {
          if (!prev.includes(step.id)) {
            return [...prev, step.id]
          }
          return prev
        })

        // Mark previous step as completed
        if (step.id > 1) {
          setCompletedSteps(prev => {
            if (!prev.includes(step.id - 1)) {
              return [...prev, step.id - 1]
            }
            return prev
          })
        }

        // Update progress with more dynamic increments
        const progressValues = [15, 30, 55, 80, 95];
        setProgressPercent(progressValues[step.id - 1] || 95)
      }, step.appearAfter)

      timers.push(timer)
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[14px] font-semibold text-white mb-1">
            Tailoring Your Resume
          </h3>
          <p className="text-[11px] text-slate-400">
            Optimizing for {jobTitle || 'the position'} {companyName ? `at ${companyName}` : ''}
          </p>
        </div>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div className="absolute inset-0 w-10 h-10 rounded-full bg-emerald-500/20 animate-ping" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-slate-500">Processing</span>
          <span className="text-[10px] text-emerald-400 font-medium">{progressPercent}%</span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {TAILORING_STEPS.map((step) => {
          const isVisible = visibleSteps.includes(step.id)
          const isCompleted = completedSteps.includes(step.id)
          const isActive = isVisible && !isCompleted

          if (!isVisible) return null

          return (
            <div
              key={step.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg border
                transition-all duration-500
                ${isCompleted
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : isActive
                    ? 'bg-slate-800/50 border-white/10 animate-in fade-in slide-in-from-bottom-2'
                    : 'bg-slate-800/20 border-white/5'
                }
              `}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                ) : (
                  <div className="text-[18px] animate-bounce">{step.icon}</div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className={`text-[12px] font-medium ${
                  isCompleted
                    ? 'text-emerald-400'
                    : isActive
                      ? 'text-white'
                      : 'text-slate-400'
                }`}>
                  {step.text}
                </p>
                {isActive && (
                  <div className="flex gap-1 mt-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-150" />
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-300" />
                  </div>
                )}
              </div>

              {/* Status indicator */}
              {isActive && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Message */}
      <div className="mt-6 p-3 bg-slate-800/30 border border-white/5 rounded-lg">
        <p className="text-[11px] text-slate-400 text-center">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            AI is carefully matching your skills to the job requirements
          </span>
        </p>
      </div>
    </div>
  )
}