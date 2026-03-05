import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Users, 
  ArrowLeft,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, adminAuth } from '../../firebase';
import SEO from '../../components/SEO';

const AdminClassesPage = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

    const q = query(collection(db, 'classes'), orderBy('createdAt', 'desc'));
    const unsubscribeClasses = onSnapshot(q, (snapshot) => {
      const classesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClasses(classesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching classes:", error);
      setLoading(false);
    });


  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteDoc(doc(db, 'classes', id));
      } catch (error) {
        console.error("Error deleting class:", error);
        alert("Failed to delete class.");
      }
    }
  };

  const filteredClasses = classes.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <SEO title="Manage Classes | Admin" description="StudiRad Admin Class Management" />
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link to="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-4 font-bold text-sm uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Classes</h1>
            <p className="text-slate-500 font-medium">Create and manage live/cohort-based classes.</p>
          </div>
          <Link 
            to="/admin/create-class"
            className="flex items-center gap-2 px-6 py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
          >
            <Plus size={20} /> Add New Class
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none font-medium transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Classes...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No classes found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                            {c.thumbnail ? (
                              <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Calendar size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 group-hover:text-brand-primary transition-colors">{c.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                <Clock size={10} /> {c.duration}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                <Users size={10} /> {c.minStudents || 0}-{c.maxStudents || '∞'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-slate-900">{c.price}</span>
                      </td>
                      <td className="px-8 py-6">
                        {c.status === 'published' ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-wider">
                            <CheckCircle2 size={12} /> Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                            <Clock size={12} /> Draft
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-brand-primary transition-colors">
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(c.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClassesPage;
