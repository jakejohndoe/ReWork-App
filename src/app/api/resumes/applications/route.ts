import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      console.error('❌ No session or user.id in applications API')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📍 Applications API called with userId:', session.user.id)

    const applications = await prisma.jobApplication.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        resume: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📍 Found applications:', applications.length)

    return NextResponse.json({
      success: true,
      applications
    })

  } catch (error) {
    console.error('Failed to fetch job applications:', error)
    return NextResponse.json({ error: 'Failed to fetch job applications' }, { status: 500 })
  }
}