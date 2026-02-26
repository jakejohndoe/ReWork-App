import { prisma } from './prisma'

/**
 * Resume Count Management Utilities
 * Handles monthly reset logic and lifetime tracking
 */

export interface ResumeCountStatus {
  monthlyCount: number
  totalCount: number
  isAtLimit: boolean
  remainingResumes: number
  nextResetDate: Date
}

/**
 * Check if user needs monthly reset (first resume creation of new month)
 */
function needsMonthlyReset(lastResetDate: Date): boolean {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const resetMonth = lastResetDate.getMonth()
  const resetYear = lastResetDate.getFullYear()

  return currentYear > resetYear || (currentYear === resetYear && currentMonth > resetMonth)
}

/**
 * Get next month's first day for reset date
 */
function getNextResetDate(): Date {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return nextMonth
}

/**
 * Get resume count status for a user
 */
export async function getResumeCountStatus(userId: string): Promise<ResumeCountStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      resumesCreated: true,
      monthlyResumesCreated: true,
      totalResumesCreated: true,
      resumeCountResetAt: true
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Check if reset is needed
  let monthlyCount = user.monthlyResumesCreated
  if (needsMonthlyReset(user.resumeCountResetAt)) {
    monthlyCount = 0
    // Don't auto-reset here, do it during increment to avoid race conditions
  }

  const monthlyLimit = user.plan === 'PREMIUM' ? Infinity : 3
  const isAtLimit = monthlyCount >= monthlyLimit
  const remainingResumes = user.plan === 'PREMIUM' ? Infinity : Math.max(0, monthlyLimit - monthlyCount)

  return {
    monthlyCount,
    totalCount: user.totalResumesCreated,
    isAtLimit,
    remainingResumes,
    nextResetDate: getNextResetDate()
  }
}

/**
 * Increment resume count for user (handles monthly reset automatically)
 */
export async function incrementResumeCount(userId: string): Promise<ResumeCountStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      resumesCreated: true,
      monthlyResumesCreated: true,
      totalResumesCreated: true,
      resumeCountResetAt: true
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const needsReset = needsMonthlyReset(user.resumeCountResetAt)
  const newMonthlyCount = needsReset ? 1 : user.monthlyResumesCreated + 1
  const newTotalCount = user.totalResumesCreated + 1
  const newResetAt = needsReset ? new Date() : user.resumeCountResetAt

  // Update user with new counts
  await prisma.user.update({
    where: { id: userId },
    data: {
      monthlyResumesCreated: newMonthlyCount,
      totalResumesCreated: newTotalCount,
      resumeCountResetAt: newResetAt,
      // Keep old resumesCreated for backward compatibility
      resumesCreated: user.resumesCreated + 1
    }
  })

  const monthlyLimit = user.plan === 'PREMIUM' ? Infinity : 3
  const isAtLimit = newMonthlyCount >= monthlyLimit
  const remainingResumes = user.plan === 'PREMIUM' ? Infinity : Math.max(0, monthlyLimit - newMonthlyCount)

  return {
    monthlyCount: newMonthlyCount,
    totalCount: newTotalCount,
    isAtLimit,
    remainingResumes,
    nextResetDate: getNextResetDate()
  }
}

/**
 * Check if user can create a new resume (respects monthly limits)
 */
export async function canCreateResume(userId: string): Promise<boolean> {
  const status = await getResumeCountStatus(userId)
  return !status.isAtLimit
}

/**
 * Reset monthly count for testing/admin purposes
 */
export async function resetMonthlyCount(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      monthlyResumesCreated: 0,
      resumeCountResetAt: new Date()
    }
  })
}