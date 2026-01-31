
import React, { useState, useEffect } from "react";
import * as ReactRouterDOM from "react-router-dom";
const { useNavigate } = ReactRouterDOM as any;
import { db } from "../../firebase";
import MaterialReaderModal from "../../components/resources/MaterialReaderModal";
import SEO from "../../components/SEO";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { 
  Book, 
  Share2, 
  Search, 
  Plus, 
  Filter, 
  Link as LinkIcon, 
  ExternalLink, 
  Video, 
  FileText,
  Clock,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const MaterialsPage = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showReader, setShowReader] = useState(false);
  const materialsPerPage = 8;
  const navigate = useNavigate();

  const courses = [
    "All",
    "Anatomy",
    "Physiology",
    "Rad Tech",
    "Rad Equipment",
    "Pathology",
    "CT",
    "MRI",
    "USS",
    "Projects",
    "Past Questions",
    "Others"
  ];

  const courseColors: Record<string, { main: string; light: string; border: string }> = {
    Anatomy: { main: "text-blue-600", light: "bg-blue-50", border: "border-blue-200" },
    Physiology: { main: "text-emerald-600", light: "bg-emerald-50", border: "border-emerald-200" },
    "Rad Tech": { main: "text-purple-600", light: "bg-purple-50", border: "border-purple-200" },
    "Rad Equipment": { main: "text-rose-600", light: "bg-rose-50", border: "border-rose-200" },
    Pathology: { main: "text-red-600", light: "bg-red-50", border: "border-red-200" },
    CT: { main: "text-cyan-600", light: "bg-cyan-50", border: "border-cyan-200" },
    MRI: { main: "text-amber-600", light: "bg-amber-50", border: "border-amber-200" },
    USS: { main: "text-teal-600", light: "bg-teal-50", border: "border-teal-200" },
    Projects: { main: "text-indigo-600", light: "bg-indigo-50", border: "border-indigo-200" },
    "Past Questions": { main: "text-slate-600", light: "bg-slate-100", border: "border-slate-200" },
    Others: { main: "text-pink-600", light: "bg-pink-50", border: "border-pink-200" },
    All: { main: "text-brand-primary", light: "bg-slate-100", border: "border-slate-200" },
  };

  useEffect(() => {
    const q = query(collection(db, "materials"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMaterials(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.uploader.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = activeTab === "All" || m.course === activeTab;
    return matchesSearch && matchesCourse;
  });

  const totalPages = Math.ceil(filteredMaterials.length / materialsPerPage);
  const indexOfLastMaterial = currentPage * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterials = filteredMaterials.slice(
    indexOfFirstMaterial,
    indexOfLastMaterial
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: `${title} | StudiRad Material`,
        text: "Check out this radiography study material!",
        url: window.location.href,
      });
    } else {
      alert("Link copied to clipboard!");
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "Recently";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-28 pb-20 font-sans">
      <SEO 
        title="Learning Materials"
        description="Access anatomy, physiology, and pathology study materials for radiographers. Download PDF resources and prepare for exams."
      />

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Book size={14} /> Academic Repository
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-3">
              Learning <span className="text-brand-primary">Materials</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Explore our curated library of radiography textbooks, lecture notes, and clinical guides contributed by experts.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <button 
              onClick={() => navigate("/resources/videos")}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-4 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <Video size={18} className="text-red-500" /> Video Library
            </button>
            <button 
              onClick={() => navigate("/resources/submit-material")}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-brand-primary text-white px-6 py-4 rounded-2xl font-black text-sm hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 active:scale-95"
            >
              <Plus size={18} /> Contribute
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by title, topic, or uploader..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] border-2 border-slate-100 focus:border-brand-primary outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
              />
            </div>
            
            <div className="flex items-center gap-2 px-4 bg-slate-50 rounded-[1.5rem] border-2 border-slate-100 min-w-max hidden md:flex">
              <Filter size={18} className="text-slate-400" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sort: Latest</span>
            </div>
          </div>

          {/* Scrolling Categories */}
          <div className="mt-6 overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex gap-2 min-w-max">
              {courses.map((course) => {
                const isActive = activeTab === course;
                const colors = courseColors[course] || courseColors.All;
                return (
                  <button
                    key={course}
                    onClick={() => {
                      setActiveTab(course);
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 ${
                      isActive 
                        ? `${colors.main} ${colors.light} ${colors.border.replace('border-', 'border-')}` 
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
                    }`}
                  >
                    {course}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8 px-4">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">{filteredMaterials.length}</span> Resources
          </p>
        </div>

        {/* Materials Grid */}
        {currentMaterials.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Search size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Results Found</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">
              We couldn't find any materials matching your search criteria. Try a different category or keywords.
            </p>
            <button 
              onClick={() => { setSearchTerm(""); setActiveTab("All"); }}
              className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-brand-primary transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {currentMaterials.map((m) => {
              const config = courseColors[m.course] || courseColors.All;
              const isLink = m.type === 'link';

              return (
                <div 
                  key={m.id}
                  className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
                >
                  {/* Category Accent */}
                  <div className={`absolute left-0 top-12 w-1.5 h-12 rounded-r-full ${config.main.replace('text-', 'bg-')} transition-transform group-hover:scale-y-125`}></div>

                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl ${config.light} ${config.main} shadow-inner`}>
                      {isLink ? <LinkIcon size={24} /> : <FileText size={24} />}
                    </div>
                    <button 
                      onClick={() => handleShare(m.title)}
                      className="p-2 text-slate-300 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors"
                      title="Share Material"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>

                  <div className="flex-grow">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${config.main} mb-2 block`}>
                      {m.course}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mb-4 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
                      {m.title}
                    </h3>
                    
                    <div className="space-y-2 mb-8">
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <User size={14} className="text-slate-300" />
                          <span className="truncate">{m.uploader}</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <Clock size={14} className="text-slate-300" />
                          <span>{formatDate(m.createdAt)}</span>
                       </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {isLink ? (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${config.main} ${config.border} hover:${config.main.replace('text-', 'bg-')} hover:text-white active:scale-95`}
                      >
                        Visit Link <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedMaterial(m);
                          setShowReader(true);
                        }}
                        className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${config.main} ${config.border} hover:${config.main.replace('text-', 'bg-')} hover:text-white active:scale-95`}
                      >
                        Read Document <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                      isActive
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105"
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <MaterialReaderModal
        show={showReader}
        onHide={() => setShowReader(false)}
        material={selectedMaterial}
      />
    </div>
  );
};

export default MaterialsPage;
