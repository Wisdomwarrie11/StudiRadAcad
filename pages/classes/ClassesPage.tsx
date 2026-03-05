import React, { useEffect, useState } from 'react';
// Fix: Use type-safe module import workaround for missing useLocation export
import * as ReactRouterDOM from 'react-router-dom';
const { useLocation, Link } = ReactRouterDOM as any;
import { FaStar, FaChevronDown, FaSearch, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import CourseModal from '../../components/classes/CourseModal';
// import CourseInfoExtras from '../../components/classes/CourseInfoExtras';
import SEO from '../../components/SEO';
import { Calendar, Clock, Video, ArrowRight } from 'lucide-react';

// Use any to bypass environment-specific Framer Motion type issues
const MotionDiv = motion.div as any;

const categories = ["X-ray", "Ultrasound", "MRI", "CT", "Nuclear Medicine"];

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const q = query(
      collection(db, 'classes'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
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

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const init: Record<string, number> = {};
    categories.forEach((c) => (init[c] = 4));
    setVisibleCounts(init);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');

    if (catParam) {
      const formatted = catParam.replace(/-/g, " ").toLowerCase() === "x ray"
        ? "X-ray"
        : catParam.charAt(0).toUpperCase() + catParam.slice(1);

      if (categories.includes(formatted)) {
        setSelectedCategory(formatted);
        setActiveAccordion(formatted);
      }
    } else {
      if (selectedCategory !== "All") {
        setActiveAccordion(selectedCategory);
      } else {
        setActiveAccordion(categories[0]);
      }
    }
  }, [location.search, selectedCategory]);

  const openModal = (course: any) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setShowModal(false);
  };

  const filteredClasses = classes.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLoadMore = (cat: string) => {
    setVisibleCounts((prev) => ({ ...prev, [cat]: (prev[cat] || 4) + 4 }));
  };

  const toggleAccordion = (cat: string) => {
    setActiveAccordion(activeAccordion === cat ? null : cat);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title="Live Classes & Cohorts"
        description="Join our live radiography cohorts and master your skills with expert guidance and community support."
      />

      {/* --- Hero Section --- */}
      <div className="relative bg-slate-900 pb-32 pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        
        <div className="relative container mx-auto px-4 max-w-7xl text-center">
          <span className="inline-block px-4 py-1.5 bg-brand-primary/20 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Interactive Learning
          </span>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Live Radiography <span className="text-brand-primary">Cohorts</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl font-medium">
            Join expert-led live sessions, participate in group discussions, and get real-time feedback on your progress.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-20 relative z-10 pb-20">
        
        {/* --- Floating Filters --- */}
        <div className="mb-12 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-center">
            {/* Search */}
            <div className="md:col-span-8 relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="h-5 w-5 text-gray-400"><FaSearch /></span>
              </div>
              <input
                type="text"
                placeholder="Search live classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-xl border-0 bg-gray-100 py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-brand-primary sm:text-sm sm:leading-6 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4 relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="h-4 w-4 text-gray-400"><FaFilter /></span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full appearance-none rounded-xl border-0 bg-gray-100 py-3 pl-11 pr-10 text-gray-900 focus:bg-white focus:ring-2 focus:ring-brand-primary sm:text-sm sm:leading-6 transition-all cursor-pointer font-bold"
              >
                <option value="All">All Modalities</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="h-4 w-4 text-gray-400"><FaChevronDown /></span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Course List --- */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Loading Classes...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <Calendar size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No courses/classes available yet</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              We're currently planning our next live cohorts. Check back soon or explore our pre-recorded courses!
            </p>
            <Link to="/courses" className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-dark transition-all">
              Explore Courses <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((cat) => {
              const group = filteredClasses.filter((c) => c.category === cat);
              if (group.length === 0) return null;

              const visible = visibleCounts[cat] || 4;
              const hasMore = group.length > visible;
              const isOpen = activeAccordion === cat;

              return (
                <div key={cat} className="group overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md">
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(cat)}
                    className="flex w-full items-center justify-between bg-white px-8 py-8 text-left transition-colors hover:bg-gray-50/80"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                        <span className="font-black text-xl">{cat.charAt(0)}</span>
                      </div>
                      <div>
                        <h5 className="text-2xl font-black text-slate-900">{cat}</h5>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                          {group.length} {group.length === 1 ? "class" : "classes"} available
                        </span>
                      </div>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 transition-transform duration-300 ${isOpen ? "rotate-180 bg-brand-primary/10 text-brand-primary" : "text-slate-300"}`}>
                      <span className="h-4 w-4"><FaChevronDown /></span>
                    </div>
                  </button>

                  {/* Accordion Body */}
                  <AnimatePresence>
                    {isOpen && (
                      <MotionDiv
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="border-t border-slate-50 bg-slate-50/30 p-8">
                          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {group.slice(0, visible).map((course) => (
                              <MotionDiv
                                key={course.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                              >
                                <div
                                  onClick={() => openModal(course)}
                                  className="group/card relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                  {/* Image */}
                                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    {course.thumbnail ? (
                                      <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <Video size={40} />
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"></div>
                                    
                                    <div className="absolute top-4 right-4">
                                      <span className="inline-block rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-white/90 backdrop-blur-sm text-slate-900 shadow-sm">
                                        {course.category}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Content */}
                                  <div className="flex flex-1 flex-col p-6">
                                    <h4 className="mb-3 text-xl font-black leading-tight text-slate-900 group-hover/card:text-brand-primary transition-colors">
                                      {course.title}
                                    </h4>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6">
                                      {course.technologies?.map((tech: string) => (
                                        <span key={tech} className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-[9px] font-black uppercase tracking-wider border border-slate-100">
                                          {tech}
                                        </span>
                                      ))}
                                    </div>

                                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-5">
                                      <span className="font-black text-slate-900 text-lg">
                                        {course.price}
                                      </span>
                                      <div className="flex items-center gap-1.5 text-slate-400">
                                        <Clock size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{course.duration}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </MotionDiv>
                            ))}
                          </div>

                          {hasMore && (
                            <div className="mt-10 text-center">
                              <button
                                onClick={() => handleLoadMore(cat)}
                                className="group inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-brand-primary"
                              >
                                Load more classes
                                <span className="ml-2 h-3 w-3 text-slate-400 transition-transform group-hover:translate-y-0.5 group-hover:text-brand-primary"><FaChevronDown /></span>
                              </button>
                            </div>
                          )}
                        </div>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* <CourseInfoExtras /> */}
      <CourseModal isOpen={showModal} onClose={closeModal} course={selectedCourse} />
    </div>
  );
}
