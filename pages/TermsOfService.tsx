
import React from 'react';
import SEO from '../components/SEO';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 font-sans">
      <SEO title="Terms of Service" description="Terms and conditions for using StudiRad." />
      <div className="container mx-auto max-w-4xl bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">1. Introduction</h2>
            <p>Welcome to StudiRad. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">2. For Employers</h2>
            <p>Employers are responsible for providing accurate and truthful information about their organizations and opportunities. All new facility accounts are subject to a 24-hour verification process. StudiRad reserves the right to remove any posting that is misleading, discriminatory, or violates professional standards.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">3. For Students / Applicants</h2>
            <p>Applicants are responsible for verifying the legitimacy of any organization they interact with. StudiRad provides a platform for connection but does not guarantee the safety, legality, or quality of the opportunities posted.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">4. Disclaimer of Liability</h2>
            <p className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-amber-900 font-medium">
              StudiRad acts solely as a facilitator between imaging facilities and radiography professionals. We do not employ applicants nor do we represent employers. We shall not be held responsible for any issues, disputes, or damages arising from interactions or employment contracts formed through the platform. Both parties are encouraged to perform their own due diligence.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">5. Verification</h2>
            <p>While we attempt to verify institutions, an "Approved" or "Verified" badge is not an endorsement. It simply means the organization has passed our basic identity check.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">6. Modifications</h2>
            <p>We reserves the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
