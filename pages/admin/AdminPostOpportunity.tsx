
import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Laptop2, 
  Upload, 
  Clock, 
  Check, 
  Plus, 
  Trash2,
  ArrowLeft,
  Loader2,
  ClipboardPaste,
  HelpCircle,
  Pencil,
  List,
  Calendar,
  Search,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminDb } from '../../firebase';

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

const parseCSV = (csvText: string) => {
  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const result = [];
  
  for(let i=1; i<lines.length; i++) {
    const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if(currentLine.length > 0) {
      const obj: any = {};
      headers.forEach((header, index) => {
         let val = currentLine[index]?.trim() || '';
         if (val.startsWith('"') && val.endsWith('"')) {
           val = val.slice(1, -1).replace(/""/g, '"');
         }
         obj[header] = val;
      });
      result.push(obj);
    }
  }
  return result;
};

export default function AdminPostOpportunity() {
  const [activeType, setActiveType] = useState<OpportunityType>('job');
  const [viewMode, setViewMode] = useState<ViewMode>('manage'); // Default to manage to see list first
  
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  
  // Selection States
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  
  const [selectedReq, setSelectedReq] = useState(REQUIREMENTS_OPTIONS[0]);
  const [customReq, setCustomReq] = useState('');

  // Data & Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingPosts, setExistingPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Batch Paste State
  const [pastedText, setPastedText] = useState('');

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
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

  // --- Real-time Fetching ---
  useEffect(() => {
    setLoadingPosts(true);
    const collectionName = activeType === 'job' ? 'jobs' : activeType === 'internship' ? 'internships' : 'scholarships';
    
    // Connect to Firestore using onSnapshot for Real-time updates
    const unsubscribe = adminDb.collection(collectionName)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot: any) => {
        const posts = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }));
        setExistingPosts(posts);
        setLoadingPosts(false);
      }, (err: any) => {
        console.error("Error fetching posts:", err);
        setLoadingPosts(false);
      });

    return () => unsubscribe();
  }, [activeType]);

  // --- Actions ---

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
    setPastedText('');
    setEditingId(null);
    setScheduledDate('');
    setIsBatchMode(false);
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

    // Handle Title Mapping
    if (ROLES.includes(post.title)) {
      setSelectedRole(post.title);
      setCustomRole('');
    } else {
      setSelectedRole('Others');
      setCustomRole(post.title);
    }

    setScheduledDate(post.scheduledFor || '');
    setEditingId(post.id);
    setIsBatchMode(false);
    setViewMode('create'); // Switch to form view
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this opportunity? It will be removed from the public page immediately.")) return;

    try {
      const collectionName = activeType === 'job' ? 'jobs' : activeType === 'internship' ? 'internships' : 'scholarships';
      await adminDb.collection(collectionName).doc(id).delete();
      // Snapshot listener will auto-update the list UI
      
      // If editing this specific post, cancel edit
      if (editingId === id) resetForm('manage');
      
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
        ...(editingId ? {} : { createdAt: new Date() }), // Keep original creation date on edit
        scheduledFor: scheduledDate || null,
        opportunityType: activeType
      };

      if (editingId) {
        await adminDb.collection(collectionName).doc(editingId).update(payload);
        alert("Updated successfully! Changes are live.");
        resetForm('manage'); // Return to list
      } else {
        await adminDb.collection(collectionName).add(payload);
        alert("Posted successfully! It is now visible to users.");
        resetForm('manage'); // Return to list
      }
      
    } catch (error) {
      console.error("Error posting opportunity:", error);
      alert("Failed to post opportunity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Batch Upload Logic (Same as before) ---
  const uploadBatchData = async (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      alert('Data is empty or incorrect format.');
      setIsSubmitting(false);
      return;
    }

    const collectionName = activeType === 'job' ? 'jobs' : activeType === 'internship' ? 'internships' : 'scholarships';
    let successCount = 0;

    try {
      for (const item of data) {
         const title = getField(item, ['title', 'role', 'position', 'job title']) || 'Untitled Opportunity';
         const organization = getField(item, ['organization', 'company', 'provider', 'hospital', 'name']);
         
         if (!organization && !title) continue;

         let requirements = getField(item, ['requirements', 'eligibility']) || [];
         if (typeof requirements === 'string') {
             requirements = requirements.split('|').map((s: string) => s.trim());
         }

         const payload = {
           title,
           organization: organization || 'Unknown Organization',
           location: getField(item, ['location', 'city', 'address']) || '',
           description: getField(item, ['description', 'desc', 'details']) || '',
           deadline: getField(item, ['deadline', 'date', 'closing date']) || '',
           contactInfo: getField(item, ['contactInfo', 'contact', 'email', 'phone', 'contact address']) || '',
           link: getField(item, ['link', 'url', 'website', 'apply link']) || '',
           salaryOrAmount: getField(item, ['salaryOrAmount', 'salary', 'amount', 'stipend', 'pay']) || '',
           type: getField(item, ['type', 'employment type']) || 'Full-time',
           duration: getField(item, ['duration', 'length', 'period']) || '',
           requirements: Array.isArray(requirements) ? requirements : [],
           
           postedAt: new Date().toISOString(),
           createdAt: new Date(),
           scheduledFor: scheduledDate || null,
           opportunityType: activeType
         };

         await adminDb.collection(collectionName).add(payload);
         successCount++;
      }
      
      alert(`Batch Upload Complete! Created ${successCount} entries.`);
      resetForm('manage'); // Go to list to see new items
      
    } catch (error) {
      console.error("Batch upload error:", error);
      alert('Error processing batch upload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSubmitting(true);
      file.text().then(text => {
        let data: any[] = [];
        if (file.name.toLowerCase().endsWith('.json')) data = JSON.parse(text);
        else if (file.name.toLowerCase().endsWith('.csv')) data = parseCSV(text);
        uploadBatchData(data);
      }).catch(err => {
        alert("Error reading file");
        setIsSubmitting(false);
      });
    }
  };

  const handlePasteUpload = () => {
    if (!pastedText.trim()) return;
    setIsSubmitting(true);
    try {
      const text = pastedText.trim();
      let data = text.startsWith('[') ? JSON.parse(text) : parseCSV(text);
      uploadBatchData(data);
    } catch (error) {
      alert('Error parsing text.');
      setIsSubmitting(false);
    }
  };

  // Filtered Posts
  const filteredPosts = existingPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-brand-dark text-white pt-24 pb-12 px-6 shadow-lg rounded-b-[2rem]">
        <div className="max-w-5xl mx-auto">
          <Link to="/admin/dashboard" className="inline-flex items-center text-slate-300 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
               <h1 className="text-3xl font-bold">Opportunities</h1>
               <p className="text-slate-400">Post and Manage Jobs, Internships, and Grants.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8">
        
        {/* Main Controls Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-8">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {['job', 'internship', 'scholarship'].map((type) => (
              <button
                key={type}
                onClick={() => { setActiveType(type as OpportunityType); resetForm('manage'); }}
                className={`flex-1 py-4 text-center font-bold capitalize transition-all ${
                  activeType === type 
                    ? 'text-brand-primary border-b-4 border-brand-primary bg-slate-50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {type}s
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
               <button
                 onClick={() => resetForm('manage')}
                 className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${
                   viewMode === 'manage' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                 }`}
               >
                 <List className="w-4 h-4" /> Manage Posted
               </button>
               <button
                 onClick={() => resetForm('create')}
                 className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${
                   viewMode === 'create' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                 }`}
               >
                 {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
                 {editingId ? 'Edit Post' : 'Post New'}
               </button>
            </div>
            
            {viewMode === 'manage' && (
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search opportunities..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* --- CONTENT AREA --- */}
          <div className="p-0">
            
            {/* 1. MANAGE LISTINGS VIEW */}
            {viewMode === 'manage' && (
              <div className="min-h-[400px]">
                 {loadingPosts ? (
                   <div className="flex flex-col items-center justify-center py-20">
                     <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
                     <p className="text-slate-500">Loading {activeType}s...</p>
                   </div>
                 ) : filteredPosts.length === 0 ? (
                   <div className="text-center py-20 px-6">
                     <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <AlertCircle className="w-8 h-8 text-slate-400" />
                     </div>
                     <h3 className="text-lg font-bold text-slate-700">No {activeType}s found</h3>
                     <p className="text-slate-500 mb-6">You haven't posted any {activeType}s yet, or none match your search.</p>
                     <button onClick={() => setViewMode('create')} className="text-brand-primary font-bold hover:underline">
                        Create your first post
                     </button>
                   </div>
                 ) : (
                   <div className="divide-y divide-slate-100">
                     {filteredPosts.map(post => (
                       <div key={post.id} className="p-6 hover:bg-slate-50 transition-colors group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-grow">
                             <div className="flex items-center gap-2 mb-1">
                               <h4 className="font-bold text-slate-800 text-lg group-hover:text-brand-primary transition-colors">
                                 {post.title}
                               </h4>
                               {post.scheduledFor && (
                                 <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                   <Clock className="w-3 h-3" /> Scheduled
                                 </span>
                               )}
                             </div>
                             
                             <div className="text-sm text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="flex items-center gap-1">
                                  {activeType === 'scholarship' ? <GraduationCap className="w-3 h-3"/> : <Briefcase className="w-3 h-3"/>}
                                  {post.organization}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3"/> Posted: {new Date(post.postedAt).toLocaleDateString()}
                                </span>
                                {post.salaryOrAmount && (
                                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-700 font-medium">
                                    {post.salaryOrAmount}
                                  </span>
                                )}
                             </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                             <button 
                               onClick={() => handleEdit(post)}
                               className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-colors flex items-center gap-2 shadow-sm"
                             >
                                <Pencil className="w-3.5 h-3.5" /> Edit
                             </button>
                             <button 
                               onClick={() => handleDelete(post.id)}
                               className="px-3 py-2 bg-white border border-slate-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                               title="Delete"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            )}

            {/* 2. CREATE / EDIT VIEW */}
            {viewMode === 'create' && (
              <div>
                {/* Mode Toggle (Batch vs Single) - Hide during Edit */}
                {!editingId && (
                   <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex gap-2">
                         <button 
                           onClick={() => setIsBatchMode(false)}
                           className={`text-xs uppercase font-bold px-3 py-1.5 rounded ${!isBatchMode ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                         >
                           Single Entry
                         </button>
                         <button 
                           onClick={() => setIsBatchMode(true)}
                           className={`text-xs uppercase font-bold px-3 py-1.5 rounded ${isBatchMode ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                         >
                           Batch Upload
                         </button>
                      </div>
                   </div>
                )}

                {editingId && (
                  <div className="bg-amber-50 p-3 border-b border-amber-100 flex justify-between items-center px-6">
                     <span className="text-amber-800 font-bold text-sm flex items-center gap-2">
                       <Pencil className="w-4 h-4" /> You are editing an existing post
                     </span>
                     <button onClick={() => resetForm('manage')} className="text-xs font-bold text-amber-700 hover:underline">
                       Cancel & Go Back
                     </button>
                  </div>
                )}

                <div className="p-8">
                  {isBatchMode && !editingId ? (
                    // --- BATCH UPLOAD UI ---
                    <div className="space-y-6">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 py-12 text-center cursor-pointer transition-colors"
                      >
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".csv,.json" />
                        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-700">Upload JSON or CSV</h4>
                        <p className="text-sm text-slate-500">Click to browse files</p>
                      </div>
                      
                      <div className="relative">
                         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                         <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-slate-400 font-bold uppercase">OR PASTE TEXT</span></div>
                      </div>

                      <textarea
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs h-32 focus:outline-none focus:border-brand-primary"
                        placeholder="Paste JSON or CSV data here..."
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                      ></textarea>

                      <div className="flex justify-end">
                        <button
                          onClick={handlePasteUpload}
                          disabled={!pastedText.trim() || isSubmitting}
                          className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} Process
                        </button>
                      </div>
                    </div>
                  ) : (
                    // --- SINGLE FORM UI ---
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Title / Role</label>
                          <div className="flex flex-col gap-2">
                            <select 
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                            >
                              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {selectedRole === 'Others' && (
                              <input 
                                type="text"
                                placeholder="Specify Role"
                                className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                                value={customRole}
                                onChange={(e) => setCustomRole(e.target.value)}
                                required
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Organization / Company</label>
                          <input 
                            type="text" 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                            value={formData.organization}
                            onChange={e => setFormData({...formData, organization: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                         {activeType !== 'scholarship' && (
                           <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                             <input 
                               type="text" 
                               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                               value={formData.location}
                               onChange={e => setFormData({...formData, location: e.target.value})}
                               required
                             />
                           </div>
                         )}
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                               {activeType === 'job' ? 'Salary' : activeType === 'scholarship' ? 'Grant Amount' : 'Stipend'}
                            </label>
                            <input 
                              type="text" 
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                              value={formData.salaryOrAmount}
                              onChange={e => setFormData({...formData, salaryOrAmount: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                         <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Deadline</label>
                           <input 
                              type="date" 
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                              value={formData.deadline}
                              onChange={e => setFormData({...formData, deadline: e.target.value})}
                              required
                           />
                         </div>
                         {/* Dynamic Field based on Type */}
                         {activeType === 'internship' && (
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                               <input 
                                 type="text" 
                                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                                 placeholder="e.g. 1 Year"
                                 value={formData.duration}
                                 onChange={e => setFormData({...formData, duration: e.target.value})}
                               />
                            </div>
                         )}
                         {activeType === 'job' && (
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-2">Job Type</label>
                               <select 
                                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                                 value={formData.type}
                                 onChange={e => setFormData({...formData, type: e.target.value})}
                               >
                                 <option>Full-time</option>
                                 <option>Part-time</option>
                                 <option>Contract</option>
                               </select>
                            </div>
                         )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                        <textarea 
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-32 outline-none focus:border-brand-primary"
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          required
                        ></textarea>
                      </div>

                      {/* Requirements Builder */}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Requirements</label>
                        <div className="flex gap-2 mb-3">
                           <select 
                             className="flex-grow p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                             value={selectedReq}
                             onChange={(e) => setSelectedReq(e.target.value)}
                           >
                             {REQUIREMENTS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                           </select>
                           {selectedReq === 'Others' && (
                             <input 
                               type="text" 
                               className="flex-grow p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                               placeholder="Type requirement..."
                               value={customReq}
                               onChange={(e) => setCustomReq(e.target.value)}
                             />
                           )}
                           <button type="button" onClick={addRequirement} className="bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-900">
                             <Plus className="w-5 h-5" />
                           </button>
                        </div>
                        <div className="space-y-2">
                           {formData.requirements.map((req, idx) => (
                             <div key={idx} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded px-4">
                               <span className="text-sm text-slate-700">{req}</span>
                               <button type="button" onClick={() => removeRequirement(idx)} className="text-red-400 hover:text-red-600">
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </div>
                           ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Contact Info</label>
                           <input 
                             type="text" 
                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                             value={formData.contactInfo}
                             onChange={e => setFormData({...formData, contactInfo: e.target.value})}
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Application Link (Optional)</label>
                           <input 
                             type="url" 
                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                             value={formData.link}
                             onChange={e => setFormData({...formData, link: e.target.value})}
                           />
                        </div>
                      </div>
                      
                      {/* Schedule (Create Mode Only) */}
                      {!editingId && (
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Schedule Post (Optional)</label>
                           <input 
                             type="datetime-local" 
                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"
                             value={scheduledDate}
                             onChange={(e) => setScheduledDate(e.target.value)}
                           />
                        </div>
                      )}

                      <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                         <button 
                           type="button" 
                           onClick={() => resetForm('create')} 
                           className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors"
                         >
                           Reset Form
                         </button>
                         <button 
                           type="submit" 
                           disabled={isSubmitting}
                           className="px-8 py-3 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-primary shadow-lg transition-all flex items-center gap-2"
                         >
                           {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Check className="w-5 h-5"/>}
                           {editingId ? 'Update Post' : 'Post Now'}
                         </button>
                      </div>

                    </form>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
