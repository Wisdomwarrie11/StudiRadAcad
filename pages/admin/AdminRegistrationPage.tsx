import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminAuth, db } from "../../firebase";
import SEO from "../../components/SEO";
import { 
  collection, 
  onSnapshot, 
  orderBy, 
  query, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { 
  ArrowLeft, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  BookOpen, 
  User, 
  RefreshCw, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Award
} from "lucide-react";

export default function AdminRegistrationsPage() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "class" | "course">("all");
  const [selectedItemFilter, setSelectedItemFilter] = useState("all");
  const [itemsList, setItemsList] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribeAuth = adminAuth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/admin/login");
      }
    });

    const q = query(collection(db, "registrations"), orderBy("registeredAt", "desc"));
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistrations(data);

      // Extract unique list of class/course names for filter option
      const items = Array.from(new Set(data.map((reg: any) => reg.itemTitle || ""))).filter(Boolean);
      setItemsList(items);
      setLoading(false);
    }, (error) => {
      console.error("Error loading registrations:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeData();
    };
  }, [navigate]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        await deleteDoc(doc(db, "registrations", id));
      } catch (error) {
        console.error("Error deleting registration:", error);
        alert("Failed to delete registration. Please try again.");
      }
    }
  };

  // Search and filter logic
  const filteredRegistrations = registrations.filter(reg => {
    const title = reg.itemTitle || "";
    const type = reg.itemType || "";
    
    // Look inside custom answers for any text matching search
    const answersText = reg.answers 
      ? Object.entries(reg.answers).map(([k, v]) => `${k}:${v}`).join(" ").toLowerCase()
      : "";

    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      answersText.includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || type === typeFilter;
    const matchesItem = selectedItemFilter === "all" || title === selectedItemFilter;

    return matchesSearch && matchesType && matchesItem;
  });

  // Export to CSV helper
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert("No registrations available to export.");
      return;
    }

    // To handle dynamic headers, collect all unique answers questions/keys
    const answerKeys = Array.from(
      new Set(
        filteredRegistrations.flatMap(reg => reg.answers ? Object.keys(reg.answers) : [])
      )
    ) as string[];

    // Build header row
    const headers = ["ID", "Register Date", "Type", "Class/Course Title", ...answerKeys];
    
    // Build data rows
    const rows = filteredRegistrations.map(reg => {
      const dateStr = reg.registeredAt?.toDate 
        ? reg.registeredAt.toDate().toLocaleString() 
        : reg.registeredAt 
          ? new Date(reg.registeredAt).toLocaleString() 
          : "N/A";

      const rRow = [
        reg.id,
        dateStr,
        reg.itemType || "",
        reg.itemTitle || ""
      ];

      // Add each dynamic answer column
      answerKeys.forEach((key: string) => {
        let val = (reg.answers as any)?.[key] || "";
        // Excel CSV support requires double-quote sanitization
        val = val.toString().replace(/"/g, '""');
        rRow.push(`"${val}"`);
      });

      return rRow.join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `StudiRad_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-6">
      <SEO title="Registrations Database | Admin" description="Manage dynamic class and course registrations" />
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <Link to="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-4 font-black text-xs uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Form Registrations</h1>
              <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-black">
                {filteredRegistrations.length} Total
              </span>
            </div>
            <p className="text-slate-500 font-medium tracking-tight mt-1">Review dynamic form response cards submitted for pre-recorded courses and live classes.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="px-6 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/10"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search registered names, email, whatsapp, dynamic query fields..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all text-sm"
              />
            </div>

            {/* Type Selector */}
            <div className="w-full md:w-48 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="w-full pl-10 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all text-sm appearance-none"
              >
                <option value="all">All Types</option>
                <option value="class">Cohort Classes</option>
                <option value="course">Pre-recorded</option>
              </select>
            </div>

            {/* Course name selector */}
            <div className="w-full md:w-56 relative">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={selectedItemFilter}
                onChange={e => setSelectedItemFilter(e.target.value)}
                className="w-full pl-10 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all text-sm appearance-none"
              >
                <option value="all">All Items / Titles</option>
                {itemsList.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Display Panel */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="animate-spin text-brand-primary mb-4" size={32} />
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading Registrants Database...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center shadow-sm">
            <Users className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-black text-slate-800">No Registrations Found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">Try customizing your search query, selecting different items or types, or wait for student sign ups.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRegistrations.map((reg) => {
              const registerDate = reg.registeredAt?.toDate 
                ? reg.registeredAt.toDate().toLocaleString() 
                : reg.registeredAt 
                  ? new Date(reg.registeredAt).toLocaleString() 
                  : "N/A";

              const isClass = reg.itemType === "class";

              return (
                <div 
                  key={reg.id} 
                  className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group hover:border-brand-primary/20"
                >
                  {/* Absolute subtle background decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-6 -mt-6 z-0 group-hover:bg-brand-primary/5 transition-colors"></div>

                  <div className="relative z-10 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          isClass ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          <BookOpen size={10} /> {isClass ? 'Class' : 'Course'}
                        </span>
                        <h4 className="text-base font-black text-slate-800 tracking-tight leading-snug line-clamp-2 pr-6 mt-1">{reg.itemTitle || "Untitled Course"}</h4>
                      </div>
                      
                      <button
                        onClick={() => handleDelete(reg.id)}
                        className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-inner"
                        title="Delete registration card"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Answers Loop */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {reg.answers && Object.entries(reg.answers).map(([key, value]: [string, any]) => {
                        // Standard checks to display clean labels
                        const lowerKey = key.toLowerCase();
                        let icon = <ChevronRight size={14} className="text-slate-400 mt-0.5" />;
                        if (lowerKey.includes("name") || lowerKey.includes("fullname")) {
                          icon = <User size={14} className="text-brand-primary mt-0.5" />;
                        } else if (lowerKey.includes("email")) {
                          icon = <Mail size={14} className="text-brand-primary mt-0.5" />;
                        } else if (lowerKey.includes("whatsapp") || lowerKey.includes("phone") || lowerKey.includes("tel")) {
                          icon = <Phone size={14} className="text-brand-primary mt-0.5" />;
                        }

                        return (
                          <div key={key} className="flex gap-2.5">
                            {icon}
                            <div>
                              <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">{key}</span>
                              <span className="text-xs font-bold text-slate-700 block mt-0.5 whitespace-pre-wrap">{value || "—"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Date Indicator */}
                  <div className="relative z-10 pt-4 border-t border-slate-50 mt-4 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {registerDate}
                    </span>
                    <span className="text-[8px] tracking-wide text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded-md font-bold">
                      ID: {reg.id.slice(0, 6)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
