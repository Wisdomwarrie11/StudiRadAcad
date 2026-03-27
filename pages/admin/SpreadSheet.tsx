
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Mail, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Download, 
  Loader2, 
  Search, 
  LogOut,
  Building2,
  ExternalLink,
  Filter
} from 'lucide-react';
import { getAllOpportunities, getAllEmployers } from '../../services/employerService';
import { EmployerProfile } from '../../types';
import SEO from '../../components/SEO';
import { adminAuth } from '../../firebase';

const AdminOpportunitiesSpreadsheet = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [employers, setEmployers] = useState<Record<string, EmployerProfile>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const unsubscribe = adminAuth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });

    const fetchData = async () => {
      try {
        const [oppsData, empsData] = await Promise.all([
          getAllOpportunities(),
          getAllEmployers()
        ]);
        
        // Create a lookup map for employers
        const empMap: Record<string, EmployerProfile> = {};
        empsData.forEach(emp => {
          empMap[emp.uid] = emp;
        });
        
        setOpportunities(oppsData);
        setEmployers(empMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    return () => unsubscribe();
  }, [navigate]);

  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch = 
      opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.facilityName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || opp.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const exportToCSV = () => {
    const headers = [
      'Type', 
      'Title', 
      'Organization/Facility', 
      'Address', 
      'Contact Email', 
      'Posted By (Name)', 
      'Posted By (Email)', 
      'Date Posted'
    ];
    
    const rows = filteredOpps.map(opp => {
      const employer = employers[opp.postedBy];
      return [
        opp.type.toUpperCase(),
        opp.title,
        opp.facilityName || opp.organizationName || employer?.organizationName || 'N/A',
        opp.location || opp.address || 'N/A',
        opp.contactEmail || opp.email || employer?.email || 'N/A',
        employer?.fullName || 'N/A',
        employer?.email || 'N/A',
        opp.postedAt ? new Date(opp.postedAt).toLocaleDateString() : 'N/A'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `opportunities_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 font-sans">
      <SEO title="Admin - Opportunities Database" description="Manage all posted opportunities." />
      
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link to="/admin/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-4 font-black transition-all">
              <ArrowLeft className="mr-2" size={18} /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Opportunities Database</h1>
            <p className="text-slate-500 font-medium">Manage all jobs, internships, and scholarships posted by organizations.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:border-brand-primary font-bold text-sm shadow-sm"
              />
            </div>
            
            <div className="relative">
              <select 
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="appearance-none pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-brand-primary shadow-sm cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="job">Jobs</option>
                <option value="internship">Internships</option>
                <option value="scholarship">Scholarships</option>
              </select>
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            </div>

            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
            >
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Opportunity Title</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Facility/Org</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted By</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Email</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOpps.map((opp, idx) => {
                    const employer = employers[opp.postedBy];
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                            opp.type === 'job' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            opp.type === 'internship' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {opp.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm">{opp.title}</span>
                            {opp.isAdminPost && (
                              <span className="text-[8px] text-brand-primary font-black uppercase tracking-tighter">Admin Post</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-slate-300" />
                            <span className="font-bold text-slate-700 text-sm">
                              {opp.facilityName || opp.organizationName || employer?.organizationName || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-slate-300" />
                            <span className="text-slate-500 font-medium text-xs">
                              {opp.location || opp.address || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-xs">{employer?.fullName || 'Admin'}</span>
                            <span className="text-[9px] text-slate-400 font-medium">{employer?.email || 'System'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <a href={`mailto:${opp.contactEmail || opp.email || employer?.email}`} className="text-brand-primary hover:underline font-medium text-xs">
                            {opp.contactEmail || opp.email || employer?.email || 'N/A'}
                          </a>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-400 text-[10px] font-bold">
                            {opp.postedAt ? new Date(opp.postedAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOpps.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-20 text-center text-slate-400 font-medium">
                        No opportunities found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOpportunitiesSpreadsheet;
