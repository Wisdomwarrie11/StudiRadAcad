import React from 'react';
import { MessageCircleQuestion } from 'lucide-react';

const FloatingCTA: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button className="bg-brand-accent text-brand-dark p-4 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all group relative">
        <MessageCircleQuestion size={28} />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-brand-dark text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Need Help?
        </span>
      </button>
    </div>
  );
};

export default FloatingCTA;