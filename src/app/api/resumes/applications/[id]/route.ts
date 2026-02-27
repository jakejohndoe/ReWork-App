import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request })

    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const application = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: token.sub
      },
      include: {
        resume: true
      }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      ...application
    })

  } catch (error) {
    console.error('Failed to fetch job application:', error)
    return NextResponse.json({ error: 'Failed to fetch job application' }, { status: 500 })
  }
}