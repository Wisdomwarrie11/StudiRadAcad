import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaStar, FaChevronDown, FaSearch, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import CourseModal from '../../components/classes/CourseModal';
import CourseInfoExtras from '../../components/classes/CourseInfoExtras';
import { Course } from '../../types';

// Mock Data
const courses: Course[] = [
  { id: 1, title: "Introduction to Radiation Physics", category: "X-ray", level: "Beginner", price: "Free", rating: 4.7, img: "x-ray.jpeg" },
  { id: 2, title: "Basic Radiographic Anatomy", category: "X-ray", level: "Beginner", price: "Free", rating: 4.5, img: "skullana.jpeg" },
  { id: 3, title: "Principles of Chest X-ray", category: "X-ray", level: "Beginner", price: "Free", rating: 4.5, img: "Rad1.jpeg" },
  { id: 4, title: "Obstetrics Ultrasound", category: "Ultrasound", level: "Intermediate", price: "₦2,900", rating: 4.5, img: "obs.jpeg" },
  { id: 5, title: "Abdominal Ultrasound", category: "Ultrasound", level: "Intermediate", price: "₦2,900", rating: 4.7, img: "Abd.jpg" },
  { id: 6, title: "MRI Fundamentals", category: "MRI", level: "Beginner", price: "Free", rating: 4.4, img: "mri.jpeg" },
  { id: 7, title: "Advanced MRI Imaging", category: "MRI", level: "Advanced", price: "₦5,700", rating: 4.8, img: "MRIpro.jpeg" },
  { id: 8, title: "CT Imaging Principles", category: "CT", level: "Beginner", price: "Free", rating: 4.3, img: "CT.jpeg" },
  { id: 9, title: "Chest CT Protocols", category: "CT", level: "Intermediate", price: "₦3,000", rating: 4.6, img: "CtInter.jpeg" },
];

const categories = ["X-ray", "Ultrasound", "MRI", "CT"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

const levelStyles = {
  Beginner: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Intermediate: "bg-amber-100 text-amber-800 border-amber-200",
  Advanced: "bg-rose-100 text-rose-800 border-rose-200",
};

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const location = useLocation();

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

  const openModal = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setShowModal(false);
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "All" || c.level === selectedLevel;
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
      <div className="flex text-amber-400 text-sm gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <FaStar key={i} />;
          if (i === full && half) return <FaStar key={i} className="opacity-50" />;
          return <FaStar key={i} className="text-gray-200" />;
        })}
      </div>
    );
  };

  const handleLoadMore = (cat: string) => {
    setVisibleCounts((prev) => ({ ...prev, [cat]: (prev[cat] || 4) + 4 }));
  };

  const toggleAccordion = (cat: string) => {
    setActiveAccordion(activeAccordion === cat ? null : cat);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- Hero Section --- */}
      <div className="relative bg-slate-900 pb-32 pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        
        <div className="relative container mx-auto px-4 max-w-7xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Master Radiography
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl">
            Browse our comprehensive curriculum. Filter by level or modality,
            search for specific topics, and advance your career.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-20 relative z-10 pb-20">
        
        {/* --- Floating Filters --- */}
        <div className="mb-12 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-center">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-xl border-0 bg-gray-100 py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
              />
            </div>

            {/* Level Filter */}
            <div className="md:col-span-3 relative">
               <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <FaFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="block w-full appearance-none rounded-xl border-0 bg-gray-100 py-3 pl-11 pr-10 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all cursor-pointer"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl === "All" ? "All Levels" : lvl}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <FaChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4 relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <FaFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full appearance-none rounded-xl border-0 bg-gray-100 py-3 pl-11 pr-10 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all cursor-pointer"
              >
                <option value="All">All Modalities</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <FaChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* --- Course List --- */}
        <div className="space-y-8">
          {categories.map((cat) => {
            const group = filteredCourses.filter((c) => c.category === cat);
            if (group.length === 0) return null;

            const visible = visibleCounts[cat] || 4;
            const hasMore = group.length > visible;
            const isOpen = activeAccordion === cat;

            return (
              <div key={cat} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(cat)}
                  className="flex w-full items-center justify-between bg-white px-8 py-6 text-left transition-colors hover:bg-gray-50/80"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      {/* Placeholder icon based on category logic could go here */}
                      <span className="font-bold text-lg">{cat.charAt(0)}</span>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-900">{cat}</h5>
                      <span className="text-sm text-gray-500">
                        {group.length} {group.length === 1 ? "course" : "courses"} available
                      </span>
                    </div>
                  </div>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-transform duration-300 ${isOpen ? "rotate-180 bg-indigo-100 text-indigo-600" : "text-gray-400"}`}>
                    <FaChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* Accordion Body */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-gray-100 bg-gray-50/30 p-8">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {group.slice(0, visible).map((course) => (
                            <motion.div
                              key={course.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="h-full"
                            >
                              <div
                                onClick={() => openModal(course)}
                                className="group/card relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                              >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                                  <img
                                    src={course.img}
                                    alt={course.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"></div>
                                  
                                  <div className="absolute top-3 right-3">
                                    <span className={`inline-block rounded-md px-2 py-1 text-xs font-bold border shadow-sm ${levelStyles[course.level] || "bg-gray-100"}`}>
                                      {course.level}
                                    </span>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col p-5">
                                  <h4 className="mb-2 text-lg font-bold leading-tight text-gray-900 group-hover/card:text-indigo-600 transition-colors">
                                    {course.title}
                                  </h4>
                                  
                                  <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Not yet available
                                  </div>

                                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                                      {course.price}
                                    </span>
                                    {renderStars(course.rating)}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {hasMore && (
                          <div className="mt-10 text-center">
                            <button
                              onClick={() => handleLoadMore(cat)}
                              className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-indigo-600"
                            >
                              Load more classes
                              <FaChevronDown className="ml-2 h-3 w-3 text-gray-400 transition-transform group-hover:translate-y-0.5 group-hover:text-indigo-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <CourseInfoExtras />
      <CourseModal show={showModal} handleClose={closeModal} course={selectedCourse} />
    </div>
  );
}
