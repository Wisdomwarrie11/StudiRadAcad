
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { MessageCircle, Users, ArrowRight, Compass, PlusCircle, Sparkles } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { getApprovedGroups, CommunityGroup } from '../../services/CommunityGroups';

// const CommunitySection: React.FC = () => {
//   const [groups, setGroups] = useState<CommunityGroup[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;
//     getApprovedGroups()
//       .then((data) => {
//         if (isMounted) {
//           setGroups(data);
//           setLoading(false);
//         }
//       })
//       .catch(() => {
//         if (isMounted) setLoading(false);
//       });
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const totalJoins = groups.reduce((acc, g) => acc + (g.joinsCount || 0), 0);

//   return (
//     <section className="py-20 bg-brand-light relative overflow-hidden">
//       {/* Decorative background elements */}
//       <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
//       <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />

//       <div className="container mx-auto px-4 relative z-10">
//         <div className="max-w-4xl mx-auto text-center mb-16">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-bold mb-6"
//           >
//             <Users size={16} />
//             <span>Community Hub</span>
//           </motion.div>
          
//           <motion.h2 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="text-4xl md:text-5xl font-bold text-brand-dark mb-6"
//           >
//             Connect with Fellow <span className="text-brand-primary">Radiographers</span>
//           </motion.h2>
          
//           <motion.p 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="text-xl text-gray-600"
//           >
//             Don't study or practice in isolation. Join peer-led study groups, licensing exam circles, research teams, and locum alerts.
//           </motion.p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
//           {/* Official WhatsApp Community Card */}
//           <motion.a
//             href="https://chat.whatsapp.com/IUdVHb0WusrJoi8qHY1biS"
//             target="_blank"
//             rel="noopener noreferrer"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             whileHover={{ y: -5 }}
//             className="group bg-white p-8 rounded-3xl shadow-xl shadow-brand-dark/5 border border-emerald-100 flex flex-col items-center text-center transition-all hover:border-emerald-500/40 relative overflow-hidden"
//           >
//             <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
//               Verified
//             </div>
//             <div className="w-18 h-18 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//               <MessageCircle size={36} className="relative z-10" />
//             </div>
//             <h3 className="text-xl font-bold text-brand-dark mb-3">Official Discussion Group</h3>
//             <p className="text-gray-600 text-sm mb-8 leading-relaxed">
//               Join our primary WhatsApp group for instant case reviews, exam tips, tutor updates, and global community networking.
//             </p>
//             <div className="mt-auto inline-flex items-center gap-2 font-bold text-emerald-600 hover:text-emerald-700 group-hover:gap-3 transition-all text-sm">
//               <span>Join WhatsApp Group</span> <ArrowRight size={16} />
//             </div>
//           </motion.a>

//           {/* Explore Community Groups Card */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             whileHover={{ y: -5 }}
//             className="group bg-white p-8 rounded-3xl shadow-xl shadow-brand-dark/5 border border-gray-100 flex flex-col items-center text-center transition-all hover:border-[#002147]/30"
//           >
//             <div className="w-18 h-18 bg-blue-50 text-[#002147] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//               <Compass size={36} className="relative z-10" />
//             </div>
//             <h3 className="text-xl font-bold text-brand-dark mb-3">Browse Groups</h3>
//             <p className="text-gray-600 text-sm mb-8 leading-relaxed">
//               Explore verified groups across Research, Licensing Exams, Scholarships, Jobs, Internships, Outreach, and Networking.
//             </p>
//             <Link 
//               to="/community"
//               className="mt-auto inline-flex items-center gap-2 font-bold text-[#002147] hover:text-[#001733] group-hover:gap-3 transition-all text-sm"
//             >
//               <span>Explore Directory</span> <ArrowRight size={16} />
//             </Link>
//           </motion.div>

//           {/* Create a Community Group Card */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             whileHover={{ y: -5 }}
//             className="group bg-white p-8 rounded-3xl shadow-xl shadow-brand-dark/5 border border-gray-100 flex flex-col items-center text-center transition-all hover:border-amber-500/30"
//           >
//             <div className="w-18 h-18 bg-amber-50 text-[#f59e0b] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//               <PlusCircle size={36} className="relative z-10" />
//             </div>
//             <h3 className="text-xl font-bold text-brand-dark mb-3">Create Your Own Group</h3>
//             <p className="text-gray-600 text-sm mb-8 leading-relaxed">
//               Start and administer a WhatsApp, Telegram, or Slack group for your school, hospital, or study team.
//             </p>
//             <Link 
//               to="/community"
//               className="mt-auto inline-flex items-center gap-2 font-bold text-amber-600 hover:text-amber-700 group-hover:gap-3 transition-all text-sm"
//             >
//               <span>Start a Group</span> <ArrowRight size={16} />
//             </Link>
//           </motion.div>
//         </div>

//         {/* Directory Callout */}
//         <div className="mt-12 text-center">
//           <Link
//             to="/community"
//             className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#002147] hover:bg-[#001733] text-white font-bold text-sm shadow-md transition-all hover:gap-3.5"
//           >
//             <Compass size={18} className="text-[#f59e0b]" />
//             <span>Open Radiography Community Hub</span>
//             <ArrowRight size={16} />
//           </Link>
//         </div>

//         {/* Live Synchronized Stats from Firebase */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mt-20 pt-10 border-t border-gray-200 flex flex-wrap justify-center gap-12 text-center"
//         >
//           <div>
//             <div className="text-3xl font-bold text-brand-primary">
//               {loading ? '...' : groups.length}
//             </div>
//             <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Active Groups</div>
//           </div>
//           <div>
//             <div className="text-3xl font-bold text-brand-primary">7</div>
//             <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Categories</div>
//           </div>
//           <div>
//             <div className="text-3xl font-bold text-brand-primary">
//               {loading ? '...' : totalJoins}
//             </div>
//             <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Community Joins</div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default CommunitySection;
