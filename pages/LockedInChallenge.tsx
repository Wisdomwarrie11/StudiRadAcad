import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  ClipboardCheck, 
  TrendingUp, 
  Award, 
  Medal, 
  Atom, 
  Brain, 
  Scan, 
  ShieldAlert, 
  Search, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// --- Types ---
interface CourseItem {
  week: string;
  course: string;
  topics: string;
  alignment: string;
  icon: React.ReactNode;
}

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  details: string[];
}

const LockedInChallenge: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const howItWorks: FeatureItem[] = [
    { 
      icon: <BookOpen className="w-8 h-8 text-amber-400" />, 
      title: "Weekly Study Scope", 
      details: ["Assigned weekly study areas", "Access resources and videos", "Focus on essential topics"] 
    },
    { 
      icon: <Clock className="w-8 h-8 text-amber-400" />, 
      title: "Self-Paced Learning", 
      details: ["Learn at your own pace", "Access anytime", "Review topics multiple times"] 
    },
    { 
      icon: <ClipboardCheck className="w-8 h-8 text-amber-400" />, 
      title: "Weekly Assessments", 
      details: ["Complete weekly assessments", "Track progress", "Private grading"] 
    },
    { 
      icon: <TrendingUp className="w-8 h-8 text-amber-400" />, 
      title: "Track Growth", 
      details: ["Visualize performance trends", "Identify strengths/weaknesses", "Compare with past attempts"] 
    },
    { 
      icon: <Award className="w-8 h-8 text-amber-400" />, 
      title: "Final Evaluation", 
      details: ["Final cumulative assessment", "Identify knowledge gaps", "High performers get rewards"] 
    },
    { 
      icon: <Medal className="w-8 h-8 text-amber-400" />, 
      title: "Recognition & Reward", 
      details: ["Earn recognition", "Receive rewards", "Celebrate your learning journey"] 
    },
  ];

  const benefits = [
    "Build intermediate & advanced radiography knowledge",
    "Enhance self-discipline and study habits",
    "Benchmark knowledge anonymously",
    "Prepare for global standard competency areas",
    "Stay engaged and motivated throughout the program",
  ];

  const courses: CourseItem[] = [
    { 
      week: "Week 1", 
      course: "Adv. Physics & Imaging Principles", 
      topics: "X-ray interactions, Digital image formation & optimization, Patient dose management", 
      alignment: "Aligned with globally recommended radiography physics knowledge",
      icon: <Atom className="w-6 h-6" />
    },
    { 
      week: "Week 2", 
      course: "Adv. Anatomy & Cross-Sectional", 
      topics: "Cross-sectional anatomy, Pathological variants, Interventional anatomy", 
      alignment: "Aligned with international imaging anatomy standards",
      icon: <Brain className="w-6 h-6" />
    },
    { 
      week: "Week 3", 
      course: "Complex Procedures & Positioning", 
      topics: "Trauma imaging, Contrast studies, Pediatric/geriatric positioning", 
      alignment: "Aligned with globally recommended procedural competency",
      icon: <Scan className="w-6 h-6" />
    },
    { 
      week: "Week 4", 
      course: "Adv. Radiation Safety & Protection", 
      topics: "ALARA principles, Occupational monitoring, Regulatory compliance", 
      alignment: "Aligned with international radiation safety standards",
      icon: <ShieldAlert className="w-6 h-6" />
    },
    { 
      week: "Week 5", 
      course: "Image Evaluation & QA", 
      topics: "Image quality metrics, Artifact troubleshooting, QA protocols", 
      alignment: "Aligned with international QA practices",
      icon: <Search className="w-6 h-6" />
    },
    { 
      week: "Week 6", 
      course: "Specialized & Emerging Modalities", 
      topics: "Advanced CT, MRI sequences, AI-assisted imaging", 
      alignment: "Aligned with emerging global radiography trends",
      icon: <Cpu className="w-6 h-6" />
    },
  ];

  const timelineEvents = [
    { date: "31st January 2026", event: "Registration Closes", highlight: true },
    { date: "4th February 2026", event: "Onboarding Session" },
    { date: "13th February 2026", event: "First Assessment" },
    { date: "20th February 2026", event: "Second Assessment" },
    { date: "27th February 2026", event: "Third Assessment" },
    { date: "6th March 2026", event: "Fourth Assessment" },
    { date: "13th March 2026", event: "Fifth Assessment" },
    { date: "20th March 2026", event: "Grand Assessment", highlight: true },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* --- Hero Section --- */}
      <section className="relative bg-slate-900 text-white pt-24 pb-20 px-6 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-sm font-medium mb-6">
            <Medal className="w-4 h-4" />
            <span>Official Cohort 2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            StudiRad <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Locked-In Challenge™</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light mb-8">
            6 Weeks &bull; 6 Courses &bull; 6 Assessments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://forms.gle/8Za2DaYb8tnGFgqo8" 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-amber-500/25"
            >
              Join The Next Cohort
            </a>
            <button 
              onClick={() => document.getElementById('outline')?.scrollIntoView({ behavior: 'smooth'})}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              View Curriculum
            </button>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            A structured approach to mastering advanced radiography concepts through consistent effort and evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {howItWorks.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
              <ul className="space-y-2">
                {item.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-slate-600 text-sm">
                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* --- Benefits Section --- */}
      <section className="py-20 bg-slate-900 text-white px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Join The Challenge?</h2>
              <p className="text-slate-400 mb-8 text-lg">
                This isn't just another course. It's a commitment to your professional excellence. Join a community of dedicated radiographers pushing the boundaries of their knowledge.
              </p>
              <div className="grid gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <CheckCircle2 className="text-green-400 flex-shrink-0 w-6 h-6" />
                    <span className="font-medium text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Visual/Stat Box */}
            <div className="md:w-1/2 w-full">
               <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-1 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                 <div className="bg-slate-900 rounded-xl p-8 text-center h-full flex flex-col justify-center items-center">
                    <Award className="w-20 h-20 text-amber-400 mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Certificate of Completion</h3>
                    <p className="text-slate-400">Awarded to participants who complete all 6 weeks and pass the final evaluation.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Course Curriculum --- */}
      <section id="outline" className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Course Outline</h2>
          
          <div className="space-y-4">
            {courses.map((c, idx) => (
              <div key={idx} className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 ${activeAccordion === idx ? 'border-amber-400 shadow-md' : 'border-slate-200'}`}>
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${activeAccordion === idx ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                      {c.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{c.week}</span>
                      <h3 className="text-lg font-bold text-slate-900">{c.course}</h3>
                    </div>
                  </div>
                  {activeAccordion === idx ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50">
                    <div className="mt-4 space-y-2">
                      <p className="text-slate-700"><span className="font-semibold text-slate-900">Topics:</span> {c.topics}</p>
                      <p className="text-slate-600 text-sm italic"><span className="font-semibold not-italic text-slate-700">Standard:</span> {c.alignment}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Registration & Timeline Grid --- */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: Pricing Card */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Registration Details</h2>
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl flex-grow relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 bg-amber-500 text-xs font-bold text-slate-900 px-3 py-1 rounded-bl-xl">
                  LIMITED SLOTS
                </div>
                
                <div className="mb-8">
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Registration Fee</p>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-extrabold text-white">₦5,000</span>
                    <span className="text-slate-400 ml-2">/ participant</span>
                  </div>
                  <p className="text-red-400 font-semibold mt-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Ends: 31st January 2026
                  </p>
                </div>

                <div className="border-t border-slate-700 pt-8 mt-auto">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                    <h4 className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                      <AlertTriangle className="w-5 h-5" /> Important
                    </h4>
                    <p className="text-sm text-slate-300 mb-3">
                      Before proceeding with payment, you must read and accept the program disclaimer.
                    </p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-sm text-white underline hover:text-amber-400 transition-colors"
                    >
                      Read Disclaimer
                    </button>
                  </div>

                  <a 
                    href="https://forms.gle/8Za2DaYb8tnGFgqo8"
                    target="_blank" 
                    rel="noreferrer"
                    className="block w-full text-center bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Proceed to Register
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Timeline */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Important Dates</h2>
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 h-full">
                <div className="space-y-6">
                  {timelineEvents.map((item, idx) => (
                    <div key={idx} className="flex items-start group">
                      <div className="flex flex-col items-center mr-4">
                         <div className={`w-3 h-3 rounded-full mt-1.5 ${item.highlight ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-slate-300'}`}></div>
                         {idx !== timelineEvents.length - 1 && <div className="w-0.5 h-full bg-slate-200 my-1"></div>}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-semibold ${item.highlight ? 'text-amber-600' : 'text-slate-500'}`}>{item.date}</p>
                        <p className={`text-lg font-medium ${item.highlight ? 'text-slate-900' : 'text-slate-700'}`}>{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Footer CTA --- */}
      <section className="bg-slate-900 text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Stay Locked-In?</h2>
          <p className="text-xl text-slate-300 mb-10">Limited slots available. Join the community of serious minds dedicated to advancement.</p>
          <a 
            href="https://forms.gle/8Za2DaYb8tnGFgqo8" 
            target="_blank" 
            rel="noreferrer"
            className="inline-block px-10 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-lg rounded-full transition-transform transform hover:scale-105"
          >
            Register Now
          </a>
        </div>
      </section>

      {/* --- Disclaimer Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" />
                Important Disclaimer
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-slate-600 leading-relaxed overflow-y-auto">
              <p>
                <strong className="text-slate-900">StudiRad</strong> is an independent academic-support initiative focused on promoting
                consistency, discipline, and self-driven academic development among Radiographers.
                StudiRad does <strong className="text-red-500">not</strong> represent, partner with, nor operate under the authority
                of any Nigerian or international Radiography certification board, academic council,
                licensing body, residency body, internship program, or examination organization.
              </p>

              <p>
                The weekly and final assessments provided within the StudiRad Locked-In Challenge
                are created solely for educational growth, practice and personal benchmarking. They are
                <strong className="text-red-500"> not</strong> sourced from, endorsed by, or reproduced from any official exam question
                bank or confidential database.
              </p>

              <p>
                StudiRad does <strong className="text-red-500">not</strong> offer lectures, one-on-one training, teaching classes,
                internship preparation coaching, or mentorship during this 6-week program. 
                The platform provides suggested resources and a structured learning outline to guide
                your individual self-study.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
                <p className="text-slate-800 font-medium">
                  All payments must be made <strong>only</strong> to the officially provided account or channel
                  listed on StudiRad platforms. StudiRad will <strong>never</strong> call or message participants
                  privately requesting payment, login details, OTP, or personal data.
                </p>
              </div>

              <p className="text-slate-900 font-semibold">
                StudiRad is not liable for unmet personal expectations, personal academic outcomes, 
                examination results, internship or job placement decisions, or certification eligibility.
              </p>

              <p>
                By proceeding, you acknowledge that you are engaging voluntarily for developmental
                motivation and knowledge improvement only.
              </p>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors"
              >
                I Do Not Accept
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-green-600/20"
              >
                I Understand & Accept
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LockedInChallenge;
