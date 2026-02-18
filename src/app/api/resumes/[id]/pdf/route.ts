// src/app/api/resumes/[id]/pdf/route.ts - PDF Proxy for CORS-free access
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { downloadFromStorage } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('📄 Proxying PDF content for resume:', id);

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get resume and verify ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: id,
        userId: user.id,
        isActive: true
      },
      select: {
        id: true,
        s3Key: true,
        s3Bucket: true,
        originalFileName: true,
        contentType: true,
      }
    })

    if (!resume) {
      console.log('❌ Resume not found or user not authorized')
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    if (!resume.s3Key) {
      console.log('❌ No storage key found for resume')
      return NextResponse.json({ error: 'PDF file not found' }, { status: 404 })
    }

    console.log('📥 Downloading PDF from Supabase Storage:', resume.s3Key);

    // Download file from Supabase Storage
    const fileBuffer = await downloadFromStorage(resume.s3Key);

    if (!fileBuffer) {
      console.error('❌ Failed to download PDF from storage');
      return NextResponse.json({
        error: 'Failed to retrieve PDF'
      }, { status: 500 })
    }

    console.log('✅ PDF downloaded successfully, size:', fileBuffer.length);

    // Return the PDF with proper headers for browser viewing
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': resume.contentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${resume.originalFileName || 'resume.pdf'}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, max-age=3600',
        // CORS headers for iframe embedding
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('❌ Error serving PDF:', error)
    return NextResponse.json({
      error: 'Failed to serve PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}