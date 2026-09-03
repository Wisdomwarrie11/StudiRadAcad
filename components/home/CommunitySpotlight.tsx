import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Award, 
  Heart, 
  Quote, 
  MapPin, 
  Building2, 
  ChevronRight, 
  ChevronLeft,
  Calendar, 
  Share2, 
  Check, 
  Archive,
  Flame,
  CheckCircle2,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_SPOTLIGHTS, SpotlightHonoree } from './spotlightData';
import { NominateSpotlightModal } from './NominateSpotlight';
import { SpotlightArchiveModal } from './spotlightArchiveModal';

const MotionDiv = motion.div as any;

export const CommunitySpotlight: React.FC = () => {
  const [spotlights, setSpotlights] = useState<SpotlightHonoree[]>(DEFAULT_SPOTLIGHTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [cheeredMap, setCheeredMap] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [cheerParticle, setCheerParticle] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Load cheers from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('studirad_spotlight_cheers');
      if (stored) {
        setCheeredMap(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read cheered storage', e);
    }
  }, []);

  const activeHonoree = spotlights[currentIndex] || spotlights[0] || DEFAULT_SPOTLIGHTS[0];

  const handleCheer = (id: string) => {
    const isAlreadyCheered = !!cheeredMap[id];
    const newCheered = !isAlreadyCheered;
    const diff = newCheered ? 1 : -1;

    // Update local map in state and localStorage
    const updatedMap = { ...cheeredMap, [id]: newCheered };
    setCheeredMap(updatedMap);
    try {
      localStorage.setItem('studirad_spotlight_cheers', JSON.stringify(updatedMap));
    } catch (e) {
      console.warn(e);
    }

    // Trigger visual confetti particle
    if (newCheered) {
      setCheerParticle(true);
      setTimeout(() => setCheerParticle(false), 1200);
    }

    // Update state
    setSpotlights((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cheersCount: Math.max(0, (item.cheersCount || 0) + diff) }
          : item
      )
    );
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const nextSpotlight = () => {
    setImageError(false);
    setCurrentIndex((prev) => (prev + 1) % spotlights.length);
  };

  const prevSpotlight = () => {
    setImageError(false);
    setCurrentIndex((prev) => (prev - 1 + spotlights.length) % spotlights.length);
  };

  const selectSpotlightByItem = (item: SpotlightHonoree) => {
    setImageError(false);
    const idx = spotlights.findIndex((s) => s.id === item.id);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  };

  return (
    <section id="community-spotlight" className="py-20 bg-gradient-to-b from-slate-900 via-brand-dark to-slate-950 text-white relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header Title Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-black uppercase tracking-widest mb-3">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>Monthly Community Spotlight</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Celebrating Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">Radiography Stars</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-2 font-light leading-relaxed">
              Every month, we shine a spotlight on students, clinical radiographers, and mentors making remarkable strides in education and healthcare.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsArchiveModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-bold transition-colors"
            >
              <Archive size={15} className="text-amber-400" />
              <span>Spotlight Archive</span>
            </button>

            <button
              onClick={() => setIsNominateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 active:scale-95"
            >
              <Award size={15} />
              <span>Nominate a Peer</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO SPOTLIGHT SHOWCASE CARD */}
        {/* ========================================================================= */}
        <AnimatePresence mode="wait">
          <MotionDiv
            key={activeHonoree.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl relative"
          >
            {/* Top Bar inside Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
                  <Calendar size={13} /> {activeHonoree.month}
                </span>
                <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                  {activeHonoree.category}
                </span>
              </div>

              {/* Navigation pagination arrows */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold mr-2">
                  {currentIndex + 1} of {spotlights.length}
                </span>
                <button
                  onClick={prevSpotlight}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Previous spotlight"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextSpotlight}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Next spotlight"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Image & Badges (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden ring-4 ring-amber-400/30 shadow-2xl bg-slate-800 flex items-center justify-center">
                  {!imageError && activeHonoree.image ? (
                    <img
                      src={activeHonoree.image}
                      alt={activeHonoree.name}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-800 text-white p-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl mb-2 shadow-lg">
                        {activeHonoree.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-amber-300">StudiRad Star</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating category emblem */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/15 text-[11px] font-bold text-amber-300">
                    <Flame size={14} className="text-amber-400" />
                    <span>Featured Honoree</span>
                  </div>
                </div>

                {/* Badges list */}
                <div className="flex flex-wrap gap-2 mt-5 justify-center lg:justify-start max-w-sm">
                  {activeHonoree.badges?.map((badge, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/10 text-slate-200 px-3 py-1 rounded-full border border-white/10"
                    >
                      <CheckCircle2 size={12} className="text-emerald-400" /> {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Honoree Bio & Achievements (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {activeHonoree.name}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-amber-400 mt-1">
                    {activeHonoree.roleTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 mt-1.5 font-medium">
                    <Building2 size={14} className="text-indigo-400 shrink-0" />
                    <span>{activeHonoree.institution}</span>
                    <span className="text-slate-600">•</span>
                    <MapPin size={14} className="text-emerald-400 shrink-0" />
                    <span>{activeHonoree.location}</span>
                  </p>
                </div>

                {/* Key Achievement Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-slate-100">
                  <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                    <Award size={14} /> Key Achievement
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {activeHonoree.achievement}
                  </p>
                </div>

                {/* Story narrative */}
                <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-2 font-light">
                  <p>{activeHonoree.story}</p>
                </div>

                {/* Honoree Quote */}
                {activeHonoree.quote && (
                  <div className="relative pl-5 py-1 border-l-2 border-amber-400/80 text-xs sm:text-sm text-amber-200 italic font-medium leading-relaxed">
                    <Quote size={18} className="text-amber-400/40 absolute -left-2.5 -top-2" />
                    "{activeHonoree.quote}"
                  </div>
                )}

                {/* Footer Controls: Cheers & Share */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  {/* Cheer Button */}
                  <div className="relative">
                    <button
                      onClick={() => handleCheer(activeHonoree.id)}
                      className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
                        cheeredMap[activeHonoree.id]
                          ? 'bg-rose-600 text-white shadow-rose-600/30'
                          : 'bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-white border border-white/20'
                      }`}
                    >
                      <Heart 
                        size={18} 
                        className={cheeredMap[activeHonoree.id] ? 'fill-white text-white animate-bounce' : 'text-rose-400'} 
                      />
                      <span>
                        {cheeredMap[activeHonoree.id] ? 'Celebrated!' : 'Cheer Honoree'} ({activeHonoree.cheersCount || 0})
                      </span>
                    </button>

                    {/* Celebration particle indicator */}
                    {cheerParticle && (
                      <span className="absolute -top-6 left-8 text-sm font-black text-amber-300 animate-bounce">
                        +1 🎉 Kudos!
                      </span>
                    )}
                  </div>

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors border border-white/10"
                  >
                    {copiedLink ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={14} />
                        <span>Share Spotlight</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </MotionDiv>
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* CAROUSEL SWITCHER / QUICK THUMBNAILS */}
        {/* ========================================================================= */}
        {spotlights.length > 1 && (
          <div className="mt-8 pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Explore More Honorees
              </span>
              <span className="text-xs text-slate-400">
                Click any profile to view full story
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {spotlights.map((item, idx) => {
                const isActive = idx === currentIndex;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setImageError(false);
                      setCurrentIndex(idx);
                    }}
                    className={`p-3 sm:p-4 rounded-2xl text-left transition-all flex items-center gap-3 border ${
                      isActive
                        ? 'bg-white/15 border-amber-400/80 shadow-lg scale-[1.02]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover ring-2 ${
                        isActive ? 'ring-amber-400' : 'ring-white/20'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-black text-amber-400 uppercase truncate">
                        {item.category.replace(' of the Month', '')}
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.institution}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <NominateSpotlightModal
        isOpen={isNominateModalOpen}
        onClose={() => setIsNominateModalOpen(false)}
      />

      <SpotlightArchiveModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        spotlights={spotlights}
        onSelectSpotlight={selectSpotlightByItem}
        onCheer={handleCheer}
        cheeredMap={cheeredMap}
      />
    </section>
  );
};

export default CommunitySpotlight;
