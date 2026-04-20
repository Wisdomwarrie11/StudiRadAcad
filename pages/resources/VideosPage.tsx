
import React, { useState, useEffect } from "react";
// Fix: Use type-safe module import workaround for missing useNavigate export
import * as ReactRouterDOM from "react-router-dom";
const { useNavigate } = ReactRouterDOM as any;
import { db } from "../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Play, Search, Filter, BookOpen, Plus, ExternalLink, Youtube, Facebook, Video, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../../components/SEO";

const VideosPage = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();

  const courses = [
    "All", "Anatomy", "Physiology", "Rad Tech", "Rad Equipment", 
    "Pathology", "CT", "MRI", "USS", "Projects", "Others"
  ];

  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVideos(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || v.uploader.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = activeTab === "All" || v.course === activeTab;
    return matchesSearch && matchesCourse;
  });

  // Helper to get video metadata based on URL
  const getVideoMetadata = (video: any) => {
    const url = video.link || "";
    const metadata = {
      type: 'other',
      label: 'Video',
      icon: Play,
      thumbnail: video.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
    };

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      metadata.type = 'youtube';
      metadata.label = 'YouTube';
      metadata.icon = Youtube;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11 && !video.thumbnailUrl) {
        metadata.thumbnail = `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
      }
    } else if (url.includes('tiktok.com')) {
      metadata.type = 'tiktok';
      metadata.label = 'TikTok';
      metadata.icon = Music;
      if (!video.thumbnailUrl) {
        metadata.thumbnail = "https://images.unsplash.com/photo-1595053826286-2e59efd9ff18?q=80&w=1000&auto=format&fit=crop"; 
      }
    } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
      metadata.type = 'facebook';
      metadata.label = 'Facebook';
      metadata.icon = Facebook;
      if (!video.thumbnailUrl) {
        metadata.thumbnail = "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop";
      }
    }

    return metadata;
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <SEO 
        title="Video Library"
        description="Watch educational videos on radiographic techniques, equipment handling, CT, MRI, and anatomy demonstrations."
      />
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Video Library</h2>
            <p className="text-slate-500 mt-1">Watch educational videos and technique demonstrations.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => navigate("/resources/materials")}
                className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
             >
                <BookOpen size={20} className="text-blue-500" /> Learning Materials
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
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-red-100 shadow-sm text-gray-700"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Tabs */}
        <div className="mb-10 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-2 min-w-max px-2">
            {courses.map((course) => (
              <button
                key={course}
                onClick={() => setActiveTab(course)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === course
                    ? "bg-red-600 text-white shadow-md transform scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filteredVideos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200"
            >
              <Filter size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-600">No videos found</h3>
              <p className="text-gray-400">Try adjusting your search or category filter.</p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredVideos.map((video) => {
                const meta = getVideoMetadata(video);
                const Icon = meta.icon;

                return (
                  <motion.a 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    key={video.id}
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full ring-1 ring-gray-100 hover:ring-red-100"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-900 overflow-hidden">
                       <img 
                         src={meta.thumbnail} 
                         alt={video.title}
                         className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                       />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 transition-all shadow-lg">
                             <Play className="w-6 h-6 text-white fill-current ml-1" />
                          </div>
                       </div>
                       <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded backdrop-blur-sm">
                          {video.course}
                       </div>
                       <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
                          <Icon size={12} /> {meta.label}
                       </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                       <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">{video.title}</h3>
                       <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
                            <span className="font-medium">By {video.uploader}</span>
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
                       </div>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideosPage;
