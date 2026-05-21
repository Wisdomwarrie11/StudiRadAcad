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
import CourseModal from '../../components/classes/CourseModal';

const MotionDiv = motion.div as any;

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ["X-ray", "Ultrasound", "MRI", "CT", "Nuclear Medicine"];

  const COMING_SOON_COURSES = [
    {
      id: "cs-1",
      title: "Advanced MRI Cardiac Imaging",
      category: "MRI",
      level: "Advanced",
      price: "Coming Soon",
      duration: "15 Hours",
      status: "coming-soon",
      thumbnail: "cardiacmri.jpeg",
      description: "Deep dive into cardiac MRI protocols, pathologies, and advanced post-processing techniques.",
      modules: []
    },
    {
      id: "cs-2",
      title: "Pediatric Radiography Mastery",
      category: "X-ray",
      level: "Intermediate",
      price: "Coming Soon",
      duration: "8 Hours",
      status: "coming-soon",
      thumbnail: "RN.jpeg",
      description: "Learn specialized techniques for imaging neonates and children while maintaining radiation safety.",
      modules: []
    },
    {
      id: "cs-3",
      title: "Emergency CT Scans: Fast Track",
      category: "CT",
      level: "Intermediate",
      price: "Coming Soon",
      duration: "10 Hours",
      status: "coming-soon",
      thumbnail: "CTemer.jpeg",
      description: "Master the art of rapid CT interpretation and protocol optimization for emergency trauma cases.",
      modules: []
    }
  ];


  useEffect(() => {
    const q = query(collection(db, 'courses'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Merge with COMING_SOON_COURSES
      setCourses([...coursesData, ...COMING_SOON_COURSES]);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching courses:", error);
      setCourses(COMING_SOON_COURSES);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (course: any) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setShowModal(false);
  };

  const filteredCourses = courses.filter(c => {
    const titleMatch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || descMatch;
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
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => openModal(course)}
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden flex flex-col cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  {course.thumbnail ? (
                    <>
                      {/* Blurred backdrop to fill the aspect wrapper */}
                      <img
                        src={course.thumbnail}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover filter blur-lg opacity-40 scale-110 pointer-events-none"
                      />
                      {/* Crisp foreground image */}
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="relative h-full w-full object-contain transition-all duration-700 group-hover:scale-[1.03]"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <PlayCircle size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {course.category}
                    </span>
                    {course.status === 'coming-soon' && (
                      <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                        Soon
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {course.level || 'All Levels'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-brand-primary transition-colors line-clamp-2 min-h-[4rem] leading-tight">
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
                    <div className={`text-2xl font-black ${course.status === 'coming-soon' ? 'text-amber-500' : 'text-slate-900'}`}>
                      {course.price}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openModal(course); }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                        course.status === 'coming-soon'
                          ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white shadow-none'
                          : 'bg-slate-900 text-white hover:bg-brand-primary shadow-slate-900/10'
                      }`}
                    >
                      {course.status === 'coming-soon' ? 'Coming Soon' : 'Enroll Now'} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        )}
      </div>
      <CourseModal isOpen={showModal} onClose={closeModal} course={selectedCourse} />
    </div>
  );
};

export default CoursesPage;
