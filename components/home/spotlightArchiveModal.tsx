import React, { useState } from 'react';
import { X, Calendar, Award, Sparkles, Heart, Quote, MapPin, Building2, ChevronRight, Search } from 'lucide-react';
import { SpotlightHonoree } from './spotlightData';

interface SpotlightArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  spotlights: SpotlightHonoree[];
  onSelectSpotlight: (spotlight: SpotlightHonoree) => void;
  onCheer: (id: string) => void;
  cheeredMap: Record<string, boolean>;
}

export const SpotlightArchiveModal: React.FC<SpotlightArchiveModalProps> = ({
  isOpen,
  onClose,
  spotlights,
  onSelectSpotlight,
  onCheer,
  cheeredMap
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', 'Student of the Month', 'Radiographer of the Month', 'Peer Mentor of the Month', 'Innovator of the Month'];

  const filteredSpotlights = spotlights.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-dark to-indigo-950 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2 border border-amber-400/30">
            <Sparkles size={14} className="text-amber-400" /> Hall of Fame
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Community Spotlight Archive
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
            Browse through exceptional radiography students, clinicians, and mentors celebrated across past months.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, hospital, month..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Honorees' : cat.replace(' of the Month', '')}
              </button>
            ))}
          </div>
        </div>

        {/* List of Honorees */}
        <div className="p-6 overflow-y-auto space-y-4">
          {filteredSpotlights.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Award size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-600">No spotlights match your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSpotlights.map((item) => {
                const hasCheered = !!cheeredMap[item.id];

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar: Month + Category */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                          <Calendar size={12} className="text-brand-primary" /> {item.month}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {item.category}
                        </span>
                      </div>

                      {/* Person info */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-primary/20 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900 group-hover:text-brand-primary transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs font-semibold text-slate-600">
                            {item.roleTitle}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 size={11} /> {item.institution}
                          </p>
                        </div>
                      </div>

                      {/* Achievement */}
                      <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-xl mb-3 font-normal leading-relaxed">
                        "{item.achievement}"
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => onCheer(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 ${
                          hasCheered
                            ? 'bg-rose-100 text-rose-700 font-extrabold'
                            : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                        }`}
                      >
                        <Heart size={14} className={hasCheered ? 'fill-rose-500 text-rose-500' : ''} />
                        <span>{item.cheersCount} {hasCheered ? 'Cheered!' : 'Cheer'}</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectSpotlight(item);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors"
                      >
                        View Story <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotlightArchiveModal;
