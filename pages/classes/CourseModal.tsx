import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
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
  Loader2
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any | null;
}

const renderFormattedMessage = (text: string) => {
  if (!text) return null;
  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return (
    <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-line text-sm mt-3 border border-brand-primary/10 bg-brand-primary/5 p-6 rounded-2xl">
      {parts.map((part, i) => {
        if (urlRegex.test(part)) {
          // Clean up trailing punctuation if any caught inside URL
          let cleanUrl = part;
          if (cleanUrl.endsWith('.') || cleanUrl.endsWith(')') || cleanUrl.endsWith(',')) {
            cleanUrl = cleanUrl.slice(0, -1);
          }
          return (
            <a
              key={i}
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.98] transition-all my-3 shadow-lg shadow-brand-primary/20"
            >
              Access google classroom / Link <ChevronRight size={14} />
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course }) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [regError, setRegError] = useState('');
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setShowRegistration(false);
      setSuccess(false);
      setSubmitting(false);
      setRegError('');
      setFormValues({});
    }
  }, [isOpen, course]);

  if (!course) return null;

  const isLiveClass = !course.modules || course.modules.length === 0;
  const isComingSoon = course.status === 'coming-soon';

  const defaultFields = [
    { id: 'fullname', label: 'Full Name', type: 'text', required: true },
    { id: 'email', label: 'Email Address', type: 'email', required: true },
    { id: 'whatsapp', label: 'WhatsApp Number', type: 'tel', required: true },
    { 
      id: 'qualification', 
      label: 'Qualification', 
      type: 'select', 
      required: true, 
      options: 'Student, Pre-intern, Intern, Radiographer' 
    }
  ];

  const baseFields = course.registrationFields && course.registrationFields.length > 0
    ? course.registrationFields
    : defaultFields;

  // Dynamically ensure qualification is ALWAYS present for registration
  const hasQualification = baseFields.some((f: any) => f.id === 'qualification' || f.label?.toLowerCase() === 'qualification');
  const fields = hasQualification 
    ? baseFields 
    : [
        ...baseFields,
        { 
          id: 'qualification', 
          label: 'Qualification', 
          type: 'select', 
          required: true, 
          options: 'Student, Pre-intern, Intern, Radiographer' 
        }
      ];

  const handleActionClick = () => {
    setShowRegistration(true);
  };

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

    // Extra validation safely
    for (const field of fields) {
      if (field.required && !formValues[field.id]?.trim()) {
        setRegError(`Please fill in the required field: ${field.label}`);
        setSubmitting(false);
        return;
      }
    }

    try {
      const payload = {
        itemId: course.id,
        itemType: isLiveClass ? 'class' : 'course',
        itemTitle: course.title,
        answers: formValues,
        registeredAt: serverTimestamp()
      };

      await addDoc(collection(db, 'registrations'), payload);
      setSuccess(true);
    } catch (err: any) {
      console.error("Error submitting registration:", err);
      setRegError("Failed to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-h-[90vh] overflow-y-auto scrollbar-hide">
        {success ? (
          /* Congratulatory Success Page */
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
              <p className="text-sm font-semibold text-slate-400">Thank you for registering for {course.title}</p>
            </div>

            {/* Render the custom message or fallback */}
            <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-line text-sm max-w-lg mx-auto">
              {course.customConfirmationMessage || 
                "Congratulations! Your enrollment request has been received. Our team will contact you via email and WhatsApp with your access credentials and getting-started guide shortly."}
            </div>

            <button 
              onClick={onClose}
              className="mt-6 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95"
            >
              Close Window
            </button>
          </div>
        ) : showRegistration ? (
          /* Custom Registration Form Page */
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
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Register for Class</h3>
              <p className="text-xs text-slate-400 font-medium line-clamp-1">{course.title}</p>
            </div>

            {regError && (
              <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} /> {regError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {fields.map((field) => {
                const isRequired = field.required;
                const value = formValues[field.id] || '';

                return (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      {field.label} {isRequired && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        required={isRequired}
                        rows={3}
                        value={value}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-sm transition-all resize-none"
                      />
                    ) : field.type === 'select' ? (
                      <div className="relative">
                        <select
                          required={isRequired}
                          value={value}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-sm transition-all appearance-none pr-12 text-slate-800"
                        >
                          <option value="">Select option</option>
                          {field.options && field.options.split(',').map((opt: string) => {
                            const o = opt.trim();
                            return <option key={o} value={o}>{o}</option>;
                          })}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        required={isRequired}
                        value={value}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-sm transition-all"
                      />
                    )}
                  </div>
                );
              })}

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
          /* Standard Details page */
          <>
            {/* Header Image */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-950">
              {course.thumbnail ? (
                <>
                  <img src={course.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-40 scale-110 pointer-events-none" />
                  <img src={course.thumbnail} alt={course.title} className="relative w-full h-full object-contain" />
                </>
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                  {isComingSoon ? <Bell size={64} className="animate-pulse" /> : (isLiveClass ? <Video size={64} /> : <PlayCircle size={64} />)}
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
                    {course.category}
                  </span>
                  {isComingSoon && (
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
                      Coming Soon
                    </span>
                  )}
                  {course.level && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {course.level}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight leading-tight">{course.title}</h2>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <Clock className="mx-auto mb-2 text-brand-primary" size={20} />
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                  <span className="font-black text-slate-900 text-xs">{course.duration}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  {isLiveClass ? (
                    <Users className="mx-auto mb-2 text-brand-primary" size={20} />
                  ) : (
                    <BookOpen className="mx-auto mb-2 text-brand-primary" size={20} />
                  )}
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {isLiveClass ? 'Capacity' : 'Modules'}
                  </span>
                  <span className="font-black text-slate-900 text-xs">
                    {isLiveClass ? (course.maxStudents || 'Unlimited') : (course.modules?.length || 0)}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <CheckCircle2 className="mx-auto mb-2 text-brand-primary" size={20} />
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</span>
                  <span className={`font-black text-xs ${isComingSoon ? 'text-amber-500' : 'text-slate-900'}`}>
                    {course.price}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">About this {isComingSoon ? 'Announcement' : (isLiveClass ? 'Class' : 'Course')}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Features (if present) */}
              {course.features && course.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 text-slate-900">
                    <Sparkles className="text-brand-primary" size={18} /> Featuring
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl transition-all hover:bg-slate-100/50">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        <span className="font-bold text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What You Will Learn (if present) */}
              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                <div className="space-y-4 bg-brand-primary/[0.01] border border-brand-primary/5 p-6 rounded-3xl">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">What You Will Learn</h3>
                  <div className="space-y-3">
                    {course.whatYouWillLearn.map((item: string, idx: number) => (
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

              {/* Registration Info for Coming Soon */}
              {isComingSoon && (
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                  <h4 className="text-sm font-black text-amber-700 uppercase tracking-widest flex items-center gap-2">
                    <Bell size={16} /> Get Notified
                  </h4>
                  <p className="text-xs font-semibold text-amber-600 leading-relaxed">
                    This course is currently in preparation. Register interest to receive early access and launch discounts!
                  </p>
                </div>
              )}

              {/* Technologies (for Live Classes) */}
              {isLiveClass && course.technologies && course.technologies.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Technologies Used</h3>
                  <div className="flex flex-wrap gap-3">
                    {course.technologies.map((tech: string) => (
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

              {/* Modules (for Pre-recorded Courses) */}
              {!isLiveClass && course.modules && course.modules.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Course Curriculum</h3>
                  <div className="space-y-3">
                    {course.modules.map((module: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-xs text-brand-primary shadow-sm">
                            {idx + 1}
                          </div>
                          <span className="font-bold text-slate-700">{module.title}</span>
                        </div>
                        <PlayCircle size={18} className="text-slate-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button 
                onClick={handleActionClick}
                className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl ${
                  isComingSoon 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 active:scale-95'
                    : 'bg-brand-primary text-white hover:bg-brand-dark shadow-brand-primary/20 active:scale-[0.98]'
                }`}
              >
                {isComingSoon ? 'Register Interest' : 'Enroll Now'} <ArrowRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CourseModal;
