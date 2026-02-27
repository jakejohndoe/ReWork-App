'use client';

import React from 'react';

export interface ResumeData {
  contact: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    field?: string;
    institution: string;
    graduationYear: string;
    gpa?: string;
    relevantCourses?: string[];
  }>;
  skills: string[];
}

interface ExecutiveTemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export default function ExecutiveTemplate({
  data,
  accentColor = '#dc2626'
}: ExecutiveTemplateProps) {
  return (
    <div className="bg-white w-full h-full font-sans">
      {/* Bold Header with Accent Banner */}
      <header className="relative">
        <div className="h-3 w-full" style={{ backgroundColor: accentColor }}></div>
        <div className="px-12 py-8 bg-gray-900 text-white">
          <h1 className="text-4xl font-light tracking-wider mb-4">
            {data.contact.name}
          </h1>
          <div className="flex items-center gap-6 text-sm opacity-90">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {data.contact.email}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {data.contact.phone}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {data.contact.location}
            </span>
            {data.contact.linkedin && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="px-12 py-10">
        {/* Executive Summary */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-900 tracking-wide flex items-center">
            <span className="w-12 h-0.5 mr-4" style={{ backgroundColor: accentColor }}></span>
            EXECUTIVE SUMMARY
          </h2>
          <p className="text-base leading-relaxed text-gray-700 text-justify">
            {data.summary}
          </p>
        </section>

        {/* Professional Experience */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6 text-gray-900 tracking-wide flex items-center">
            <span className="w-12 h-0.5 mr-4" style={{ backgroundColor: accentColor }}></span>
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-8">
            {data.experience.map((job, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <p className="text-base font-semibold" style={{ color: accentColor }}>
                      {job.company}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded">
                    {job.startDate} – {job.endDate}
                  </span>
                </div>
                <div className="pl-4">
                  {job.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start mb-2">
                      <span
                        className="w-2 h-2 rounded-full mt-1.5 mr-3 flex-shrink-0"
                        style={{ backgroundColor: accentColor }}
                      ></span>
                      <p className="text-sm leading-relaxed text-gray-700 flex-1">
                        {achievement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-12">
          {/* Core Competencies */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-gray-900 tracking-wide flex items-center">
              <span className="w-12 h-0.5 mr-4" style={{ backgroundColor: accentColor }}></span>
              CORE COMPETENCIES
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <span
                    className="w-1.5 h-1.5 rounded-full mr-2"
                    style={{ backgroundColor: accentColor }}
                  ></span>
                  <span className="text-sm text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Education & Credentials */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-gray-900 tracking-wide flex items-center">
              <span className="w-12 h-0.5 mr-4" style={{ backgroundColor: accentColor }}></span>
              EDUCATION
            </h2>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-base text-gray-900">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </h3>
                <p className="text-sm font-semibold text-gray-700">{edu.institution}</p>
                <p className="text-sm text-gray-600">Graduated {edu.graduationYear}</p>
                {edu.gpa && (
                  <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                )}
                {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    <span className="font-semibold">Key Coursework:</span> {edu.relevantCourses.slice(0, 3).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}