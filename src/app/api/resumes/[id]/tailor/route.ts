import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { openai } from '@/lib/openai';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const resumeId = id;

    const { jobTitle, company, companyName, location, description, jobDescription, extraContext, contextTags } = await request.json();

    // Accept both company and companyName for backwards compatibility
    const actualCompanyName = company || companyName;
    const actualJobDescription = description || jobDescription;

    if (!jobTitle || !actualCompanyName || !actualJobDescription) {
      return NextResponse.json({
        error: 'Missing required job information'
      }, { status: 400 });
    }

    console.log('🎯 Starting resume tailoring for:', { resumeId, jobTitle, company: actualCompanyName });

    // Get the resume with user data
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: { user: true }
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Verify user ownership
    if (resume.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current resume content
    const currentContent = resume.currentContent as any;
    if (!currentContent) {
      return NextResponse.json({
        error: 'Resume content not found. Please fill out your resume first.'
      }, { status: 400 });
    }

    // Save the original content if not already saved
    if (!resume.originalContent) {
      await prisma.resume.update({
        where: { id: resumeId },
        data: {
          originalContent: currentContent
        }
      });
    }

    // Prepare the resume data for the AI
    const resumeData = {
      contact: currentContent.contact || {},
      summary: currentContent.summary || '',
      experience: currentContent.experience || [],
      education: currentContent.education || [],
      skills: currentContent.skills || []
    };

    console.log('📝 Creating tailored resume with GPT-4o...');

    // Create the tailoring prompt
    const contextSection = (extraContext || contextTags?.length) ? `
ADDITIONAL CONTEXT:
${extraContext ? `Additional Information: ${extraContext}` : ''}
${contextTags?.length ? `Context Tags: ${contextTags.join(', ')}` : ''}

Consider this context when tailoring the resume. For example:
- Career Changer: Emphasize transferable skills and relevant achievements
- Recent Graduate: Highlight academic projects, internships, and potential
- Employment Gaps: Focus on skills maintained and any freelance/volunteer work
- Military Transition: Translate military experience to civilian terms
` : '';

    const prompt = `You are an expert resume writer who creates authentic, compelling resumes tailored for specific positions. Your task is to rewrite this resume to align with the job posting while maintaining complete accuracy about the candidate's actual experience.

CANDIDATE'S CURRENT RESUME:
${JSON.stringify(resumeData, null, 2)}

TARGET JOB:
Position: ${jobTitle}
Company: ${actualCompanyName}
Job Description:
${actualJobDescription}
${contextSection}

CRITICAL RULES:
1. NEVER fabricate experience, skills, dates, companies, schools, or achievements
2. Keep ALL factual information accurate (dates, companies, titles, schools, degrees)
3. Maintain the candidate's authentic voice - it should sound natural, not robotic
4. DO NOT copy language verbatim from the job description - use adjacent, professional language
5. Each experience bullet must follow: Action verb + what you did + measurable result/impact when possible
6. If experience doesn't directly match, identify and emphasize transferable skills
7. Prioritize quantified achievements (numbers, percentages, metrics) where they exist
8. Keep bullet points concise and impactful (1-2 lines max)

REWRITING GUIDELINES:

Professional Summary:
- Rewrite to position the candidate for this specific role
- 2-3 sentences maximum
- Lead with their strongest relevant qualification
- Include years of experience if 3+ years
- Mention the most relevant technical skills for this role
- End with what unique value they bring to this position

Work Experience:
- Keep the same jobs/companies/dates (never change facts)
- Rewrite each bullet point to emphasize skills relevant to the target job
- Start each bullet with a strong action verb (managed, developed, increased, etc.)
- Include metrics and results where available
- Highlight achievements that demonstrate skills needed for the target role
- Order bullets by relevance to the target position (most relevant first)
- 3-5 bullets per position maximum

Skills:
- Reorder to put the most relevant skills for this job first
- Group into categories if helpful (Technical, Tools, Soft Skills)
- Only include skills actually mentioned in their experience or education
- Remove outdated or irrelevant skills for this position

Education:
- Keep all factual information unchanged
- Can add relevant coursework, projects, or honors if they align with the job

Return a JSON object with this exact structure:
{
  "contact": {
    "firstName": "unchanged",
    "lastName": "unchanged",
    "email": "unchanged",
    "phone": "unchanged",
    "location": "unchanged",
    "linkedin": "unchanged",
    "website": "unchanged"
  },
  "summary": "rewritten professional summary tailored for this role",
  "experience": [
    {
      "title": "unchanged job title",
      "company": "unchanged company name",
      "startDate": "unchanged",
      "endDate": "unchanged",
      "location": "unchanged",
      "description": "rewritten bullets as single string separated by • "
    }
  ],
  "education": [
    {
      "degree": "unchanged",
      "school": "unchanged",
      "year": "unchanged",
      "gpa": "unchanged or empty",
      "additionalInfo": "relevant coursework/projects if applicable"
    }
  ],
  "skills": ["reordered skill list", "most relevant first"]
}

Focus on creating a compelling narrative that shows why this candidate is perfect for this role, using only their real experience.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o for quality
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer who creates authentic, compelling resumes. You never fabricate information and always maintain the candidate's genuine experience while presenting it in the best possible light."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7, // Natural-sounding language
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    if (!response) {
      throw new Error('Empty response from AI');
    }

    // Parse the AI response
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    const tailoredData = JSON.parse(cleanedResponse);

    console.log('✅ Tailored resume generated successfully');

    // Transform the tailored data to match the database schema AND frontend expectations
    const tailoredContent = {
      contact: tailoredData.contact || currentContent.contact,
      summary: tailoredData.summary || '',
      experience: Array.isArray(tailoredData.experience) ?
        tailoredData.experience.map((exp: any) => ({
          jobTitle: exp.title,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          location: exp.location || '',
          responsibilities: exp.description || '',
          current: exp.endDate?.toLowerCase().includes('present') || false
        })) : [],
      education: Array.isArray(tailoredData.education) ?
        tailoredData.education.map((edu: any) => ({
          degree: edu.degree,
          institution: edu.school,
          graduationYear: edu.year,
          gpa: edu.gpa || '',
          fieldOfStudy: edu.fieldOfStudy || '',
          additionalInfo: edu.additionalInfo || ''
        })) : [],
      skills: Array.isArray(tailoredData.skills) ? tailoredData.skills : [],
      tailoredFor: {
        jobTitle,
        company: actualCompanyName,
        tailoredAt: new Date().toISOString()
      }
    };

    // Create the frontend-compatible structure
    const frontendResume = {
      contactInfo: tailoredData.contact || currentContent.contact,
      professionalSummary: tailoredData.summary ? {
        summary: tailoredData.summary,
        targetRole: '',
        keyStrengths: [],
        careerLevel: 'mid'
      } : currentContent.professionalSummary,
      workExperience: Array.isArray(tailoredData.experience) ?
        tailoredData.experience.map((exp: any) => ({
          role: exp.title,
          company: exp.company,
          dates: `${exp.startDate} - ${exp.endDate}`,
          location: exp.location || '',
          achievements: exp.description ? exp.description.split('•').map((a: string) => a.trim()).filter(Boolean) : [],
          current: exp.endDate?.toLowerCase().includes('present') || false
        })) : [],
      education: Array.isArray(tailoredData.education) ?
        tailoredData.education.map((edu: any) => ({
          degree: edu.degree,
          school: edu.school,
          graduationDate: edu.year,
          gpa: edu.gpa || '',
          fieldOfStudy: edu.fieldOfStudy || '',
          additionalInfo: edu.additionalInfo || ''
        })) : [],
      skills: Array.isArray(tailoredData.skills) ? {
        technical: tailoredData.skills,
        frameworks: [],
        tools: [],
        cloud: [],
        databases: [],
        soft: [],
        certifications: []
      } : currentContent.skills || { technical: [], frameworks: [], tools: [], cloud: [], databases: [], soft: [], certifications: [] }
    };

    // Update the resume with tailored content
    const updatedResume = await prisma.resume.update({
      where: { id: resumeId },
      data: {
        currentContent: tailoredContent,
        lastOptimized: new Date(),
      }
    });

    console.log('💾 Resume updated with tailored content');

    // Also update the job application if it exists
    await prisma.jobApplication.updateMany({
      where: {
        resumeId: resumeId,
        jobTitle: jobTitle,
        company: actualCompanyName
      },
      data: {
        optimizedContent: tailoredContent
      }
    });

    return NextResponse.json({
      success: true,
      message: `Resume tailored for ${jobTitle} at ${actualCompanyName}`,
      tailoredResume: frontendResume,
      tailoredContent
    });

  } catch (error) {
    console.error('❌ Tailoring error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to tailor resume',
        details: errorMessage,
        success: false
      },
      { status: 500 }
    );
  }
}