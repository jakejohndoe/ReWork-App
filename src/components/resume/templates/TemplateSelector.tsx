'use client';

import React from 'react';
import { FileText, Layout, Briefcase, Sparkles, Crown, Lock } from 'lucide-react';
import { toast } from 'sonner';

export type TemplateType = 'classic' | 'modern' | 'executive';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  className?: string;
  isPremium?: boolean;
}

const templates = [
  {
    id: 'classic' as TemplateType,
    name: 'Classic',
    description: 'Traditional, ATS-friendly',
    icon: FileText,
    preview: 'Single column, serif font, timeless design',
    isPremium: false
  },
  {
    id: 'modern' as TemplateType,
    name: 'Modern',
    description: 'Two-column, contemporary',
    icon: Layout,
    preview: 'Sidebar layout, clean sans-serif, visual hierarchy',
    isPremium: false
  },
  {
    id: 'executive' as TemplateType,
    name: 'Executive',
    description: 'Bold, leadership-focused',
    icon: Briefcase,
    preview: 'Premium spacing, accent banner, confident design',
    isPremium: false
  },
  {
    id: 'creative' as any,
    name: 'Creative',
    description: 'Designer-focused',
    icon: Sparkles,
    preview: 'Unique layouts, creative typography, stands out',
    isPremium: true
  },
  {
    id: 'minimal' as any,
    name: 'Minimal',
    description: 'Ultra-clean design',
    icon: Crown,
    preview: 'Maximum whitespace, elegant simplicity',
    isPremium: true
  }
];

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
  className = '',
  isPremium = false
}: TemplateSelectorProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {templates.map((template) => {
        const Icon = template.icon;
        const isSelected = selectedTemplate === template.id;
        const isLocked = template.isPremium && !isPremium;

        return (
          <button
            key={template.id}
            onClick={() => {
              if (isLocked) {
                toast.info('Upgrade to Pro to unlock premium templates', {
                  action: {
                    label: 'Upgrade',
                    onClick: () => {
                      const settingsButton = document.querySelector('[title="Account Settings"]') as HTMLButtonElement;
                      if (settingsButton) {
                        settingsButton.click();
                        setTimeout(() => {
                          const billingTab = document.querySelector('[data-tab="billing"]') as HTMLButtonElement;
                          if (billingTab) billingTab.click();
                        }, 100);
                      }
                    }
                  }
                });
              } else {
                onTemplateChange(template.id);
              }
            }}
            className={`
              relative flex flex-col items-center p-3 rounded-lg border-2 transition-all
              ${isLocked
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-75'
                : isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
            `}
            title={isLocked ? 'Pro feature' : template.preview}
          >
            {isLocked && (
              <div className="absolute inset-0 bg-gray-900/10 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-600" />
              </div>
            )}
            {template.isPremium && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                PRO
              </div>
            )}
            <Icon className={`w-6 h-6 mb-1 ${isLocked ? 'text-gray-400' : isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className={`text-xs font-medium ${isLocked ? 'text-gray-500' : isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
              {template.name}
            </span>
            <span className={`text-xs ${isLocked ? 'text-gray-400' : isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
              {template.description}
            </span>
            {isSelected && !isLocked && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}