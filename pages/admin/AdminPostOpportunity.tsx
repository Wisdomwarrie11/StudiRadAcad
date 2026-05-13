
import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Upload, 
  Clock, 
  Check, 
  Plus, 
  Trash2,
  ArrowLeft,
  Loader2,
  Pencil,
  List,
  Search,
  AlertCircle,
  X,
  Save
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb, adminAuth } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

type OpportunityType = 'job' | 'internship' | 'scholarship';
type ViewMode = 'create' | 'manage';

const ROLES = ['Radiographer', 'Sonographer', 'Lecturer', 'Others'];
const REQUIREMENTS_OPTIONS = [
  'Application letter', 
  'CV', 
  'Birth certificate', 
  'All Basic, Secondary and University credentials', 
  'State of Origin', 
  'Others'
];

// --- Helper Functions ---

// Helper to find a value in an object case-insensitively
const getField = (item: any, candidates: string[]) => {
  const itemKeys = Object.keys(item);
  for (const candidate of candidates) {
    const foundKey = itemKeys.find(k => k.toLowerCase() === candidate.toLowerCase());
    if (foundKey && item[foundKey]) return item[foundKey];
  }
  return '';
};

// Helper to calculate deadline status
const getDeadlineStatus = (deadline: string | null | undefined) => {
  if (!deadline) return { label: 'Not specified', color: 'text-slate-500 bg-slate-100' };
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  if (isNaN(deadlineDate.getTime())) return { label: 'Invalid Date', color: 'text-slate-400 bg-slate-50' };
  
  if (deadlineDate < today) return { label: 'Expired', color: 'text-red-600 bg-red-50 border-red-100' };
  return { label: 'Active', color: 'text-emerald-600 bg-emerald-50 border border-emerald-100' };
};

/* Fix: Implemented the full AdminPostOpportunity component to resolve return type errors */
export function AdminPostOpportunity() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = adminAuth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const [activeType, setActiveType] = useState<OpportunityType>('job');
  const [viewMode, setViewMode] = useState<ViewMode>('manage'); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  
  const [selectedReq, setSelectedReq] = useState(REQUIREMENTS_OPTIONS[0]);
  const [customReq, setCustomReq] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingPosts, setExistingPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    organization: '', 
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

  useEffect(() => {
    setLoadingPosts(true);
    const collectionName = activeType === 'job' ? 'jobs' : activeType === 'internship' ? 'internships' : 'scholarships';
    
    const q = query(collection(adminDb, collectionName), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setExistingPosts(posts);
      setLoadingPosts(false);
    }, (err) => {
      console.error("Error fetching posts:", err);
      setLoadingPosts(false);
    });

    return () => unsubscribe();
  }, [activeType]);

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

  const resetForm = (nextView: ViewMode = 'create') => {
    setFormData({
      organization: '',
      location: '',
      description: '',
      deadline: '',
      contactInfo: '',
      link: '',
      salaryOrAmount: '',
      type: 'Full-time',
      duration: '',
      requirements: []
    });
    setSelectedRole(ROLES[0]);
    setCustomRole('');
    setEditingId(null);
    setScheduledDate('');
    setViewMode(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (post: any) => {
    setFormData({
      organization: post.organization || '',
      location: post.location || '',
      description: post.description || '',
      deadline: post.deadline || '',
      contactInfo: post.contactInfo || '',
      link: post.link || '',
      salaryOrAmount: post.salaryOrAmount || '',
      type: post.type || 'Full-time',
      duration: post.duration || '',
      requirements: post.requirements || []
    });

    if (ROLES.includes(post.title)) {
      setSelectedRole(post.title);
      setCustomRole('');
    } else {
      setSelectedRole('Others');
      setCustomRole(post.title);
    }

    setScheduledDate(post.scheduledFor || '');
    setEditingId(post.id);
    setViewMode('create');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) return;
    try {
      const collectionName = activeType === 'job' ? 'jobs' : activeType === 'internship' ? 'internships' : 'scholarships';
      await deleteDoc(doc(adminDb, collectionName, id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const title = selectedRole === 'Others' ? customRole : selectedRole;
      if (!title) {
        alert("Please specify a Title/Role");
        setIsSubmitting(false);
        return;
      }

      const collectionName = activeType === 'job' ? 'jobs' : activeType === 'internship' ? 'internships' : 'scholarships';

      const payload = {
        ...formData,
        title,
        postedAt: new Date().toISOString(),
        createdAt: editingId ? undefined : new Date(),
        scheduledFor: scheduledDate || null,
        opportunityType: activeType
      };

      if (editingId) {
        await updateDoc(doc(adminDb, collectionName, editingId), payload);
        alert("Updated successfully!");
        resetForm('manage');
      } else {
        await addDoc(collection(adminDb, collectionName), payload);
        alert("Posted successfully!");
        resetForm('manage');
      }
      
    } catch (error) {
      console.error("Error posting opportunity:", error);
      alert("Failed to post opportunity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPosts = existingPosts.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Opportunity Manager</h2>
            <p className="text-slate-500">Post and manage jobs, internships, and scholarships.</p>
          </div>
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
        </div>

        {/* View Switcher & Type Tabs */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            {(['manage', 'create'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {v === 'manage' ? 'Manage Existing' : 'Post New'}
              </button>
            ))}
          </div>

          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            {(['job', 'internship', 'scholarship'] as OpportunityType[]).map(type => (
              <button
                key={type}
                onClick={() => { setActiveType(type); if(viewMode === 'manage') resetForm('manage'); }}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeType === type ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {type}s
              </button>
            ))}
          </div>
        </div>

        {viewMode === 'manage' ? (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeType}s...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 outline-none focus:border-amber-500 shadow-sm"
              />
            </div>

            {loadingPosts ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-amber-500" /></div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
                <AlertCircle className="mx-auto mb-4 text-slate-300" size={48} />
                <p className="text-slate-500 font-bold">No {activeType}s found matching your search.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPosts.map(post => {
                  const status = getDeadlineStatus(post.deadline);
                  return (
                    <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-amber-300 transition-all">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-black text-slate-900 text-lg">{post.title}</h3>
                          <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${status.color}`}>{status.label}</span>
                        </div>
                        <p className="text-slate-500 text-sm font-bold">{post.organization}</p>
                        <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-400 font-bold">
                          <span className="flex items-center gap-1"><Clock size={12} /> {new Date(post.postedAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Plus size={12} /> {post.location}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleEdit(post)} className="p-3 bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 rounded-2xl transition-all border border-slate-100"><Pencil size={18} /></button>
                        <button onClick={() => handleDelete(post.id)} className="p-3 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-2xl transition-all border border-slate-100"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              {editingId ? <Pencil className="text-amber-500" /> : <Plus className="text-amber-500" />}
              {editingId ? `Edit ${activeType}` : `Create New ${activeType}`}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Role / Title</label>
                <div className="flex gap-2">
                  <select 
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                    className="flex-1 p-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {selectedRole === 'Others' && (
                    <input 
                      type="text" value={customRole}
                      onChange={e => setCustomRole(e.target.value)}
                      placeholder="Specify role..."
                      className="flex-1 p-4 rounded-2xl border-2 border-slate-100 font-bold"
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Organization</label>
                <input 
                  type="text" value={formData.organization}
                  onChange={e => setFormData({...formData, organization: e.target.value})}
                  placeholder="e.g. Lagoon Hospital"
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
                <input 
                  type="text" value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Lagos, Nigeria"
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deadline</label>
                <input 
                  type="date" value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                rows={5} value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Details about the opportunity..."
                className="w-full p-6 rounded-[2rem] border-2 border-slate-100 font-medium"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Requirements</label>
                <div className="flex gap-2 mb-4">
                  <select 
                    value={selectedReq}
                    onChange={e => setSelectedReq(e.target.value)}
                    className="flex-1 p-3 rounded-xl border border-slate-200 font-bold text-xs"
                  >
                    {REQUIREMENTS_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <button 
                    type="button"
                    onClick={() => { if(selectedReq) { setFormData({...formData, requirements: [...formData.requirements, selectedReq]}); } }}
                    className="bg-slate-900 text-white px-4 rounded-xl font-black text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((req, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                      {req}
                      <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setFormData({...formData, requirements: formData.requirements.filter((_, idx) => idx !== i)})} />
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Application Link / Email</label>
                <input 
                  type="text" value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  placeholder="e.g. https://hospital.com/careers or hr@hospital.com"
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-amber-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : editingId ? <><Save size={20} /> Update Opportunity</> : <><Plus size={20} /> Post Opportunity</>}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => resetForm('manage')}
                  className="px-8 bg-slate-100 text-slate-500 py-5 rounded-2xl font-black hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPostOpportunity;
