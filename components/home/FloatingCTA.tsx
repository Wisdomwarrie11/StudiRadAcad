import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const whatsappNumber = "2348166780303";
  const message = encodeURIComponent("Hello StudiRad! I'd like to learn more about your services.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <a 
            href={whatsappUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all font-black uppercase tracking-wider text-sm group"
          >
            <div className="relative">
              <MessageCircle size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>
            </div>
            <span>Chat with Us</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
