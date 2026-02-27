import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-slate-300">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-slate prose-invert max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
                <p className="text-slate-300 leading-relaxed">
                  ReWork ("we," "our," or "us") respects your privacy and is committed to protecting your personal information.
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                  AI-powered resume optimization service.
                </p>
              </section>

              {/* 1. Information We Collect */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Personal Information</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li><strong>Account Information:</strong> Name, email address from Google OAuth</li>
                  <li><strong>Resume Content:</strong> Personal details, work experience, education, skills</li>
                  <li><strong>Job Information:</strong> Job descriptions and application details you provide</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Usage Information</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li><strong>Service Usage:</strong> Features used, resumes created, optimizations performed</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                  <li><strong>Session Data:</strong> Login sessions and authentication tokens</li>
                </ul>
              </section>

              {/* 2. How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Provide AI-powered resume optimization services</li>
                  <li>Authenticate your account and maintain your session</li>
                  <li>Store and retrieve your resume data and job applications</li>
                  <li>Process payments through Stripe (Pro plan)</li>
                  <li>Send service-related communications and updates</li>
                  <li>Improve our AI algorithms and service quality</li>
                  <li>Ensure compliance with our Terms of Service</li>
                </ul>
              </section>

              {/* 3. Information Sharing and Third Parties */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing and Third Parties</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  We work with the following third-party services:
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">OpenAI</h4>
                    <p className="text-slate-300">
                      Your resume content and job descriptions are processed by OpenAI's GPT models to generate
                      optimized resume content. OpenAI has committed to not using customer data to train their models.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white">Google OAuth</h4>
                    <p className="text-slate-300">
                      We use Google OAuth for secure authentication. We only receive your name and email address.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white">Stripe</h4>
                    <p className="text-slate-300">
                      Payment processing for Pro subscriptions. Stripe handles all payment data securely.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white">Supabase</h4>
                    <p className="text-slate-300">
                      Database and file storage provider. All data is encrypted in transit and at rest.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white">Vercel</h4>
                    <p className="text-slate-300">
                      Hosting platform for our application. Standard web hosting logs may be collected.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Data Storage and Security */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Data Storage and Security</h2>
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Encryption:</strong> All data is encrypted in transit using HTTPS and at rest in our database.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Access Control:</strong> Only authorized personnel have access to your data, and only when necessary
                    for service operations or support.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Data Location:</strong> Your data is stored in secure data centers in the United States.
                  </p>
                </div>
              </section>

              {/* 5. Data Retention */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention</h2>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li><strong>Active Accounts:</strong> We retain your data while your account is active</li>
                  <li><strong>Deleted Accounts:</strong> Data is permanently deleted within 30 days of account deletion</li>
                  <li><strong>Legal Requirements:</strong> We may retain certain data longer if required by law</li>
                  <li><strong>Backup Data:</strong> Backup copies are securely deleted within 90 days</li>
                </ul>
              </section>

              {/* 6. Your Rights and Choices */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights and Choices</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct your information through your account settings</li>
                  <li><strong>Deletion:</strong> Delete your account and all associated data</li>
                  <li><strong>Export:</strong> Download your resume data in standard formats</li>
                  <li><strong>Portability:</strong> Transfer your data to another service</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mt-4">
                  To exercise these rights, use the account settings in your dashboard or contact us at{' '}
                  <a href="mailto:privacy@rework.solutions" className="text-emerald-400 hover:text-emerald-300 underline">
                    privacy@rework.solutions
                  </a>
                </p>
              </section>

              {/* 7. Cookies and Tracking */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies and Tracking</h2>
                <p className="text-slate-300 leading-relaxed">
                  We use session cookies to maintain your login state and provide core functionality. These are essential
                  cookies required for the service to function. We do not use tracking cookies or third-party analytics.
                  You can manage cookies through your browser settings.
                </p>
              </section>

              {/* 8. International Users */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. International Users</h2>
                <p className="text-slate-300 leading-relaxed">
                  ReWork is operated from the United States. If you are accessing our service from outside the United States,
                  please be aware that your information may be transferred to, stored, and processed in the United States
                  where our servers are located and our central database is operated.
                </p>
              </section>

              {/* 9. Children's Privacy */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
                <p className="text-slate-300 leading-relaxed">
                  Our service is not directed to individuals under the age of 18. We do not knowingly collect personal
                  information from children under 18. If we become aware that a child under 18 has provided us with
                  personal information, we will take steps to delete such information.
                </p>
              </section>

              {/* 10. Changes to Privacy Policy */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-slate-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  email or through a notice on our website. Your continued use of the service after such changes
                  constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              {/* 11. Contact Us */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
                <p className="text-slate-300 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 text-slate-300">
                  <p>Email: <a href="mailto:privacy@rework.solutions" className="text-emerald-400 hover:text-emerald-300 underline">privacy@rework.solutions</a></p>
                  <p>General Support: <a href="mailto:support@rework.solutions" className="text-emerald-400 hover:text-emerald-300 underline">support@rework.solutions</a></p>
                </div>
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
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
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