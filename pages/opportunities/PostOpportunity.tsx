
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Trash2,
  Calendar,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { postEmployerOpportunity, getCurrentEmployer } from '../../services/employerService';
import { EmployerProfile } from '../../types';
import SEO from '../../components/SEO';

const ROLES = ['Radiographer', 'Sonographer', 'Lecturer', 'Imaging Lead', 'Intern', 'Others'];
const REQUIREMENTS_OPTIONS = [
  'Application letter', 
  'CV / Resume', 
  'Valid Practice License (RRBN)', 
  'Degree Certificate', 
  'Recommendation Letter',
  'Internship Completion Certificate',
  'Others'
];

const PostOpportunity = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeType, setActiveType] = useState<'job' | 'internship' | 'scholarship'>('job');

  const [formData, setFormData] = useState({
    title: ROLES[0],
    customTitle: '',
    location: '',
    description: '',
    deadline: '',
    contactInfo: '',
    link: '',
    salaryOrAmount: '',
    type: 'Full-time', 
    duration: '', 
    requirements: [] as string[]
  });

  const [selectedReq, setSelectedReq] = useState(REQUIREMENTS_OPTIONS[0]);
  const [customReq, setCustomReq] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getCurrentEmployer();
      if (!data) {
        navigate('/employer/login');
        return;
      }
      setProfile(data);
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [navigate]);

  const addRequirement = () => {
    let reqToAdd = selectedReq;
    if (selectedReq === 'Others') {
      if (!customReq.trim()) return;
      reqToAdd = customReq.trim();
    }
    if (!formData.requirements.includes(reqToAdd)) {
      setFormData({ ...formData, requirements: [...formData.requirements, reqToAdd] });
    }
    setCustomReq('');
    setSelectedReq(REQUIREMENTS_OPTIONS[0]);
  };

  const removeRequirement = (index: number) => {
    const newReqs = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newReqs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.isVerified) {
       alert("Your facility profile is currently pending verification. You will be able to publish opportunities once an administrator has verified your organization.");
       return;
    }
    setIsSubmitting(true);

    try {
      const titleToPost = formData.title === 'Others' ? formData.customTitle : formData.title;
      if (!titleToPost) throw new Error("Please specify a Title");

      const payload = {
        ...formData,
        title: titleToPost,
        organization: profile?.organizationName || 'Verified Facility',
        location: formData.location || 'Negotiable'
      };

      const result = await postEmployerOpportunity(activeType, payload);
      if (result.success) {
        alert("Opportunity posted successfully! It will now appear on the platform.");
        navigate('/employer/dashboard');
      } else {
        alert("Error: " + result.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProfile) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
       <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 font-sans">
      <SEO title="Post Opportunity" description="Create a new job, internship or scholarship posting." />
      
      <div className="container mx-auto max-w-4xl">
        <Link to="/employer/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 font-black transition-all">
          <ArrowLeft className="mr-2" size={18} /> Back to Dashboard
        </Link>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3.5rem] shadow-2xl p-10 md:p-16 border border-white space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
           
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                 <h2 className="text-3xl font-black text-slate-900 mb-2">Create Listing</h2>
                 <p className="text-slate-500 font-medium">Posting as <span className="text-slate-900 font-bold">{profile?.organizationName}</span></p>
              </div>
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                 {(['job', 'internship', 'scholarship'] as const).map(type => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setActiveType(type)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeType === type ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}
                    >
                        {type}
                    </button>
                 ))}
              </div>
           </div>

           {/* --- SECTION: BASIC INFO --- */}
           <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Opportunity Title / Role</label>
                   <div className="flex gap-2">
                        <select 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="flex-1 p-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50 outline-none focus:border-brand-primary transition-all"
                        >
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        {formData.title === 'Others' && (
                            <input 
                                type="text" required
                                placeholder="Specify role..."
                                value={formData.customTitle}
                                onChange={e => setFormData({...formData, customTitle: e.target.value})}
                                className="flex-1 p-4 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-brand-primary"
                            />
                        )}
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Location</label>
                   <input 
                     type="text" required
                     placeholder="e.g. Victoria Island, Lagos"
                     value={formData.location}
                     onChange={e => setFormData({...formData, location: e.target.value})}
                     className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-brand-primary transition-all"
                   />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                   <select 
                     value={formData.type}
                     onChange={e => setFormData({...formData, type: e.target.value})}
                     className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50 outline-none focus:border-brand-primary transition-all"
                   >
                     <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                   <input 
                     type="date"
                     value={formData.deadline}
                     onChange={e => setFormData({...formData, deadline: e.target.value})}
                     className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50 outline-none focus:border-brand-primary transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{activeType === 'scholarship' ? 'Amount' : 'Salary (Optional)'}</label>
                   <input 
                     type="text"
                     placeholder="e.g. Negotiable"
                     value={formData.salaryOrAmount}
                     onChange={e => setFormData({...formData, salaryOrAmount: e.target.value})}
                     className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-brand-primary transition-all"
                   />
                </div>
              </div>
           </div>

           {/* --- SECTION: DESCRIPTION --- */}
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description & Responsibilities</label>
              <textarea 
                rows={6} required
                placeholder="What does this role entail? Provide details about the facility and expectations."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full p-6 rounded-[2.5rem] border-2 border-slate-100 font-medium outline-none focus:border-brand-primary transition-all"
              />
           </div>

           {/* --- SECTION: REQUIREMENTS --- */}
           <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Requirements Checklist</label>
              <div className="flex flex-col md:flex-row gap-4">
                 <select 
                   value={selectedReq}
                   onChange={e => setSelectedReq(e.target.value)}
                   className="flex-1 p-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50 text-sm"
                 >
                   {REQUIREMENTS_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                 </select>
                 {selectedReq === 'Others' && (
                   <input 
                     type="text" value={customReq}
                     onChange={e => setCustomReq(e.target.value)}
                     placeholder="Specify requirement..."
                     className="flex-1 p-4 rounded-2xl border-2 border-slate-100 font-bold text-sm"
                   />
                 )}
                 <button type="button" onClick={addRequirement} className="bg-slate-900 text-white px-8 rounded-2xl font-black transition-all hover:bg-slate-800">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                 {formData.requirements.map((req, i) => (
                    <span key={i} className="bg-slate-50 text-slate-600 px-4 py-2 rounded-full border border-slate-200 text-xs font-bold flex items-center gap-3">
                       {req} <Trash2 size={14} className="cursor-pointer text-red-400 hover:text-red-600" onClick={() => removeRequirement(i)} />
                    </span>
                 ))}
                 {formData.requirements.length === 0 && <p className="text-slate-400 text-xs italic ml-1">No requirements added yet.</p>}
              </div>
           </div>

           {/* --- SECTION: CONTACT --- */}
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Application Contact Info</label>
                <input 
                  type="text" required
                  placeholder="e.g. Send CV to hr@hospital.com"
                  value={formData.contactInfo}
                  onChange={e => setFormData({...formData, contactInfo: e.target.value})}
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-brand-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Direct Apply Link (Optional)</label>
                <input 
                  type="url"
                  placeholder="https://hospital-career-portal.com"
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-brand-primary transition-all"
                />
              </div>
           </div>

           {/* --- SUBMIT --- */}
           <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row gap-6 items-center">
              {!profile?.isVerified ? (
                <div className="flex-grow flex items-center gap-4 text-amber-600 bg-amber-50 px-6 py-4 rounded-[2rem] border border-amber-100">
                   <div className="p-2 bg-amber-100 rounded-xl"><Building2 size={24} /></div>
                   <p className="text-xs font-bold leading-tight">Verification Pending: Your organization is currently being reviewed. Publishing will be enabled once verified.</p>
                </div>
              ) : (
                <div className="flex-grow flex items-center gap-4 text-emerald-600 bg-emerald-50 px-6 py-4 rounded-[2rem] border border-emerald-100">
                   <ShieldCheck size={24} />
                   <p className="text-xs font-bold leading-tight">Your organization is verified. Your posting will be live immediately.</p>
                </div>
              )}
              <button 
                type="submit"
                disabled={isSubmitting || !formData.description || formData.requirements.length === 0 || !profile?.isVerified}
                className="w-full md:w-auto px-12 py-5 bg-brand-primary text-white rounded-[2rem] font-black text-lg hover:bg-brand-dark transition-all shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle size={22} />}
                Publish Opportunity
              </button>
           </div>

        </form>

        {/* Disclaimer for Employers */}
        <div className="mt-12 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex items-start gap-6">
           <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
              <ShieldCheck size={24} />
           </div>
           <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Employer Disclosure & Agreement</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                 By publishing this opportunity, you agree to provide accurate information and honor the requirements listed. StudiRad manually verifies all facility registrations. We reserve the right to remove non-compliant listings. Both parties (Employer and Applicant) are expected to perform their own due diligence as StudiRad will not be responsible for any issues arising from interactions on the platform. Review our <Link to="/terms" className="text-brand-primary underline underline-offset-4">Terms & Conditions</Link>.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PostOpportunity;
