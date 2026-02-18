import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Bucket name for storing resumes
const BUCKET_NAME = 'resumes'

// Ensure bucket exists (run this once on app startup)
export async function ensureBucketExists() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('Error listing buckets:', listError)
    return
  }

  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)

  if (!bucketExists) {
    const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: false, // Keep files private
      fileSizeLimit: 10 * 1024 * 1024, // 10MB limit
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
    })

    if (error) {
      console.error('Error creating bucket:', error)
    } else {
      console.log('Created resumes bucket:', data)
    }
  }
}

// Upload file to Supabase Storage
export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType: string,
  metadata?: Record<string, string>
) {
  try {
    // Ensure bucket exists
    await ensureBucketExists()

    // Convert Buffer to Blob with proper content type
    const blob = new Blob([file], { type: contentType })

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(key, blob, {
        contentType,
        upsert: false, // Don't overwrite existing files
        cacheControl: '3600',
        // Note: Supabase doesn't directly support metadata like S3,
        // but we can store it in the database if needed
      })

    if (error) {
      throw error
    }

    // Get public URL (even though bucket is private, we'll use signed URLs)
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(key)

    return {
      success: true,
      key,
      etag: data.id || 'supabase-' + Date.now(), // Supabase doesn't provide ETags like S3
      location: urlData.publicUrl,
    }
  } catch (error) {
    console.error('Supabase upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    }
  }
}

// Generate signed URL for secure file access
export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(key, expiresIn)

    if (error) {
      throw error
    }

    return {
      success: true,
      url: data.signedUrl,
    }
  } catch (error) {
    console.error('Supabase signed URL error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Delete file from Supabase Storage
export async function deleteFromS3(key: string) {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([key])

    if (error) {
      throw error
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Supabase delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown delete error',
    }
  }
}

// Generate unique storage key for a file (same as S3)
export function generateS3Key(userId: string, originalFileName: string): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  const fileExtension = originalFileName.split('.').pop()

  return `users/${userId}/resumes/${timestamp}-${randomId}.${fileExtension}`
}

// Helper to get file content type (same as S3)
export function getContentType(fileName: string): string {
  const extension = fileName.toLowerCase().split('.').pop()

  switch (extension) {
    case 'pdf':
      return 'application/pdf'
    case 'doc':
      return 'application/msword'
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    default:
      return 'application/octet-stream'
  }
}

// Download file from Supabase Storage
export async function downloadFromStorage(key: string): Promise<Buffer | null> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(key)

    if (error) {
      throw error
    }

    // Convert Blob to Buffer
    const arrayBuffer = await data.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return buffer
  } catch (error) {
    console.error('Supabase download error:', error)
    return null
  }
}