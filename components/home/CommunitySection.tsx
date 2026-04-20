
import React from 'react';
import { MessageCircle, Facebook, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CommunitySection: React.FC = () => {
  return (
    <section className="py-20 bg-brand-light relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-bold mb-6"
          >
            <Users size={16} />
            <span>Join the Movement</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-brand-dark mb-6"
          >
            Connect with Fellow <span className="text-brand-primary">Radiographers</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Don't study in isolation. Join our vibrant community to share knowledge, 
            discuss cases, and stay updated with the latest in radiography.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* WhatsApp Card */}
          <motion.a
            href="https://chat.whatsapp.com/LIV2MPAaxgfHF0NsXLzlaf" // Placeholder
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group bg-white p-8 rounded-3xl shadow-xl shadow-brand-dark/5 border border-gray-100 flex flex-col items-center text-center transition-all hover:border-green-500/30"
          >
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle size={40} fill="currentColor" className="opacity-20 absolute" />
              <MessageCircle size={40} className="relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark mb-3">WhatsApp Community</h3>
            <p className="text-gray-600 mb-8">
              Get instant updates, daily challenge reminders, and quick tips directly on your phone.
            </p>
            <div className="mt-auto flex items-center gap-2 font-bold text-green-600 group-hover:gap-4 transition-all">
              Join WhatsApp Group <ArrowRight size={18} />
            </div>
          </motion.a>

          {/* Facebook Card */}
          <motion.a
            href="https://www.facebook.com/share/1DaojaT3tc/?mibextid=wwXIfr" // Placeholder
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group bg-white p-8 rounded-3xl shadow-xl shadow-brand-dark/5 border border-gray-100 flex flex-col items-center text-center transition-all hover:border-blue-600/30"
          >
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Facebook size={40} fill="currentColor" className="opacity-20 absolute" />
              <Facebook size={40} className="relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark mb-3">Facebook Group</h3>
            <p className="text-gray-600 mb-8">
              Engage in deep discussions, share resources, and network with professionals worldwide.
            </p>
            <div className="mt-auto flex items-center gap-2 font-bold text-blue-600 group-hover:gap-4 transition-all">
              Join Facebook Group <ArrowRight size={18} />
            </div>
          </motion.a>
        </div>

        {/* Community Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 pt-10 border-t border-gray-200 flex flex-wrap justify-center gap-12 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-brand-primary">500+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-primary">12+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">States</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-primary">Daily</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Discussions</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
