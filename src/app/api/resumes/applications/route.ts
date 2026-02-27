import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })

    if (!token || !token.sub) {
      console.error('❌ No token or token.sub in applications API')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📍 Applications API called with userId:', token.sub)

    const applications = await prisma.jobApplication.findMany({
      where: {
        userId: token.sub
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