import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { 
  PlayCircle, 
  Clock, 
  CheckCircle2, 
  Monitor, 
  MessageCircle, 
  Video,
  X,
  ArrowRight,
  Users,
  Bell,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Loader2,
  Calendar,
  MapPin
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: any | null;
}

const ClassModal: React.FC<ClassModalProps> = ({ isOpen, onClose, classItem }) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [regError, setRegError] = useState('');
  const [formValues, setFormValues] = useState<Record<string, string>>({
    fullname: '',
    email: '',
    whatsapp: '',
    qualification: ''
  });

  useEffect(() => {
    if (isOpen) {
      setShowRegistration(false);
      setSuccess(false);
      setSubmitting(false);
      setRegError('');
      setFormValues({
        fullname: '',
        email: '',
        whatsapp: '',
        qualification: ''
      });
    }
  }, [isOpen, classItem]);

  if (!classItem) return null;

  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setRegError('');

    // Field validation
    if (!formValues.fullname.trim()) {
      setRegError('Please provide your Full Name.');
      setSubmitting(false);
      return;
    }
    if (!formValues.email.trim()) {
      setRegError('Please provide your Email Address.');
      setSubmitting(false);
      return;
    }
    if (!formValues.whatsapp.trim()) {
      setRegError('Please provide your WhatsApp Number.');
      setSubmitting(false);
      return;
    }
    if (!formValues.qualification) {
      setRegError('Please select your Qualification.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        itemId: classItem.id || 'chest-critique-2026',
        itemType: 'class',
        itemTitle: classItem.title,
        answers: formValues,
        registeredAt: serverTimestamp()
      };

      await addDoc(collection(db, 'registrations'), payload);
      setSuccess(true);
    } catch (err: any) {
      console.error("Error submitting registration:", err);
      setRegError("Failed to submit registration. Please check your network and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-h-[90vh] overflow-y-auto scrollbar-hide">
        {success ? (
          /* High-fidelity custom live class registration success screen */
          <div className="p-8 md:p-12 text-center space-y-6">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
              <CheckCircle2 size={40} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Sparkles size={12} className="text-brand-primary animate-pulse" /> Successful Registration
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Registration Complete!</h2>
              <p className="text-sm font-semibold text-slate-400">Thank you for registering for {classItem.title}</p>
            </div>

            <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-line text-sm max-w-lg mx-auto">
              Congratulations! Your registration is complete. To successfully join the class, please use the secure Google Classroom invitation link below.
            </div>

            {/* Google Classroom access card */}
            <div className="bg-emerald-50 border border-emerald-200/60 rounded-3xl p-6 text-left max-w-md mx-auto space-y-4 shadow-sm shadow-emerald-500/5">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                <Sparkles size={14} className="text-emerald-500 animate-pulse" /> Final Step to Join Class:
              </div>
              
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Click the access link below to join our interactive Google Classroom immediately. If prompted, please use the class code.
              </p>
              
              <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-extrabold uppercase tracking-widest text-[9px]">Class Code</span>
                <span className="font-mono font-black text-emerald-600 px-2.5 py-1 bg-emerald-50 rounded-lg select-all">g5bxu3tn</span>
              </div>
              
              <a
                href="https://classroom.google.com/c/ODY1MjQ3MzU5MzI0?cjc=g5bxu3tn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-emerald-600/20"
              >
                Access Google Classroom <ArrowRight size={14} />
              </a>
            </div>

            <button 
              onClick={onClose}
              className="mt-6 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95"
            >
              Close Window
            </button>
          </div>
        ) : showRegistration ? (
          /* Live Class Registration Form */
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <button 
                onClick={() => setShowRegistration(false)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-brand-primary text-xs font-black uppercase tracking-wider transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Admission Application</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Register for Live Class</h3>
              <p className="text-xs text-slate-400 font-medium line-clamp-1">{classItem.title}</p>
            </div>

            {regError && (
              <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} /> {regError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formValues.fullname}
                  onChange={(e) => handleInputChange('fullname', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-sm transition-all"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formValues.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-sm transition-all"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formValues.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="Enter your WhatsApp number (e.g. +234...)"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-sm transition-all"
                />
              </div>

              {/* Qualification */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Qualification <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formValues.qualification}
                    onChange={(e) => handleInputChange('qualification', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-sm transition-all appearance-none pr-12 text-slate-800"
                  >
                    <option value="">Select option</option>
                    <option value="Student">Student</option>
                    <option value="Pre-intern">Pre-intern</option>
                    <option value="Intern">Intern</option>
                    <option value="Radiographer">Radiographer</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50 mt-4 active:scale-95"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle2 size={18} /> Submit Registration</>}
              </button>
            </form>
          </div>
        ) : (
          /* Live Class Details Page */
          <>
            {/* Header image / Banner banner */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-950">
              {classItem.thumbnail ? (
                <>
                  <img src={classItem.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-40 scale-110 pointer-events-none" />
                  <img src={classItem.thumbnail} alt={classItem.title} className="relative w-full h-full object-contain" />
                </>
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                  {classItem.status === 'coming-soon' ? <Bell size={64} className="animate-pulse" /> : <Video size={64} />}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-6 left-8 right-8">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-brand-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {classItem.category}
                  </span>
                  {classItem.status === 'coming-soon' && (
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
                      Coming Soon
                    </span>
                  )}
                  {classItem.level && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {classItem.level}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight leading-tight">{classItem.title}</h2>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Simple Details Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <Calendar className="mx-auto mb-2 text-brand-primary" size={20} />
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                  <span className="font-black text-slate-900 text-xs leading-tight block mt-1">{classItem.duration}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <Clock className="mx-auto mb-2 text-brand-primary" size={20} />
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</span>
                  <span className="font-black text-slate-900 text-xs leading-tight block mt-1">{classItem.time || '8:30 PM Daily'}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <MapPin className="mx-auto mb-2 text-brand-primary" size={20} />
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue</span>
                  <span className="font-black text-slate-900 text-xs leading-tight block mt-1">{classItem.venue || 'Google Classroom'}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <CheckCircle2 className="mx-auto mb-2 text-brand-primary" size={20} />
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration</span>
                  <span className="font-black text-slate-900 text-xs leading-tight block mt-1 text-emerald-600 uppercase tracking-wider">{classItem.price || 'FREE'}</span>
                </div>
              </div>

              {/* About description */}
              <div className="space-y-3">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">About this Live Class</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {classItem.description}
                </p>
              </div>

              {/* Featuring Bullets */}
              {classItem.features && classItem.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Sparkles className="text-brand-primary" size={18} /> Featuring
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {classItem.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl transition-all hover:bg-slate-100/50">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        <span className="font-bold text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What You Will Learn */}
              {classItem.whatYouWillLearn && classItem.whatYouWillLearn.length > 0 && (
                <div className="space-y-4 bg-brand-primary/[0.01] border border-brand-primary/5 p-6 rounded-3xl">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">What You Will Learn</h3>
                  <div className="space-y-3">
                    {classItem.whatYouWillLearn.map((item: string, idx: number) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-slate-600 font-medium text-sm leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies Used */}
              {classItem.technologies && classItem.technologies.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Access Platform</h3>
                  <div className="flex flex-wrap gap-3">
                    {classItem.technologies.map((tech: string) => (
                      <div key={tech} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                        {tech.toLowerCase().includes('meet') && <Video size={14} className="text-blue-500" />}
                        {tech.toLowerCase().includes('whatsapp') && <MessageCircle size={14} className="text-green-500" />}
                        {tech.toLowerCase().includes('classroom') && <Monitor size={14} className="text-emerald-500" />}
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {classItem.status === 'coming-soon' ? (
                <button 
                  disabled
                  className="w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                >
                  Coming Soon (Not Scheduled Yet)
                </button>
              ) : (
                <button 
                  onClick={() => setShowRegistration(true)}
                  className="w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl bg-brand-primary text-white hover:bg-brand-dark shadow-brand-primary/20 active:scale-[0.98]"
                >
                  Register for Class <ArrowRight size={20} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ClassModal;
