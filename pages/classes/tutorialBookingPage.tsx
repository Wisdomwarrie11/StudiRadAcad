import React, { useState, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useLocation, useNavigate } = ReactRouterDOM;
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShoppingCart, 
  FaClock, 
  FaCalendarAlt, 
  FaPlus, 
  FaTrash, 
  FaCreditCard, 
  FaArrowLeft,
  FaShieldAlt,
  FaInfoCircle,
  FaCheckCircle
} from 'react-icons/fa';
import SEO from '../../components/SEO';

interface CartItem {
  id: string;
  name: string;
  hours: number;
  days: number;
}

const PRESET_COURSES = [
  "Radiation Physics",
  "Radiographic Anatomy",
  "General Physiology",
  "Radiographic Positioning",
  "Pathology",
  "CT Imaging Protocols",
  "MRI Fundamentals",
  "Obstetrics Ultrasound",
  "Radiation Safety",
  "Darkroom Chemistry"
];

const PRICE_PER_HOUR = 5000;

const TutoringBookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safe state access with fallback to prevent errors on direct navigation or refresh
  const state = (location.state || {}) as { name?: string; level?: string; initialCourse?: string };

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (state?.initialCourse) {
      return [{ id: 'init', name: state.initialCourse, hours: 1, days: 1 }];
    }
    return [];
  });

  const [customCourse, setCustomCourse] = useState("");

  const userTier = useMemo(() => {
    const level = state?.level || "200L";
    if (["200L", "300L"].includes(level)) return { name: "Silver Package", color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" };
    if (["400L", "500L"].includes(level)) return { name: "Gold Package", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" };
    return { name: "Diamond Package", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" };
  }, [state?.level]);

  const addToCart = (name: string) => {
    if (cart.some(item => item.name === name)) return;
    setCart([...cart, { id: Math.random().toString(36), name, hours: 1, days: 1 }]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: 'hours' | 'days', value: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, [field]: Math.max(1, value) } : item));
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + (item.hours * item.days * PRICE_PER_HOUR), 0);
  }, [cart]);

  const handleCheckout = () => {
    const message = `*Tutoring Session Confirmation*\n\nName: ${state?.name || 'Guest'}\nAcademic Tier: ${userTier.name}\n\n*Study Plan:* \n${cart.map(i => `- ${i.name}: ${i.hours}hrs/session for ${i.days} days`).join('\n')}\n\n*Total Estimated:* ₦${totalPrice.toLocaleString()}\n\nI would like to proceed with the scheduling.`;
    window.open(`https://wa.me/2347041197027?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans">
      <SEO title="Tutoring Booking" description="Customize your radiography 1-on-1 tutoring schedule." />
      
      <div className="container mx-auto px-4 max-w-6xl">
        <button 
          onClick={() => navigate('/classes')}
          className="mb-8 flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Academy
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-grow space-y-10">
            <header className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Portal</h1>
                <p className="text-slate-500 mt-1">Hello, <span className="font-bold text-slate-800">{state?.name || 'Scholar'}</span>. Your custom plan starts here.</p>
              </div>
              <div className={`${userTier.bg} ${userTier.border} border rounded-2xl px-6 py-4 text-center min-w-[160px]`}>
                 <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block mb-1">Your Tier</span>
                 <span className={`text-xl font-black ${userTier.color}`}>{userTier.name}</span>
              </div>
            </header>

            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <FaPlus className="text-indigo-500 text-sm" /> Add Target Courses
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                {PRESET_COURSES.map(course => {
                  const active = cart.some(i => i.name === course);
                  return (
                    <button
                      key={course}
                      onClick={() => addToCart(course)}
                      disabled={active}
                      className={`text-left px-5 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                        active 
                        ? 'bg-slate-50 border-slate-100 text-slate-300' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:shadow-lg'
                      }`}
                    >
                      {course}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="Enter other specific course or topic..."
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  className="flex-grow rounded-2xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 p-4 font-medium"
                />
                <button
                  onClick={() => {
                    if (customCourse.trim()) {
                      addToCart(customCourse.trim());
                      setCustomCourse("");
                    }
                  }}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg"
                >
                  Add Custom
                </button>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 px-4">Customized Schedule</h3>
              <AnimatePresence mode='popLayout'>
                {cart.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center text-slate-400 font-bold"
                  >
                    No courses selected yet. Select a course above to build your plan.
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-8 group"
                    >
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-black text-xl text-slate-900">{item.name}</h4>
                           <FaCheckCircle className="text-emerald-500" />
                        </div>
                        <p className="text-indigo-600 font-black text-lg">₦{(item.hours * item.days * PRICE_PER_HOUR).toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 tracking-widest">
                            <FaClock className="text-slate-300" /> Hours / Session
                          </label>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.hours}
                            onChange={(e) => updateItem(item.id, 'hours', parseInt(e.target.value))}
                            className="w-24 rounded-xl border-slate-200 font-black p-3 text-center bg-slate-50"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 tracking-widest">
                            <FaCalendarAlt className="text-slate-300" /> Total Days
                          </label>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.days}
                            onChange={(e) => updateItem(item.id, 'days', parseInt(e.target.value))}
                            className="w-24 rounded-xl border-slate-200 font-black p-3 text-center bg-slate-50"
                          />
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-4 text-rose-400 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </section>
          </div>

          <aside className="lg:w-[380px]">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl sticky top-28 border border-white/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <h3 className="text-2xl font-black mb-10 flex items-center gap-4 relative z-10">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <FaShoppingCart className="text-amber-400" />
                </div>
                Booking Summary
              </h3>

              <div className="space-y-6 mb-12 relative z-10">
                <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-wider">
                  <span>Standard Rate</span>
                  <span className="text-white">₦5,000 / hr</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-wider">
                  <span>Selected Tier</span>
                  <span className={userTier.color}>{userTier.name}</span>
                </div>
                <div className="h-px bg-white/10 my-4"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Amount</p>
                    <p className="text-5xl font-black text-white tracking-tighter">₦{totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 relative z-10">
                <button
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 py-5 rounded-3xl font-black text-xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  <FaCreditCard /> Finalize Schedule
                </button>
                
                <div className="bg-white/5 rounded-2xl p-6 flex gap-4 items-start border border-white/5">
                  <FaShieldAlt className="text-emerald-400 mt-1 shrink-0" />
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    This request initiates enrollment. Our academic coordinator will verify your plan on WhatsApp before confirming the schedule.
                  </p>
                </div>
              </div>

              <div className="mt-10 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex gap-4 relative z-10">
                 <FaInfoCircle className="text-indigo-400 mt-1 shrink-0" size={18} />
                 <p className="text-[11px] text-slate-300 italic leading-relaxed">
                   Higher tiers include specialized past question banks and research methodology mentorship sessions.
                 </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default TutoringBookingPage;