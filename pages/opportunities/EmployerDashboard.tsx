

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  Briefcase, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Loader2, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Eye, 
  Trash2,
  AlertCircle,
  Building2
} from 'lucide-react';
import { getCurrentEmployer, getMyOpportunities } from '../../services/employerService';
import { EmployerProfile } from '../../types';
import SEO from '../../components/SEO';
import { auth } from '../../firebase';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships' | 'scholarships'>('jobs');
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getCurrentEmployer();
      if (!data) {
        navigate('/employer/login');
        return;
      }
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!profile) return;
      // Comment: Converting plural tab keys to singular values expected by the service API
      const typeMap: Record<string, 'job' | 'internship' | 'scholarship'> = {
        jobs: 'job',
        internships: 'internship',
        scholarships: 'scholarship'
      };
      const data = await getMyOpportunities(typeMap[activeTab]);
      setPosts(data);
    };
    fetchPosts();
  }, [activeTab, profile]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/employer/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
       <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans">
      <SEO title="Employer Dashboard" description="Manage your organization's radiography opportunities." />
      
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Verified Facility
                  </span>
               </div>
               <p className="text-slate-500 font-medium">Manage postings for <span className="text-slate-900 font-bold">{profile?.organizationName}</span></p>
            </div>
            
            <div className="flex gap-3">
               <Link 
                to="/employer/post" 
                className="bg-brand-primary text-white px-6 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/10"
               >
                 <Plus size={18} /> Post Opportunity
               </Link>
               <button 
                onClick={handleLogout}
                className="p-4 bg-white text-slate-400 hover:text-red-500 rounded-2xl border border-slate-100 transition-colors shadow-sm"
               >
                 <LogOut size={20} />
               </button>
            </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar Stats */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                        <Building2 size={24} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-900 truncate max-w-[120px]">{profile?.fullName}</h4>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{profile?.roleInOrg}</p>
                     </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-slate-50">
                     <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Posts</p>
                        <p className="text-2xl font-black text-slate-900">{posts.length}</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Status</p>
                        <p className="text-sm font-bold text-emerald-600">Account Active</p>
                     </div>
                  </div>
               </div>

               <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
                  <h4 className="text-lg font-bold mb-2">Premium Perks</h4>
                  <p className="text-xs text-indigo-100 leading-relaxed mb-6">As a registered facility, your posts get 2x more visibility in our newsletters.</p>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Learn More</button>
               </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
               
               {/* Post Management Tabs */}
               <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm max-w-md">
                  {(['jobs', 'internships', 'scholarships'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        {tab}
                    </button>
                  ))}
               </div>

               {/* Listings Grid/List */}
               <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                           <LayoutDashboard className="text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No {activeTab} yet</h3>
                        <p className="text-slate-400 text-sm mb-8">Start by posting your facility's first opening.</p>
                        <Link to="/employer/post" className="text-brand-primary font-black hover:underline flex items-center justify-center gap-2">
                           Create your first post <ChevronRight size={16} />
                        </Link>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                        {posts.map(post => (
                            <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-brand-primary/30 transition-all">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-brand-primary transition-colors">{post.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {post.location}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(post.postedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"><Eye size={18} /></button>
                                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                  )}
               </div>

               {/* Guidelines Card */}
               <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 flex items-start gap-5">
                   <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                      <AlertCircle size={24} />
                   </div>
                   <div>
                      <h4 className="font-black text-amber-900 mb-2 uppercase tracking-widest text-xs">Employer Guidelines</h4>
                      <p className="text-sm text-amber-800 leading-relaxed font-medium">
                        To maintain trust, all postings must include a valid contact method and clear requirements. Posts containing misleading information or discriminatory language will be removed immediately.
                      </p>
                   </div>
               </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
