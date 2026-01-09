import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useLocation, useNavigate } = ReactRouterDOM;
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShoppingCart, 
  FaClock, 
  FaCalendarAlt, 
  FaTrash, 
  FaCreditCard, 
  FaArrowLeft,
  FaShieldAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaBolt,
  FaLayerGroup,
  FaGift,
  FaUserGraduate,
  FaWhatsapp,
  FaPlus,
  FaMinus,
  FaGem,
  FaChevronRight
} from 'react-icons/fa';
import SEO from '../../components/SEO';
import { saveTutoringEnrollment } from '../../services/tutorialService';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface CartItem {
  id: string;
  name: string;
  hours: number;
  days: number;
}

interface SubscriptionPackage {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice: number;
  features: string[];
  maxCourses: number;
}

const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  {
    id: '1m',
    name: 'Standard Month',
    duration: '1 Month',
    price: 24100,
    originalPrice: 28350,
    features: ['1 Target Course', '2 Sessions / Week', 'Daily Assignments', 'Evening Classes (6pm-10pm)'],
    maxCourses: 1
  },
  {
    id: '2m',
    name: 'Silver Term',
    duration: '2 Months',
    price: 72100,
    originalPrice: 84800,
    features: ['Max 3 Courses', '2 Sessions / Week', '1hr Per Course Limit', 'Monthly Tests', 'Evening Classes'],
    maxCourses: 3
  },
  {
    id: '3m',
    name: 'Diamond Master',
    duration: '3 Months',
    price: 124700,
    originalPrice: 146700,
    features: ['Max 5 Courses', '3 Sessions / Week', '1hr Per Course Limit', 'Weekly Tests', 'Prof. Exam Revision', 'Evening Classes'],
    maxCourses: 5
  }
];

const PRESET_COURSES = [
    "Radiation Physics", "Radiographic Anatomy", "Radiographic Technique", 
    "Care of Patients", "MRI Fundamentals", "Radiographic equipment", "Radiation Safety",
    "Gross Anatomy", "Human Physiology", "Basic Ultrasound", "Pathology"
  ];

const INSTANT_RATE = 3000;
const ADMIN_EMAIL = "wisdomwarrie11@gmail.com";

const TutoringBookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as { name?: string; level?: string; initialCourse?: string };

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: state.name || '',
    email: '',
    whatsapp: '',
    level: state.level || '200L'
  });

  const [bookingMode, setBookingMode] = useState<'instant' | 'subscription'>('instant');
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (state?.initialCourse) {
      return [{ id: 'init', name: state.initialCourse, hours: 1, days: 1 }];
    }
    return [];
  });

  const [selectedSub, setSelectedSub] = useState<SubscriptionPackage | null>(null);
  const [subCourses, setSubCourses] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [customCourse, setCustomCourse] = useState("");
  const [countdown, setCountdown] = useState({ hours: 14, mins: 22, secs: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addCourseToSub = (name: string) => {
    if (!selectedSub) return;
    if (subCourses.length >= selectedSub.maxCourses) {
        alert(`Plan limit reached: Max ${selectedSub.maxCourses} courses.`);
        return;
    }
    if (subCourses.includes(name)) return;
    setSubCourses([...subCourses, name]);
  };

  const totalPrice = useMemo(() => {
    if (bookingMode === 'subscription') return selectedSub?.price || 0;
    return cart.reduce((total, item) => total + (item.hours * item.days * INSTANT_RATE), 0);
  }, [cart, bookingMode, selectedSub]);

  const minBookingDate = useMemo(() => {
    const d = new Date();
    const daysToAdd = bookingMode === 'instant' ? 2 : 5;
    d.setDate(d.getDate() + daysToAdd);
    return d.toISOString().split('T')[0];
  }, [bookingMode]);

  const handleUpdateItem = (id: string, field: 'hours' | 'days', delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newVal = Math.max(1, (item[field] || 1) + delta);
        return { ...item, [field]: newVal };
      }
      return item;
    }));
  };

  const handlePaymentSuccess = async (response: any) => {
    setIsProcessing(true);
    const chosenCourses = bookingMode === 'subscription' ? subCourses : cart.map(c => c.name);
    
    try {
      await saveTutoringEnrollment({
        name: profile.name,
        email: profile.email,
        whatsapp: profile.whatsapp,
        level: profile.level,
        bookingType: bookingMode,
        planId: selectedSub?.id,
        courses: chosenCourses,
        totalAmount: totalPrice,
        startDate: selectedDate,
        targetAdminEmail: ADMIN_EMAIL
      });

      const message = `*NEW TUTORING ENROLLMENT*\n\n` +
        `*Ref:* ${response.reference}\n` +
        `*Name:* ${profile.name}\n` +
        `*Email:* ${profile.email}\n` +
        `*WhatsApp:* ${profile.whatsapp}\n` +
        `*Plan:* ${bookingMode === 'subscription' ? selectedSub?.name : 'Instant'}\n` +
        `*Courses:* ${chosenCourses.join(', ')}\n` +
        `*Start Date:* ${selectedDate}\n\n` +
        `Data forwarded to ${ADMIN_EMAIL}. Ready for scheduling.`;
      
      window.open(`https://wa.me/2347041197027?text=${encodeURIComponent(message)}`, "_blank");
      navigate('/classes');
    } catch (err) {
      console.error(err);
      alert("Payment successful but there was an error saving your data. Please contact support via WhatsApp with your reference: " + response.reference);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!selectedDate) {
      alert("Please select your preferred start date.");
      return;
    }
    if (!profile.email || !profile.whatsapp) {
      alert("Missing contact information.");
      setStep(1);
      return;
    }
    if (bookingMode === 'instant' && cart.length === 0) {
      alert("Please add at least one course.");
      return;
    }
    if (bookingMode === 'subscription' && (!selectedSub || subCourses.length === 0)) {
      alert("Please complete your plan configuration.");
      return;
    }

    if (!window.PaystackPop) {
      alert("Payment gateway not loaded. Check connection.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: 'pk_live_a35b5eef4a79e10f6f06b9f1a7a56a7424ccfbc6', 
      email: profile.email,
      amount: Math.round(totalPrice * 100),
      currency: 'NGN',
      callback: function(response: any) {
        handlePaymentSuccess(response);
      },
      onClose: function() {
        alert('Payment window closed. Progress saved.');
      }
    });
    handler.openIframe();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <SEO title="Tutoring Booking" description="Enroll in specialized evening classes for radiography." />
      
      <div className="bg-brand-dark text-white py-3 px-4 sticky top-0 z-[60] shadow-xl border-b border-white/5">
        <div className="container mx-auto flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="flex items-center gap-2 text-amber-400 font-black">
            <FaGift size={18} className="animate-bounce" />
            <span className="uppercase tracking-tight text-xs md:text-sm">15% Discount Applied!</span>
          </div>
          <div className="flex items-center gap-4 font-mono bg-white/10 px-5 py-1.5 rounded-2xl border border-white/10">
             <div className="text-center"><span className="text-xl font-black">{countdown.hours.toString().padStart(2,'0')}</span><span className="text-[9px] block opacity-50 font-sans uppercase">Hrs</span></div>
             <span className="opacity-20">:</span>
             <div className="text-center"><span className="text-xl font-black">{countdown.mins.toString().padStart(2,'0')}</span><span className="text-[9px] block opacity-50 font-sans uppercase">Min</span></div>
             <span className="opacity-20">:</span>
             <div className="text-center"><span className="text-xl font-black">{countdown.secs.toString().padStart(2,'0')}</span><span className="text-[9px] block opacity-50 font-sans uppercase">Sec</span></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-10">
        <button onClick={() => navigate('/classes')} className="mb-10 flex items-center text-slate-500 hover:text-indigo-600 font-black transition-all">
          <FaArrowLeft className="mr-2" /> Back to Academy
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow space-y-12">
            
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100"
                >
                  <div className="mb-10">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-2">
                       <FaUserGraduate className="text-indigo-600" /> Student Profile
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text" value={profile.name} 
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Level</label>
                      <select 
                        value={profile.level} 
                        onChange={e => setProfile({...profile, level: e.target.value})}
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold bg-white"
                      >
                        <option>200L</option><option>300L</option><option>400L</option><option>500L</option>
                        <option>Post Graduate</option><option>Professional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" value={profile.email} 
                        onChange={e => setProfile({...profile, email: e.target.value})}
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold"
                        placeholder="example@mail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">WhatsApp Number</label>
                      <div className="relative">
                        <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input 
                          type="tel" value={profile.whatsapp} 
                          onChange={e => setProfile({...profile, whatsapp: e.target.value})}
                          className="w-full p-4 pl-10 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold"
                          placeholder="08012345678"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={!profile.name || !profile.email || !profile.whatsapp}
                    onClick={() => setStep(2)}
                    className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black hover:bg-slate-800 disabled:opacity-30 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    Continue <FaChevronRight />
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                    <div className="flex bg-white p-2 rounded-3xl shadow-sm border border-slate-200 max-w-xl mx-auto ring-1 ring-slate-100">
                        <button 
                            onClick={() => { setBookingMode('instant'); setSubCourses([]); }}
                            className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${bookingMode === 'instant' ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <FaBolt className={bookingMode === 'instant' ? 'text-amber-400' : ''} /> Instant Help
                        </button>
                        <button 
                            onClick={() => { setBookingMode('subscription'); setCart([]); }}
                            className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${bookingMode === 'subscription' ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <FaLayerGroup className={bookingMode === 'subscription' ? 'text-indigo-400' : ''} /> Monthly Plans
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                    {bookingMode === 'subscription' ? (
                        <motion.div key="sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {SUBSCRIPTION_PACKAGES.map(pkg => (
                                <button
                                    key={pkg.id}
                                    onClick={() => { setSelectedSub(pkg); setSubCourses([]); }}
                                    className={`relative flex flex-col p-8 rounded-[2.5rem] border-4 transition-all text-left group ${selectedSub?.id === pkg.id ? 'bg-white border-indigo-600 shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
                                >
                                {selectedSub?.id === pkg.id && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Active</div>
                                )}
                                <h4 className="text-xl font-black text-slate-900 mb-1">{pkg.name}</h4>
                                <div className="text-slate-400 text-[10px] font-black mb-6 uppercase tracking-widest">{pkg.duration}</div>
                                
                                <div className="mb-8">
                                    <div className="text-slate-400 text-sm line-through font-bold">₦{pkg.originalPrice.toLocaleString()}</div>
                                    <div className="text-3xl font-black text-slate-900 tracking-tighter">₦{pkg.price.toLocaleString()}</div>
                                </div>

                                <ul className="space-y-4 mb-8 flex-grow">
                                    {pkg.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[11px] font-bold text-slate-600 leading-tight">
                                        <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                    ))}
                                </ul>
                                <div className={`w-full py-3 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest transition-all ${selectedSub?.id === pkg.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-50'}`}>Select</div>
                                </button>
                            ))}
                            </div>

                            {selectedSub && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                                    <div className="mb-8">
                                        <h3 className="text-xl font-black text-slate-900">Choose Courses ({subCourses.length}/{selectedSub.maxCourses})</h3>
                                        <p className="text-slate-500 text-xs">Pick included courses for your plan.</p>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                                        {PRESET_COURSES.map(course => (
                                            <button
                                                key={course}
                                                onClick={() => addCourseToSub(course)}
                                                disabled={subCourses.includes(course)}
                                                className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${subCourses.includes(course) ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-300'}`}
                                            >
                                                {course}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <input 
                                            type="text" placeholder="Custom course..."
                                            value={customCourse} onChange={e => setCustomCourse(e.target.value)}
                                            className="flex-grow p-4 bg-slate-50 rounded-2xl border-none font-bold"
                                        />
                                        <button onClick={() => { if(customCourse.trim()) { addCourseToSub(customCourse.trim()); setCustomCourse(""); } }} className="bg-slate-900 text-white px-8 rounded-2xl font-black">Add</button>
                                    </div>
                                    <div className="mt-8 flex flex-wrap gap-2">
                                        {subCourses.map(course => (
                                            <span key={course} className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                                                {course} <FaTrash className="cursor-pointer" size={10} onClick={() => setSubCourses(subCourses.filter(c => c !== course))} />
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            
                            <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-amber-500/20">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                                <div className="relative z-10 text-center md:text-left">
                                    <div className="flex items-center gap-2 text-amber-400 font-black mb-2 uppercase tracking-widest text-[10px]">
                                        <FaGem size={14} /> Custom Tier
                                    </div>
                                    <h4 className="text-2xl font-black mb-2">Need More Than 5 Courses?</h4>
                                    <p className="text-slate-400 text-sm max-w-lg leading-relaxed">For students needing specialized modality mastery or custom research support.</p>
                                </div>
                                <button onClick={() => window.open(`https://wa.me/2347041197027?text=${encodeURIComponent("Hello StudiRad, I'm interested in the Diamond Custom Package.")}`, '_blank')} className="relative z-10 bg-amber-500 text-slate-950 px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl hover:scale-105 transition-all">Talk to Lead</button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="instant" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                            <div className="mb-10">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-2">
                                <FaBolt className="text-amber-500" /> Instant Clarity (₦3,000 / hr)
                            </h3>
                            <p className="text-slate-500 text-sm">One-off sessions for specific topic mastery.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                            {PRESET_COURSES.map(course => (
                                <button
                                key={course}
                                onClick={() => { if(!cart.some(i => i.name === course)) setCart([...cart, { id: Math.random().toString(36), name: course, hours: 1, days: 1 }]) }}
                                className={`text-left px-5 py-4 rounded-2xl border-2 transition-all font-bold text-xs ${cart.some(i => i.name === course) ? 'bg-slate-50 border-slate-200 text-slate-300' : 'bg-white border-slate-100 text-slate-600 hover:border-amber-400'}`}
                                >
                                {course}
                                </button>
                            ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {cart.map(item => (
                            <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 border-l-8 border-l-amber-400">
                                <div className="flex-grow">
                                <h4 className="font-black text-xl text-slate-900 mb-1">{item.name}</h4>
                                <p className="text-amber-600 font-black text-lg">₦3,000 / hr</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-6 md:gap-8">
                                    {/* Hours Counter */}
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">Hrs / session</span>
                                        <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1">
                                            <button onClick={() => handleUpdateItem(item.id, 'hours', -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-600 hover:text-amber-600 shadow-sm"><FaMinus size={10} /></button>
                                            <span className="w-10 text-center font-black text-slate-900">{item.hours}</span>
                                            <button onClick={() => handleUpdateItem(item.id, 'hours', 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-600 hover:text-amber-600 shadow-sm"><FaPlus size={10} /></button>
                                        </div>
                                    </div>
                                    {/* Days Counter */}
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">Total days</span>
                                        <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1">
                                            <button onClick={() => handleUpdateItem(item.id, 'days', -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-600 hover:text-amber-600 shadow-sm"><FaMinus size={10} /></button>
                                            <span className="w-10 text-center font-black text-slate-900">{item.days}</span>
                                            <button onClick={() => handleUpdateItem(item.id, 'days', 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-600 hover:text-amber-600 shadow-sm"><FaPlus size={10} /></button>
                                        </div>
                                    </div>
                                    <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="p-3 md:p-5 text-rose-400 hover:bg-rose-50 rounded-2xl transition-all self-end md:self-center"><FaTrash /></button>
                                </div>
                            </motion.div>
                            ))}
                        </div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                            <FaCalendarAlt className="text-indigo-600 shrink-0" size={24} /> <span>Start Date</span>
                        </h3>
                        <div className="bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider hidden sm:block">
                            {bookingMode === 'instant' ? '48hr Prep' : '120hr Prep'}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="relative group">
                            <input 
                                type="date" 
                                min={minBookingDate}
                                className="w-full p-6 rounded-[2rem] border-2 border-slate-100 focus:border-indigo-600 focus:ring-0 font-black text-xl transition-all outline-none bg-slate-50 shadow-inner appearance-none"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                            />
                            {/* Visual Hint for Mobile since appearance-none might hide native icon on some OS */}
                            {!selectedDate && <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300"><FaCalendarAlt /></div>}
                        </div>
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 flex items-start gap-5 border border-slate-100">
                            <FaInfoCircle className="text-indigo-600 mt-1 shrink-0" size={20} />
                            <div>
                                <p className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">Schedule</p>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">Classes are held between <strong>6:00 PM and 10:00 PM (GMT+1)</strong>.</p>
                            </div>
                        </div>
                    </div>
                    </div>

                    {/* Mobile Summary & Action Bar (Inline) */}
                    <div className="lg:hidden mt-8 space-y-6">
                        <div className="bg-slate-900 text-white rounded-[3rem] p-8 shadow-xl border border-white/5 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="text-lg font-black mb-6 flex items-center gap-3 relative z-10 text-amber-400">
                                <FaShoppingCart size={18} /> Enrollment Summary
                            </h3>
                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <span>Selected Plan</span>
                                    <span className="text-white">{bookingMode === 'instant' ? 'Instant Clarity' : selectedSub?.name || 'Not Selected'}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <span>Courses</span>
                                    <span className="text-white">{(bookingMode === 'subscription' ? subCourses.length : cart.length) || 0} items</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Payable</p>
                                    <p className="text-4xl font-black text-white tracking-tighter">₦{totalPrice.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <button
                                disabled={totalPrice === 0 || !selectedDate || isProcessing}
                                onClick={handlePayment}
                                className="w-full bg-gradient-to-r from-amber-400 to-orange-600 text-slate-950 py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                            >
                                {isProcessing ? (
                                    <><FaPlus className="animate-spin" /> Processing...</>
                                ) : (
                                    <><FaCreditCard /> Pay with Paystack</>
                                )}
                            </button>

                            <div className="mt-6 pt-6 border-t border-white/5 flex gap-4 items-center">
                                <FaShieldAlt className="text-emerald-400 shrink-0" size={20} />
                                <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight">
                                    Your enrollment data is encrypted and saved securely.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step === 2 && (
            <aside className="lg:w-[420px] hidden lg:block">
                <div className="bg-slate-900 text-white rounded-[3.5rem] p-10 shadow-2xl sticky top-28 border border-white/5 overflow-hidden">
                    <h3 className="text-2xl font-black mb-10 flex items-center gap-5 relative z-10 text-amber-400">
                        <FaShoppingCart /> Checkout
                    </h3>
                    <div className="space-y-6 mb-12 relative z-10">
                        <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <span>Plan</span>
                            <span className="text-white">{bookingMode === 'instant' ? 'Instant Help' : selectedSub?.name || '---'}</span>
                        </div>
                        <div className="h-px bg-white/10 my-4"></div>
                        <div>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-2">Total Payable</p>
                            <p className="text-6xl font-black text-white tracking-tighter">₦{totalPrice.toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <button
                        disabled={totalPrice === 0 || !selectedDate || isProcessing}
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 text-slate-950 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-[1.03] transition-all disabled:opacity-30 flex items-center justify-center gap-4"
                    >
                        {isProcessing ? <><FaPlus className="animate-spin" /> Processing...</> : <><FaCreditCard size={22} /> Pay with Paystack</>}
                    </button>
                    
                    <div className="mt-8 bg-white/5 rounded-3xl p-6 flex gap-5 items-start border border-white/5">
                        <FaShieldAlt className="text-emerald-400 mt-1" />
                        <div>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight mb-2">
                                Secure Enrollment
                            </p>
                            <p className="text-[9px] text-slate-500 italic">Confirmation will be sent to your WhatsApp and {ADMIN_EMAIL}.</p>
                        </div>
                    </div>
                </div>
            </aside>
          )}

        </div>
      </div>
    </div>
  );
};

export default TutoringBookingPage;