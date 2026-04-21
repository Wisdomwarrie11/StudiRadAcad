
import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 font-sans">
      <SEO title="Privacy Policy" description="How we handle your data at StudiRad." />
      <div className="container mx-auto max-w-4xl bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">1. Data Collection</h2>
            <p>We collect minimal data necessary to facilitate employment connections. This includes contact names, organization names, email addresses, and phone numbers. We do not collect high-sensitivity government identifiers or financial details beyond what's required for service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">2. Use of Data</h2>
            <p>Your data is used to verify organization identities and to display contact information for job applications. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">3. For Employers</h2>
            <p>The organization details you provide (address, website, contact person) will be publicly visible on job postings you create to allow students to verify your facility and apply.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">4. Data Security</h2>
            <p>We use industry-standard security measures provided by Firebase to protect your account and data. However, no internet-based service is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">5. Your Rights</h2>
            <p>You can request to delete your account and associated data at any time by contacting our support team or using the dashboard settings where available.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
