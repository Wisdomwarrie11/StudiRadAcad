import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
  Search, 
  Filter, 
  Star,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

const MotionDiv = motion.div as any;

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["X-ray", "Ultrasound", "MRI", "CT", "Nuclear Medicine"];

  useEffect(() => {
    const q = query(collection(db, 'courses'), where('status', '==', 'published'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching courses:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title="Pre-recorded Courses" 
        description="Access high-quality radiography video courses. Learn at your own pace with structured modules." 
      />

      {/* Hero Section */}
      <div className="relative bg-slate-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 bg-brand-primary/20 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Self-Paced Learning
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Master Your Craft with <br /> <span className="text-brand-primary">Expert Courses</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium mb-10">
              Access structured video lessons, supplemental materials, and quizzes designed by top radiography professionals.
            </p>
          </MotionDiv>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-12 relative z-20 pb-20">
        {/* Filters */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 mb-12">
          <div className="grid md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all"
              />
            </div>
            <div className="md:col-span-6 flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === 'All' 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                All Subjects
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Loading Courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <BookOpen size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No courses available yet</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              We're currently preparing high-quality content for you. Check back soon for new pre-recorded courses!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => (
              <MotionDiv
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <PlayCircle size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">(4.9)</span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-brand-primary transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-6">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <BookOpen size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">{course.modules?.length || 0} Modules</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-2xl font-black text-slate-900">
                      {course.price}
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary transition-all shadow-lg shadow-slate-900/10">
                      Enroll <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
