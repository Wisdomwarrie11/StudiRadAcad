import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import MaterialReaderModal from "../../components/resources/MaterialReaderModal";
import SEO from "../../components/SEO";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { Book, Share2, Search, Plus, Filter, Link as LinkIcon, ExternalLink, Video } from "lucide-react";

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
    "Professional Exams PQ",
    "Others"
  ];

  const courseColors: Record<string, string> = {
    Anatomy: "border-blue-500 text-blue-500 bg-blue-50",
    Physiology: "border-green-500 text-green-500 bg-green-50",
    "Rad Tech": "border-purple-600 text-purple-600 bg-purple-50",
    "Rad Equipment": "border-pink-500 text-pink-500 bg-pink-50",
    Pathology: "border-red-500 text-red-500 bg-red-50",
    CT: "border-cyan-500 text-cyan-500 bg-cyan-50",
    MRI: "border-orange-500 text-orange-500 bg-orange-50",
    USS: "border-teal-500 text-teal-500 bg-teal-50",
    Projects: "border-indigo-600 text-indigo-600 bg-indigo-50",
    "Professional Exams PQ": "border-gray-500 text-gray-500 bg-gray-50",
    Others: "border-indigo-500 text-indigo-500 bg-indigo-50",
    All: "border-brand-dark text-brand-dark bg-gray-100",
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

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: `${title} | Reading Material`,
        text: "Check out this material on StudiRad!",
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported on this browser");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <SEO 
        title="Reading Library"
        description="Access anatomy, physiology, and pathology study materials for radiographers. Download PDF resources and prepare for exams."
      />
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-brand-dark">Reading Library</h2>
            <p className="text-gray-500 mt-1">Access verified study materials from peers and experts.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => navigate("/resources/videos")}
                className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
             >
                <Video size={20} className="text-red-500" /> Video Library
             </button>
             <button 
                onClick={() => navigate("/resources/submit-material")}
                className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20"
            >
                <Plus size={20} /> Contribute
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <input 
            type="text" 
            placeholder="Search materials by title or uploader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-sm text-gray-700"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Tabs */}
        <div className="mb-10 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-2 min-w-max px-2">
            {courses.map((course) => (
              <button
                key={course}
                onClick={() => {
                  setActiveTab(course);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === course
                    ? "bg-brand-dark text-white shadow-md transform scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {currentMaterials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <Filter size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-600">No materials found</h3>
            <p className="text-gray-400">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {currentMaterials.map((m) => {
              const colors = courseColors[m.course] || courseColors.All;
              // Extract parts from the color string defined above
              const [borderColor, textColor, bgColor] = colors.split(' ');
              const isLink = m.type === 'link';

              return (
                <div 
                  key={m.id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center border-t-4 ${borderColor}`}
                >
                  <div className={`p-4 rounded-full mb-4 ${bgColor} ${textColor}`}>
                    {isLink ? <LinkIcon size={28} /> : <Book size={28} />}
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] leading-tight">{m.title}</h3>
                  <p className="text-xs text-gray-500 mb-6">Uploaded by <span className="font-medium text-gray-700">{m.uploader}</span></p>
                  
                  <div className="mt-auto w-full space-y-3">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => handleShare(m.title)}
                        className="text-gray-400 hover:text-brand-primary transition-colors p-2 rounded-full hover:bg-gray-50"
                        title="Share"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                    
                    {isLink ? (
                        <a
                            href={m.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border font-medium text-sm transition-colors hover:bg-gray-50 ${borderColor.replace('border-', 'text-')}`}
                        >
                            Open Link <ExternalLink size={14} />
                        </a>
                    ) : (
                        <button
                        onClick={() => {
                            setSelectedMaterial(m);
                            setShowReader(true);
                        }}
                        className={`w-full py-2.5 rounded-lg border font-medium text-sm transition-colors hover:bg-gray-50 ${borderColor.replace('border-', 'text-')}`}
                        >
                        Read Material
                        </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                  i + 1 === currentPage
                    ? "bg-brand-primary text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
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