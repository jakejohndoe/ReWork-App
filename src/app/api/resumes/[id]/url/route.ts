// src/app/api/resumes/[id]/url/route.ts - Using Supabase Storage
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSignedDownloadUrl } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔗 Getting PDF URL for resume:', id);

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
      }
    })

    if (!resume) {
      console.log('❌ Resume not found or user not authorized')
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    if (!resume.s3Key) {
      console.log('❌ No S3 key found for resume')
      return NextResponse.json({ error: 'PDF file not found' }, { status: 404 })
    }

    console.log('📄 Generating signed URL for:', resume.s3Key);

    // Generate signed URL using Supabase Storage
    const signedUrlResult = await getSignedDownloadUrl(resume.s3Key, 3600); // 1 hour expiry

    if (!signedUrlResult.success || !signedUrlResult.url) {
      console.error('❌ Failed to generate signed URL:', signedUrlResult.error);
      return NextResponse.json({
        error: 'Failed to generate download URL'
      }, { status: 500 })
    }

    console.log('✅ Signed URL generated successfully');

    return NextResponse.json({
      success: true,
      url: signedUrlResult.url,
      fileName: resume.originalFileName || 'resume.pdf'
    })

  } catch (error) {
    console.error('❌ Error getting PDF URL:', error)
    return NextResponse.json({
      error: 'Failed to get PDF URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}