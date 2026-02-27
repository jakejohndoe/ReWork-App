import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to ReWork
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-slate-300">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-slate prose-invert max-w-none">
            <div className="space-y-8">
              {/* 1. Agreement to Terms */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
                <p className="text-slate-300 leading-relaxed">
                  By accessing or using ReWork (the "Service"), you agree to be bound by these Terms of Service ("Terms").
                  If you do not agree to these Terms, you may not use the Service.
                </p>
              </section>

              {/* 2. Description of Service */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  ReWork provides AI-powered resume optimization services that allow users to:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Upload and edit resume content</li>
                  <li>Automatically optimize resumes for specific job descriptions using AI</li>
                  <li>Download optimized resumes in PDF format</li>
                  <li>Store and manage multiple resume versions</li>
                </ul>
              </section>

              {/* 3. Account and Usage */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Account and Usage</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  To use ReWork, you must create an account using Google OAuth. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Ensuring all uploaded content is accurate and not fraudulent</li>
                  <li>Complying with all applicable laws and regulations</li>
                </ul>
              </section>

              {/* 4. Content Ownership */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Content Ownership</h2>
                <p className="text-slate-300 leading-relaxed">
                  You retain full ownership of your resume content, job descriptions, and personal information uploaded to ReWork.
                  ReWork does not claim ownership of your content. However, by using the Service, you grant ReWork a limited license
                  to process your content through AI services (including OpenAI) to provide resume optimization services.
                </p>
              </section>

              {/* 5. AI Processing */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. AI Processing</h2>
                <p className="text-slate-300 leading-relaxed">
                  ReWork uses third-party AI services (OpenAI) to analyze and optimize your resume content. By using the Service,
                  you acknowledge that your resume data will be processed by these AI systems to generate tailored content.
                  We do not store or train models on your personal data.
                </p>
              </section>

              {/* 6. Subscription and Billing */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Subscription and Billing</h2>
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Free Plan:</strong> Limited to 3 resumes per month with basic features.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Pro Plan:</strong> $3/month subscription with unlimited resumes and premium features.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Billing is processed through Stripe. You may cancel your subscription at any time through your account settings.
                    Cancellations take effect at the end of your current billing period.
                  </p>
                </div>
              </section>

              {/* 7. Prohibited Use */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Prohibited Use</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  You may not use ReWork to:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Upload false, misleading, or fraudulent information</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights of others</li>
                  <li>Attempt to reverse engineer or hack the Service</li>
                  <li>Abuse or overload our systems</li>
                </ul>
              </section>

              {/* 8. Termination */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Termination</h2>
                <p className="text-slate-300 leading-relaxed">
                  ReWork reserves the right to suspend or terminate your account at any time for violation of these Terms
                  or other conduct we deem harmful to the Service or other users. You may delete your account at any time
                  through your account settings.
                </p>
              </section>

              {/* 9. Disclaimers */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Disclaimers</h2>
                <p className="text-slate-300 leading-relaxed">
                  THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. ReWork does not guarantee that AI-optimized
                  resumes will result in job offers or interviews. Users are responsible for reviewing and approving all
                  AI-generated content before use.
                </p>
              </section>

              {/* 10. Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Limitation of Liability</h2>
                <p className="text-slate-300 leading-relaxed">
                  IN NO EVENT SHALL REWORK BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                  INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE
                  OF THE SERVICE.
                </p>
              </section>

              {/* 11. Changes to Terms */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
                <p className="text-slate-300 leading-relaxed">
                  ReWork reserves the right to modify these Terms at any time. We will notify users of material changes
                  via email or through the Service. Continued use of the Service after changes constitutes acceptance
                  of the new Terms.
                </p>
              </section>

              {/* 12. Contact Information */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
                <p className="text-slate-300 leading-relaxed">
                  For questions about these Terms, please contact us at{' '}
                  <a href="mailto:support@rework.solutions" className="text-emerald-400 hover:text-emerald-300 underline">
                    support@rework.solutions
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-slate-900/30 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-slate-400 text-sm">
            <p>© 2026 ReWork. All rights reserved.</p>
            <div className="mt-2 space-x-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="mailto:support@rework.solutions" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}