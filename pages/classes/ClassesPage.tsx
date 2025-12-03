import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaStar, FaChevronDown, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import CourseModal from '../../components/classes/CourseModal';
import CourseInfoExtras from '../../components/classes/CourseInfoExtras';
import { Course } from '../../types';

// Mock Data
const courses: Course[] = [
  { id: 1, title: "Introduction to Radiation Physics", category: "X-ray", level: "Beginner", price: "Free", rating: 4.7, img: "https://picsum.photos/400/300?random=1" },
  { id: 2, title: "Basic Radiographic Anatomy", category: "X-ray", level: "Beginner", price: "Free", rating: 4.5, img: "https://picsum.photos/400/300?random=2" },
  { id: 3, title: "Principles of Chest X-ray", category: "X-ray", level: "Beginner", price: "Free", rating: 4.5, img: "https://picsum.photos/400/300?random=3" },
  { id: 4, title: "Obstetrics Ultrasound", category: "Ultrasound", level: "Intermediate", price: "₦2,900", rating: 4.5, img: "https://picsum.photos/400/300?random=4" },
  { id: 5, title: "Abdominal Ultrasound", category: "Ultrasound", level: "Intermediate", price: "₦2,900", rating: 4.7, img: "https://picsum.photos/400/300?random=5" },
  { id: 6, title: "MRI Fundamentals", category: "MRI", level: "Beginner", price: "Free", rating: 4.4, img: "https://picsum.photos/400/300?random=6" },
  { id: 7, title: "Advanced MRI Imaging", category: "MRI", level: "Advanced", price: "₦5,700", rating: 4.8, img: "https://picsum.photos/400/300?random=7" },
  { id: 8, title: "CT Imaging Principles", category: "CT", level: "Beginner", price: "Free", rating: 4.3, img: "https://picsum.photos/400/300?random=8" },
  { id: 9, title: "Chest CT Protocols", category: "CT", level: "Intermediate", price: "₦3,000", rating: 4.6, img: "https://picsum.photos/400/300?random=9" },
];

const categories = ["X-ray", "Ultrasound", "MRI", "CT"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

const levelColors = { 
  Beginner: "bg-green-100 text-green-800 border-green-200", 
  Intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  Advanced: "bg-red-100 text-red-800 border-red-200" 
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

  // Initialize visible counts
  useEffect(() => {
    const init: Record<string, number> = {};
    categories.forEach((c) => (init[c] = 4));
    setVisibleCounts(init);
  }, []);

  // Handle auto-expanding category if provided via navigation state or similar mechanism
  useEffect(() => {
    // If we wanted to support ?category=MRI via URL search params
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
      // Default open the first one if "All" is selected, or open the specific selected category
      if (selectedCategory !== "All") {
        setActiveAccordion(selectedCategory);
      } else {
        setActiveAccordion(categories[0]); // Default open first
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
      <div className="flex text-yellow-400 text-sm">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <FaStar key={i} />;
          if (i === full && half) return <FaStar key={i} className="opacity-50" />;
          return <FaStar key={i} className="text-gray-300" />;
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Available Classes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our comprehensive radiography curriculum. Filter by level or modality, 
            search for specific topics, or explore categories below.
          </p>
        </header>

        {/* Filters Section */}
        <div className="mb-10 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="md:col-span-5 relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by class title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl === "All" ? "All Levels" : lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="All">All Modalities</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-6">
          {categories.map((cat) => {
            const group = filteredCourses.filter((c) => c.category === cat);
            if (group.length === 0) return null;
            
            const visible = visibleCounts[cat] || 4;
            const hasMore = group.length > visible;
            const isOpen = activeAccordion === cat;

            return (
              <div key={cat} className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(cat)}
                  className="flex w-full items-center justify-between bg-white px-6 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <h5 className="text-xl font-bold text-blue-600 mb-0">{cat}</h5>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {group.length} {group.length === 1 ? "course" : "courses"}
                    </span>
                  </div>
                  <FaChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Accordion Body */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                          {group.slice(0, visible).map((course) => (
                            <motion.div
                              key={course.id}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.28 }}
                              className="group h-full"
                            >
                              <div 
                                onClick={() => openModal(course)}
                                className="flex h-full flex-col cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:-translate-y-1 hover:shadow-md"
                              >
                                <div className="relative h-48 w-full overflow-hidden">
                                  <img 
                                    src={course.img} 
                                    alt={course.title} 
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute top-2 right-2">
                                     <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold border ${levelColors[course.level]}`}>
                                        {course.level}
                                     </span>
                                  </div>
                                </div>

                                <div className="flex flex-1 flex-col p-4">
                                  <h4 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                                    {course.title}
                                  </h4>
                                  
                                  <div className="mb-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Not yet available
                                  </div>

                                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                                    <span className="font-bold text-gray-900">{course.price}</span>
                                    {renderStars(course.rating)}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {hasMore && (
                          <div className="mt-8 text-center">
                            <button
                              onClick={() => handleLoadMore(cat)}
                              className="rounded-lg border-2 border-blue-600 px-6 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
                            >
                              Load more
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
