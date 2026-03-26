
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
  ShieldCheck,
  Save
} from 'lucide-react';
import { updateEmployerOpportunity, getOpportunityById, getCurrentEmployer } from '../../services/employerService';
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

const EditOpportunity = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
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
    const fetchData = async () => {
      const employer = await getCurrentEmployer();
      if (!employer) {
        navigate('/employer/login');
        return;
      }
      setProfile(employer);

      if (type && id) {
        const oppType = type as 'job' | 'internship' | 'scholarship';
        setActiveType(oppType);
        const result = await getOpportunityById(oppType, id);
        if (result && result.success) {
          const data = result.data as any;
          // Check if user owns this post
          if (data.postedBy !== employer.uid) {
            alert("Unauthorized access");
            navigate('/employer/dashboard');
            return;
          }

          let title = data.title;
          let customTitle = '';
          if (!ROLES.includes(title)) {
            title = 'Others';
            customTitle = data.title;
          }

          setFormData({
            title,
            customTitle,
            location: data.location || '',
            description: data.description || '',
            deadline: data.deadline || '',
            contactInfo: data.contactInfo || '',
            link: data.link || '',
            salaryOrAmount: data.salaryOrAmount || '',
            type: data.type || 'Full-time',
            duration: data.duration || '',
            requirements: data.requirements || []
          });
        } else {
          alert("Opportunity not found");
          navigate('/employer/dashboard');
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate, type, id]);

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
    if (!id) return;
    setIsSubmitting(true);

    try {
      const titleToPost = formData.title === 'Others' ? formData.customTitle : formData.title;
      if (!titleToPost) throw new Error("Please specify a Title");

      const payload = {
        ...formData,
        title: titleToPost,
        location: formData.location || 'Negotiable'
      };

      const result = await updateEmployerOpportunity(activeType, id, payload);
      if (result.success) {
        alert("Opportunity updated successfully!");
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

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
       <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 font-sans">
      <SEO title="Edit Opportunity" description="Modify your existing job, internship or scholarship posting." />
      
      <div className="container mx-auto max-w-4xl">
        <Link to="/employer/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 font-black transition-all">
          <ArrowLeft className="mr-2" size={18} /> Back to Dashboard
        </Link>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3.5rem] shadow-2xl p-10 md:p-16 border border-white space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
           
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                 <h2 className="text-3xl font-black text-slate-900 mb-2">Edit Listing</h2>
                 <p className="text-slate-500 font-medium">Updating post for <span className="text-slate-900 font-bold">{profile?.organizationName}</span></p>
              </div>
              <div className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {activeType}
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
              <div className="flex-grow flex items-center gap-4 text-emerald-600 bg-emerald-50 px-6 py-4 rounded-[2rem] border border-emerald-100">
                 <ShieldCheck size={24} />
                 <p className="text-xs font-bold leading-tight">Your organization profile is attached to this post for verification.</p>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting || !formData.description || formData.requirements.length === 0}
                className="w-full md:w-auto px-12 py-5 bg-brand-primary text-white rounded-[2rem] font-black text-lg hover:bg-brand-dark transition-all shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={22} />}
                Update Opportunity
              </button>
           </div>

        </form>
      </div>
    </div>
  );
};

export default EditOpportunity;
