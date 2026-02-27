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

interface ModernTemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export default function ModernTemplate({
  data,
  accentColor = '#7c3aed'
}: ModernTemplateProps) {
  return (
    <div className="bg-white w-full h-full flex font-sans">
      {/* Left Sidebar */}
      <aside className="w-[35%] bg-gray-50 p-8">
        {/* Name */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {data.contact.name}
          </h1>
          <div className="w-16 h-1 rounded-full mb-6" style={{ backgroundColor: accentColor }}></div>
        </div>

        {/* Contact */}
        <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-600">
            Contact
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="break-all">{data.contact.email}</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{data.contact.phone}</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{data.contact.location}</span>
            </div>
            {data.contact.linkedin && (
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="break-all text-xs">{data.contact.linkedin}</span>
              </div>
            )}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-600">
            Skills
          </h3>
          <div className="space-y-3">
            {data.skills.map((skill, index) => (
              <div key={index}>
                <p className="text-xs text-gray-700 mb-1">{skill}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: accentColor,
                      width: `${80 + (index % 3) * 10}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-600">
            Education
          </h3>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-semibold text-sm text-gray-900">
                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
              </h4>
              <p className="text-xs text-gray-700">{edu.institution}</p>
              <p className="text-xs text-gray-600">{edu.graduationYear}</p>
              {edu.gpa && (
                <p className="text-xs text-gray-600 mt-1">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </section>
      </aside>

      {/* Right Main Content */}
      <main className="flex-1 p-8 overflow-hidden">
        {/* Professional Summary */}
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>
            About Me
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {data.summary}
          </p>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>
            Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((job, index) => (
              <div key={index} className="relative">
                <div
                  className="absolute left-0 top-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                ></div>
                <div className="ml-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-base text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {job.startDate} – {job.endDate}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {job.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="mr-2 flex-shrink-0" style={{ color: accentColor }}>▸</span>
                        <span className="flex-1 break-words pr-2">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}