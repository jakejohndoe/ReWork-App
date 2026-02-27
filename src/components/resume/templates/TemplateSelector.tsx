'use client';

import React from 'react';
import { FileText, Layout, Briefcase } from 'lucide-react';

export type TemplateType = 'classic' | 'modern' | 'executive';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  className?: string;
}

const templates = [
  {
    id: 'classic' as TemplateType,
    name: 'Classic',
    description: 'Traditional, ATS-friendly',
    icon: FileText,
    preview: 'Single column, serif font, timeless design'
  },
  {
    id: 'modern' as TemplateType,
    name: 'Modern',
    description: 'Two-column, contemporary',
    icon: Layout,
    preview: 'Sidebar layout, clean sans-serif, visual hierarchy'
  },
  {
    id: 'executive' as TemplateType,
    name: 'Executive',
    description: 'Bold, leadership-focused',
    icon: Briefcase,
    preview: 'Premium spacing, accent banner, confident design'
  }
];

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
  className = ''
}: TemplateSelectorProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {templates.map((template) => {
        const Icon = template.icon;
        const isSelected = selectedTemplate === template.id;

        return (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`
              relative flex flex-col items-center p-3 rounded-lg border-2 transition-all
              ${isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
            `}
            title={template.preview}
          >
            <Icon className={`w-6 h-6 mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
              {template.name}
            </span>
            <span className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
              {template.description}
            </span>
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}