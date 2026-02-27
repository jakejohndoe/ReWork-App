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

interface ClassicTemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export default function ClassicTemplate({
  data,
  accentColor = '#1e40af'
}: ClassicTemplateProps) {
  return (
    <div className="bg-white w-full h-full p-12 font-serif text-gray-900">
      {/* Header */}
      <header className="text-center mb-8 border-b-2 border-gray-800 pb-6">
        <h1 className="text-4xl font-bold mb-3 tracking-wide">
          {data.contact.name}
        </h1>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600 flex-wrap">
          <span>{data.contact.email}</span>
          <span className="text-gray-400">•</span>
          <span>{data.contact.phone}</span>
          <span className="text-gray-400">•</span>
          <span>{data.contact.location}</span>
          {data.contact.linkedin && (
            <>
              <span className="text-gray-400">•</span>
              <span>{data.contact.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>
          Professional Summary
        </h2>
        <p className="text-sm leading-relaxed text-justify">
          {data.summary}
        </p>
      </section>

      {/* Professional Experience */}
      <section className="mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>
          Professional Experience
        </h2>
        <div className="space-y-5">
          {data.experience.map((job, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-base">{job.title}</h3>
                  <p className="text-sm italic text-gray-700">{job.company}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {job.startDate} – {job.endDate}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {job.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-sm leading-relaxed">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </h3>
                <p className="text-sm italic text-gray-700">{edu.institution}</p>
                {edu.gpa && (
                  <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                )}
              </div>
              <span className="text-sm text-gray-600">{edu.graduationYear}</span>
            </div>
            {edu.relevantCourses && edu.relevantCourses.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Relevant Coursework:</span> {edu.relevantCourses.join(', ')}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-lg font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>
          Skills
        </h2>
        <p className="text-sm leading-relaxed">
          {data.skills.join(' • ')}
        </p>
      </section>
    </div>
  );
}