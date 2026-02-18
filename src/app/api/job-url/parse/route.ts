import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as cheerio from 'cheerio';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    // Validate URL format
    let validatedUrl: URL;
    try {
      validatedUrl = new URL(url);
      if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    console.log('🌐 Fetching job posting from:', validatedUrl.href);

    // Fetch the webpage
    const response = await fetch(validatedUrl.href, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Parse HTML with cheerio
    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script').remove();
    $('style').remove();
    $('noscript').remove();

    // Extract text content - focus on body or main content area
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';

    // Try to find job content in common selectors
    let jobContent = '';

    // Common job posting selectors
    const contentSelectors = [
      '[class*="job-description"]',
      '[class*="job-details"]',
      '[class*="posting-description"]',
      '[id*="job-description"]',
      '[id*="job-details"]',
      'article',
      'main',
      '[role="main"]',
      '.content',
      '#content'
    ];

    for (const selector of contentSelectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim().length > 100) {
        jobContent = element.text();
        break;
      }
    }

    // Fallback to body text if no specific content found
    if (!jobContent) {
      jobContent = $('body').text();
    }

    // Clean up the text
    jobContent = jobContent
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .substring(0, 10000); // Limit to 10k chars

    console.log('📄 Extracted text length:', jobContent.length);

    // Use OpenAI to extract structured job data
    const prompt = `Extract job posting information from the following webpage content.

Page Title: ${title}
Meta Description: ${metaDescription}

Page Content:
${jobContent}

Extract and return this JSON structure with the ACTUAL data from the job posting:
{
  "jobTitle": "<actual job title>",
  "company": "<actual company name>",
  "location": "<actual job location>",
  "jobDescription": "<full job description including responsibilities, requirements, qualifications, benefits, etc.>"
}

Important:
- Extract the ACTUAL job title, company, and location from the content
- Include the FULL job description with all details
- If any field cannot be determined, use empty string ""
- Return valid JSON only`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a job posting parser. Extract accurate information from job postings and return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 3000,
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim();
    if (!aiResponse) {
      throw new Error('Empty response from AI');
    }

    // Parse the AI response
    const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
    const jobData = JSON.parse(cleanedResponse);

    console.log('✅ Job data extracted successfully:', {
      jobTitle: jobData.jobTitle?.substring(0, 50) + '...',
      company: jobData.company,
      location: jobData.location,
      descriptionLength: jobData.jobDescription?.length
    });

    return NextResponse.json({
      success: true,
      data: jobData
    });

  } catch (error) {
    console.error('❌ Job URL parsing error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to parse job posting',
        details: errorMessage,
        success: false
      },
      { status: 500 }
    );
  }
}