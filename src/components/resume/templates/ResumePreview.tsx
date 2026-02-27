'use client';

import React, { useMemo } from 'react';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import type { TemplateType } from './TemplateSelector';

interface ResumePreviewProps {
  resumeData: any;
  template: TemplateType;
  accentColor?: string;
  className?: string;
}

export default function ResumePreview({
  resumeData,
  template,
  accentColor,
  className = ''
}: ResumePreviewProps) {
  // Transform the resume data to match our template format
  const transformedData = useMemo(() => {
    if (!resumeData) {
      return {
        contact: {
          name: 'Your Name',
          email: 'email@example.com',
          phone: '(555) 123-4567',
          location: 'City, State'
        },
        summary: 'Add your professional summary here...',
        experience: [],
        education: [],
        skills: []
      };
    }

    // Extract contact info
    const extractContact = () => {
      const contactData = resumeData.contactInfo || resumeData.contact;

      if (typeof contactData === 'object' && contactData !== null) {
        return {
          name: contactData.name ||
                contactData.fullName ||
                `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim() ||
                'Your Name',
          email: contactData.email || 'email@example.com',
          phone: contactData.phone || '(555) 123-4567',
          location: contactData.location || 'City, State',
          linkedin: contactData.linkedin,
          website: contactData.website
        };
      }

      // Parse string format
      if (typeof contactData === 'string') {
        try {
          const parsed = JSON.parse(contactData);
          return extractContact(); // Recursively call with parsed object
        } catch {
          // Manual parsing from string
          const lines = contactData.split('\n');
          return {
            name: lines[0] || 'Your Name',
            email: lines.find(l => l.includes('@')) || 'email@example.com',
            phone: lines.find(l => l.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/)) || '(555) 123-4567',
            location: lines[lines.length - 1] || 'City, State'
          };
        }
      }

      return {
        name: 'Your Name',
        email: 'email@example.com',
        phone: '(555) 123-4567',
        location: 'City, State'
      };
    };

    // Extract summary
    const extractSummary = () => {
      const summaryData = resumeData.professionalSummary;

      if (typeof summaryData === 'string') {
        try {
          const parsed = JSON.parse(summaryData);
          return parsed.summary || parsed.optimized || parsed.text || summaryData;
        } catch {
          return summaryData;
        }
      }

      if (typeof summaryData === 'object' && summaryData !== null) {
        return summaryData.summary || summaryData.optimized || summaryData.text || '';
      }

      return 'Add your professional summary here...';
    };

    // Extract work experience
    const extractExperience = () => {
      let expData = resumeData.workExperience;

      if (typeof expData === 'string') {
        try {
          expData = JSON.parse(expData);
        } catch {
          return [];
        }
      }

      if (!Array.isArray(expData)) return [];

      return expData.map(job => ({
        title: job.jobTitle || job.title || job.position || job.role || 'Position',
        company: job.company || 'Company Name',
        startDate: job.startDate || '2020',
        endDate: job.endDate || 'Present',
        achievements: Array.isArray(job.achievements)
          ? job.achievements
          : job.description
            ? [job.description]
            : ['Add your achievements here...']
      }));
    };

    // Extract education
    const extractEducation = () => {
      let eduData = resumeData.education;

      if (typeof eduData === 'string') {
        try {
          eduData = JSON.parse(eduData);
        } catch {
          return [];
        }
      }

      if (!Array.isArray(eduData)) return [];

      return eduData.map(edu => ({
        degree: edu.degree || 'Degree',
        field: edu.field || edu.major,
        institution: edu.institution || edu.school || 'University',
        graduationYear: edu.graduationYear || edu.year || edu.endDate || '2020',
        gpa: edu.gpa,
        relevantCourses: Array.isArray(edu.relevantCoursework)
          ? edu.relevantCoursework
          : edu.relevantCoursework
            ? [edu.relevantCoursework]
            : []
      }));
    };

    // Extract skills
    const extractSkills = () => {
      let skillsData = resumeData.skills;

      if (typeof skillsData === 'string') {
        try {
          skillsData = JSON.parse(skillsData);
        } catch {
          return skillsData.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }

      if (Array.isArray(skillsData)) {
        return skillsData.filter(Boolean);
      }

      if (typeof skillsData === 'object' && skillsData !== null) {
        const allSkills: string[] = [];
        Object.keys(skillsData).forEach(category => {
          if (Array.isArray(skillsData[category])) {
            allSkills.push(...skillsData[category]);
          }
        });
        return allSkills.filter(Boolean);
      }

      return [];
    };

    return {
      contact: extractContact(),
      summary: extractSummary(),
      experience: extractExperience(),
      education: extractEducation(),
      skills: extractSkills()
    };
  }, [resumeData]);

  // Render the selected template
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={transformedData} accentColor={accentColor} />;
      case 'executive':
        return <ExecutiveTemplate data={transformedData} accentColor={accentColor} />;
      case 'classic':
      default:
        return <ClassicTemplate data={transformedData} accentColor={accentColor} />;
    }
  };

  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
      {renderTemplate()}
    </div>
  );
}