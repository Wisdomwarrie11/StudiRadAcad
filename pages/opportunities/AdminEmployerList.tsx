import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, Globe, Calendar, ArrowLeft, Download, Loader2, Search, LogOut } from 'lucide-react';
import { getAllEmployers } from '../../services/employerService';
import { EmployerProfile } from '../../types';
import SEO from '../../components/SEO';

const AdminEmployerList = () => {
  const navigate = useNavigate();
  const [employers, setEmployers] = useState<EmployerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('studiRad_admin_auth');
    if (!auth) {
      navigate('/admin/login');
      return;
    }

    const fetchEmployers = async () => {
      const data = await getAllEmployers();
      setEmployers(data);
      setLoading(false);
    };
    fetchEmployers();
  }, []);

  const filteredEmployers = employers.filter(emp => 
    emp.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Organization Name', 'Full Name', 'Role', 'Email', 'Status', 'Phone', 'Website', 'Registered At'];
    const rows = employers.map(emp => [
      emp.organizationName,
      emp.fullName,
      emp.roleInOrg,
      emp.email,
      emp.verified ? 'Verified' : 'Pending',
      emp.phoneNumber,
      emp.website || 'N/A',
      emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employers_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyEmails = () => {
    const emails = filteredEmployers.map(e => e.email).join(', ');
    navigator.clipboard.writeText(emails);
    alert('Emails copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 font-sans">
      <SEO title="Admin - Employer Data" description="Registered employers database." />
      
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link to="/admin/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-4 font-black transition-all">
              <ArrowLeft className="mr-2" size={18} /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Employer Database</h1>
            <p className="text-slate-500 font-medium">Collation of all registered organizations on the platform.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:border-brand-primary font-bold text-sm shadow-sm"
              />
            </div>
            <button 
              onClick={copyEmails}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              Copy Emails
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
            >
              <Download size={18} /> Export CSV
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('studiRad_admin_auth');
                navigate('/admin/login');
              }}
              className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl border border-slate-100 transition-colors shadow-sm"
              title="Logout"
            >
              <LogOut size={20} />
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
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Person</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredEmployers.map((emp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center shrink-0">
                            <Building2 size={14} />
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{emp.organizationName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{emp.fullName}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{emp.roleInOrg}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <a href={`mailto:${emp.email}`} className="text-slate-500 hover:text-brand-primary font-medium transition-colors text-sm">
                          {emp.email}
                        </a>
                      </td>
                      <td className="p-4">
                        {emp.verified ? (
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-100">Verified</span>
                        ) : (
                          <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-amber-100">Pending</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-slate-500 font-medium text-sm">
                          {emp.phoneNumber}
                        </span>
                      </td>
                      <td className="p-4">
                        {emp.website ? (
                          <a href={emp.website} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-medium text-sm">
                            Link
                          </a>
                        ) : (
                          <span className="text-slate-300 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-slate-400 text-xs font-bold">
                          {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-20 text-center text-slate-400 font-medium">
                        No organizations found matching your search.
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

export default AdminEmployerList;
