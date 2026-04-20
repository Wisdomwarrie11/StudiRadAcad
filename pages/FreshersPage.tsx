import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Layers, 
  Stethoscope, 
  GraduationCap, 
  Clock, 
  Building2, 
  ChevronDown, 
  MessageCircle,
  Activity,
  Zap,
  Target,
  Search,
  CheckCircle2,
  Radiation,
  Microscope,
  HardHat,
  Eye,
  Scan,
  HeartPulse
} from 'lucide-react';
import SEO from '../components/SEO';

const FreshersPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const branches = [
    {
      title: "Diagnostic Radiography",
      icon: Scan,
      desc: "The most common branch. Using imaging technology to identify injuries and diseases inside the body.",
      details: ["Hospital-based", "Patient-focused", "Works with Radiologists"]
    },
    {
      title: "Therapeutic Radiography",
      icon: Radiation,
      desc: "Also known as Radiotherapy. Using high-energy radiation to treat cancer by destroying malignant cells.",
      details: ["Oncology focus", "Treatment planning", "Long-term patient care"]
    },
    {
      title: "Industrial Radiography",
      icon: HardHat,
      desc: "Using radiation to inspect materials, welds, and pipelines for hidden flaws without destroying them.",
      details: ["Non-destructive testing", "Oil & Gas industry", "No patient contact"]
    }
  ];

  const modalities = [
    { title: "X-ray (General)", icon: Zap, desc: "The foundation. Using electromagnetic radiation to create images of bones and certain tissues." },
    { title: "Fluoroscopy", icon: Eye, desc: "A 'real-time' X-ray movie. Used to view moving body parts like the digestive system or blood flow." },
    { title: "Mammography", icon: Target, desc: "Specialized low-dose X-ray imaging used to detect early signs of breast cancer." },
    { title: "CT Imaging", icon: Layers, desc: "A sophisticated X-ray technique that creates 3D cross-sectional images of the body." },
    { title: "Ultrasound (USS)", icon: Activity, desc: "Using high-frequency sound waves (no radiation) to monitor babies and visualize internal organs." },
    { title: "MRI", icon: Scan, desc: "Powerful magnets and radio waves creating highly detailed images of soft tissues like the brain." },
    { title: "Nuclear Medicine", icon: Sparkles, desc: "Administering radioactive substances to see how organs function in real-time." },
    { title: "Interventional", icon: HeartPulse, desc: "Using imaging to guide minimally invasive procedures like clearing blocked arteries." }
  ];

  const foundations = [
    { name: "Physics", icon: Zap, color: "brand-primary", reason: "Essential for understanding radiation, X-ray production, and imaging hardware." },
    { name: "Biology", icon: BookOpen, color: "brand-accent", reason: "Crucial for anatomy, physiology, and understanding biological effects of radiation." },
    { name: "Chemistry", icon: Layers, color: "brand-primary", reason: "Helps in understanding contrast media and radiopharmaceuticals." },
    { name: "Mathematics", icon: GraduationCap, color: "brand-accent", reason: "Used for image processing algorithms and radiation dosing calculations." }
  ];

  const universities = [
    "University of Nigeria, Nsukka (UNN)",
    "Nnamdi Azikiwe University, Awka (UNIZIK)",
    "University of Lagos (UNILAG)",
    "University of Maiduguri (UNIMAID)",
    "Bayero University Kano (BUK)",
    "Usmanu Danfodiyo University, Sokoto (UDUS)",
    "University of Calabar (UNICAL)",
    "Federal University of Technology, Owerri (FUTO)",
    "Lagos State University (LASU)",
    "Enugu State University of Science and Technology (ESUT)"
  ];

  const faqs = [
    { q: "Is Radiography hard to study?", a: "It is challenging but rewarding. It requires a balance of physical sciences (Physics) and biological sciences (Anatomy). If you enjoy technology and healthcare, you'll thrive." },
    { q: "What is the job market like in Nigeria?", a: "Radiographers are in high demand. Diagnostic centers and hospitals are constantly looking for skilled professionals across all modalities." },
    { q: "Can I practice abroad with a Nigerian degree?", a: "Yes! Nigerian radiography degrees are well-regarded. However, you will usually need to write a professional licensing exam in your target country (e.g., HCPC for UK or ARRT for USA)." },
    { q: "What is the starting salary?", a: "Starting salaries vary by facility, but Radiographers are among the higher-paid Allied Health professionals due to the specialized technology involved." }
  ];

  const openWhatsApp = () => {
    const msg = "Hello StudiRad, I am a prospective student/fresher and I would like to speak to a radiographer about the profession.";
    window.open(`https://wa.me/2347041197027?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20 font-sans">
      <SEO 
        title="Starting Your Radiography Journey" 
        description="Learn about radiography branches (Diagnostic, Therapeutic, Industrial), modalities, foundational subjects, and universities in Nigeria."
      />

      {/* Hero Section */}
      <section className="relative py-24 bg-brand-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-slate-900 opacity-95"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 bg-brand-accent/20 text-brand-accent text-xs font-black uppercase tracking-widest rounded-full mb-6 border border-brand-accent/30">
              Future Radiographers Hub
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Master the Art & Science of <span className="text-brand-accent">Medical Imaging</span></h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-light">
              Discover a profession where technology meets empathy. From diagnosing fractures to fighting cancer, radiography is the eye of modern medicine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Branches of Radiography */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-brand-dark mb-4">The Three Pillars of Radiography</h2>
            <p className="text-slate-500">Radiography is not just about hospitals. Explore the different career paths.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {branches.map((b, idx) => (
              <div key={idx} className="p-10 rounded-[3rem] bg-brand-light border border-slate-100 flex flex-col items-center text-center group hover:bg-brand-dark transition-all duration-500 hover:shadow-2xl">
                <div className="w-20 h-20 bg-white text-brand-primary rounded-3xl flex items-center justify-center mb-8 shadow-md group-hover:bg-brand-accent group-hover:text-brand-dark transition-all duration-500">
                  <b.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-4 group-hover:text-white">{b.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 group-hover:text-slate-300">{b.desc}</p>
                <div className="mt-auto space-y-2">
                  {b.details.map((detail, dIdx) => (
                    <div key={dIdx} className="text-[10px] font-bold uppercase tracking-widest text-brand-primary group-hover:text-brand-accent">
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modalities Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-brand-dark mb-4">Common Modalities</h2>
            <p className="text-slate-500">The specialized machines and techniques you will master.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modalities.map((m, idx) => (
              <div key={idx} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-brand-accent/30 hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-brand-light text-brand-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-accent group-hover:text-brand-dark transition-all">
                  <m.icon size={24} />
                </div>
                <h4 className="text-lg font-bold text-brand-dark mb-3">{m.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foundations Section */}
      <section className="py-24 bg-brand-dark text-white overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] -ml-20 -mb-20"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8">What You Need to Know First</h2>
              <p className="text-slate-400 mb-12 leading-relaxed">
                Before stepping into the X-ray suite, you'll need a strong foundation in these core areas. StudiRad Academy helps bridge these gaps for new students.
              </p>
              <div className="grid gap-6">
                {foundations.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="p-3 bg-brand-accent rounded-2xl text-brand-dark">
                      <f.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{f.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{f.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-brand-light rounded-[4rem] p-12 text-brand-dark shadow-2xl relative">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand-accent rounded-3xl flex items-center justify-center text-brand-dark shadow-xl rotate-12">
                <Clock size={32} />
              </div>
              <h3 className="text-3xl font-black mb-6">Educational Path</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center shrink-0 font-bold">1</div>
                  <p className="text-sm font-medium leading-relaxed"><strong>5 Years</strong> of University study in Nigeria leads to a B.Sc Radiography or B.Rad degree.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center shrink-0 font-bold">2</div>
                  <p className="text-sm font-medium leading-relaxed">Mandatory <strong>1-Year Internship</strong> at an RRBN-accredited teaching hospital or medical center.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center shrink-0 font-bold">3</div>
                  <p className="text-sm font-medium leading-relaxed">Professional Licensing by the <strong>Radiographers Registration Board of Nigeria (RRBN)</strong>.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center shrink-0 font-bold">4</div>
                  <p className="text-sm font-medium leading-relaxed">Global Practice: Write the <strong>HCPC (UK)</strong> or <strong>ARRT (USA)</strong> exams after graduation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Universities & Schools */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
             <div>
                <h2 className="text-3xl font-black text-brand-dark mb-2">Accredited Schools</h2>
                <p className="text-slate-500">Nigerian universities currently offering Radiography programs.</p>
             </div>
             <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search school..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-accent transition-all" />
             </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {universities.map((uni, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 font-bold hover:bg-brand-light hover:border-brand-primary transition-all group">
                    <Building2 className="text-brand-primary opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
                    <span className="text-sm">{uni}</span>
                </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-brand-accent/10 rounded-2xl border border-brand-accent/20 flex items-center gap-4">
            <CheckCircle2 className="text-brand-accent shrink-0" />
            <p className="text-xs text-brand-dark font-medium leading-relaxed">Ensure the program you choose is accredited by the <strong>RRBN</strong> and <strong>NUC</strong> to guarantee you can practice professionally upon graduation.</p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-black text-brand-dark text-center mb-16 underline decoration-brand-accent decoration-4 underline-offset-8">Common Questions</h2>
          <div className="space-y-4">
             {faqs.map((faq, idx) => (
                 <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                    <button 
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-8 text-left font-black text-brand-dark hover:bg-brand-light transition-colors"
                    >
                        {faq.q}
                        <ChevronDown className={`transition-transform duration-500 ${activeFaq === idx ? 'rotate-180 text-brand-accent' : 'text-slate-300'}`} />
                    </button>
                    <AnimatePresence>
                        {activeFaq === idx && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                <div className="p-8 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50 font-medium">
                                    {faq.a}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-brand-dark rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-accent/10 rounded-full blur-[80px]"></div>
                
                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-white mb-6">Need Personalized Advice?</h2>
                    <p className="text-slate-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        Every student's journey is unique. If you're still confused about where to start, our experienced Radiographers are ready to help you navigate your path.
                    </p>
                    <button 
                        onClick={openWhatsApp}
                        className="inline-flex items-center gap-4 bg-brand-accent text-brand-dark px-12 py-6 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-xl active:scale-95 group"
                    >
                        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" /> Talk to a Mentor
                    </button>
                    <p className="mt-8 text-xs text-slate-500 uppercase tracking-widest font-black">Free Consultation for Prospective Students</p>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default FreshersPage;