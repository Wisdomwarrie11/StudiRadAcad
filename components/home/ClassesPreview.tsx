
import React, { useEffect, useState } from 'react';
import { Star, Clock, ChevronRight, Zap, Activity, Brain, Disc, Loader2 } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

const modalities = [
  { id: "xray", title: "X-ray", icon: Zap, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "ultrasound", title: "Ultrasound", icon: Activity, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "mri", title: "MRI", icon: Disc, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "ct", title: "CT", icon: Brain, color: "text-teal-500", bg: "bg-teal-50" },
];

const ACTIVE_CLASSES = [
  {
    id: "chest-critique-2026",
    title: "Radiographic Image Critique: Systematic Evaluation of Chest Radiographs",
    category: "X-ray",
    level: "All Levels",
    status: "active",
    price: "FREE",
    isPaid: false,
    duration: "5 Days (22nd – 26th June 2026)",
    time: "8:30 PM Daily",
    venue: "StudiRad Google Classroom",
    thumbnail: "/Critiquing.jpeg",
    hasCustomRegistration: true,
    description: "Master the art and science of chest radiograph interpretation. Perfect your systematic approach to quality evaluation and pattern recognition.",
    itemType: 'class'
  }
];

const COMING_SOON_CLASSES = [
  {
    id: "cs-class-1",
    title: "Skull X-ray Clinical Interpretation",
    category: "X-ray",
    level: "Beginner",
    status: "coming-soon",
    thumbnail: "/skull.jpg",
    isPaid: true,
    description: "A clinical masterclass on interpreting chest X-rays. Perfect for students and interns preparing for clinical rotations.",
    itemType: 'class'
  },
  {
    id: "cs-class-2",
    title: "Advanced Ultrasound Cohort: OB/GYN",
    category: "Ultrasound",
    level: "Advanced",
    status: "coming-soon",
    thumbnail: "/ultrasound.jpeg",
    isPaid: true,
    description: "Join our intensive cohort focused on advanced obstetric and gynecological ultrasound techniques.",
    itemType: 'class'
  }
];

const COMING_SOON_COURSES = [
  {
    id: "cs-1",
    title: "Advanced MRI Cardiac Imaging",
    category: "MRI",
    level: "Advanced",
    price: "Coming Soon",
    status: "coming-soon",
    thumbnail: "/MRIpro.jpeg",
    description: "Deep dive into cardiac MRI protocols, pathologies, and advanced post-processing techniques.",
    itemType: 'course'
  }
];

const ClassesPreview: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch latest classes
    const classesQuery = query(collection(db, 'classes'), orderBy('createdAt', 'desc'), limit(4));
    const coursesQuery = query(collection(db, 'courses'), orderBy('createdAt', 'desc'), limit(4));

    let classesData: any[] = [];
    let coursesData: any[] = [];

    const unsubClasses = onSnapshot(classesQuery, (snapshot) => {
      classesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), itemType: 'class' }));
      combineAndSet();
    });

    const unsubCourses = onSnapshot(coursesQuery, (snapshot) => {
      coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), itemType: 'course' }));
      combineAndSet();
    });

    const combineAndSet = () => {
      // Sort database entries by creation time
      const databaseItems = [...classesData, ...coursesData]
        .sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

      // Maintain a set to avoid duplicate displays
      const seenIds = new Set(databaseItems.map(x => x.id));
      const allMerged = [...databaseItems];

      // Merge standard static programs
      const staticPrograms = [
        ...ACTIVE_CLASSES,
        ...COMING_SOON_CLASSES,
        ...COMING_SOON_COURSES
      ];

      staticPrograms.forEach(item => {
        if (!seenIds.has(item.id)) {
          allMerged.push(item);
          seenIds.add(item.id);
        }
      });

      // Display up to 8 of our top programs on home page
      setItems(allMerged.slice(0, 8));
      setLoading(false);
    };

    return () => {
      unsubClasses();
      unsubCourses();
    };
  }, []);

  return (
    <section id="classes" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Modalities Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-base font-bold text-brand-primary uppercase tracking-wider mb-2">Browse by Modality</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-brand-dark">Find Your Specialization</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {modalities.map((mod) => (
              <div key={mod.id} className={`${mod.bg} rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform cursor-pointer border border-transparent hover:border-gray-200 shadow-sm`}>
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-sm ${mod.color}`}>
                  <mod.icon size={24} />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">{mod.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Courses List */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <h2 className="text-base font-bold text-brand-primary uppercase tracking-wider mb-2">Our Programs</h2>
            <h3 className="text-3xl font-bold text-brand-dark">Latest Classes & Courses</h3>
          </div>
          <Link to="/classes" className="hidden md:flex items-center gap-2 text-brand-primary font-bold hover:text-brand-accent transition-colors">
            View All Programs <ChevronRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
            <h4 className="text-xl font-bold text-gray-400">No classes available for now</h4>
            <p className="text-gray-500 mt-2">Check back later for new updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.thumbnail || 'https://picsum.photos/seed/radiology/800/600'} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                    <span className="bg-brand-primary text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg">
                      {item.itemType === 'class' ? 'Live Class' : 'Course'}
                    </span>
                    {item.status === 'coming-soon' && (
                      <span className="bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg animate-pulse">
                        Soon
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-dark shadow-sm">
                    {item.category || 'General'}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-brand-accent mb-2">
                    <Star size={14} fill="currentColor" />
                    <span className="text-gray-600 text-xs font-bold">{item.rating || '4.8'}</span>
                  </div>
                  <h4 className="text-lg font-bold text-brand-dark mb-2 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                      <Clock size={14} />
                      <span>{item.duration}</span>
                    </div>
                    {item.status === 'coming-soon' ? (
                      <span className="text-amber-500 text-xs font-black uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                        Coming Soon
                      </span>
                    ) : (
                      <Link 
                        to={item.itemType === 'class' ? `/classes` : `/courses`}
                        className="text-brand-primary text-sm font-bold hover:underline"
                      >
                        Enroll Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/classes" className="px-6 py-3 border-2 border-brand-primary text-brand-primary font-bold rounded-lg hover:bg-brand-primary hover:text-white transition-colors">
            View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ClassesPreview;
