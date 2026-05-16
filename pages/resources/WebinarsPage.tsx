
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Play, 
  History, 
  AlertCircle, 
  Loader2,
  Bell,
  ArrowRight,
  Flame,
  Timer
} from 'lucide-react';
import SEO from '../../components/SEO';
import { getEvents, EventData } from '../../services/eventService';
import OrientationRegistrationModal from "../../components/orientation/OrientationRegistrationModal";

const WebinarsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [archiveEvents, setArchiveEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrientationModal, setShowOrientationModal] = useState(false);

  const legacyWebinars: Partial<EventData>[] = [
    {
      id: "legacy-1",
      title: "Inside Radiography: Stepping into MRI - The roles. The reality. The rewards",
      date: "17th February 2026",
      description: "An astute professional shares his journey from Nigeria to becoming a clinical leader in MRI in a well-known hospital in England. In this webinar, he shares roadmaps and advice for young radiographers and students",
      imageUrl: "/Episode 2.jpg",
      link: "#",
      status: 'past',
      type: 'webinar'
    },
    {
      id: "legacy-2",
      title: "Welcome to Radiography Orientation",
      date: "Past Event",
      description: "An exclusive orientation for new-year radiography students and prospects. Get the roadmap to a successful radiography career and connect with mentors.",
      imageUrl: "/WelcomeToRad.jpeg",
      link: "#",
      status: 'past',
      type: 'webinar'
    },
    {
      id: "legacy-3",
      title: "Inside Radiography: The NeuroImaging Experience",
      date: "Past Event",
      description: "An educating session introducing Radiographers to neuroimaging and its role in modern medical Imaging and diagnosis.",
      imageUrl: "/Episode 1.jpg",
      link: "#",
      status: 'past',
      type: 'webinar'
    },
    {
      id: "legacy-4",
      title: "From Induction to Impact: Navigating the Journey",
      date: "Past Event",
      description: "Four keynote speakers share insights on thriving during your induction period and navigating your long-term career path.",
      imageUrl: "/StudiRad.jpg",
      link: "#",
      status: 'past',
      type: 'webinar'
    }
  ];

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      const upcoming = await getEvents('upcoming');
      const archive = await getEvents('past');
      setUpcomingEvents(upcoming);
      setArchiveEvents(archive);
      setLoading(false);
    };
    fetchAllEvents();
  }, []);

  const formatDate = (eventDate: any) => {
    if (!eventDate || !eventDate.toDate) return "Past Event";
    const date = eventDate.toDate();
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (eventDate: any) => {
    if (!eventDate || !eventDate.toDate) return "";
    const date = eventDate.toDate();
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleAction = (link: string) => {
    if (link === "open-modal") {
      setShowOrientationModal(true);
    } else if (link !== "#") {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <SEO 
        title="Webinars & Events"
        description="Join our upcoming webinars and explore the archive of past radiographic education sessions."
      />

      <OrientationRegistrationModal 
        isOpen={showOrientationModal} 
        onClose={() => setShowOrientationModal(false)} 
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mb-4 block">Education.Virtual</span>
           <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
             Webinars & <span className="text-brand-primary">Live Sessions</span>
           </h1>
           <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
             Access exclusive radiographic education from global experts. Stay updated with upcoming events or rewatch our previous modules.
           </p>
        </div>

        {loading ? (
           <div className="flex justify-center py-24">
              <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
           </div>
        ) : (
          <div className="space-y-24">
            
            {/* UPCOMING SECTION */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                 <div className="p-3 bg-brand-primary text-white rounded-2xl shadow-lg shadow-brand-primary/20">
                    <Bell size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Upcoming Sessions</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Registration Open</p>
                 </div>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-sm">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <Clock size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-700">No scheduled webinars for now</h3>
                   <p className="text-slate-400 mt-2 max-w-xs mx-auto font-medium">We're planning new sessions! Check back soon or follow our social channels.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                   {upcomingEvents.map((event) => (
                      <div key={event.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl group hover:border-brand-primary hover:shadow-2xl transition-all duration-500 flex flex-col">
                         <div className="relative aspect-video overflow-hidden">
                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1170&q=80"; }}
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all duration-500">
                                  <Play fill="currentColor" size={24} />
                               </div>
                            </div>
                            <div className="absolute top-6 right-6 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-lg">
                               Live Interactive
                            </div>
                         </div>
                         <div className="p-10 flex-grow flex flex-col">
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-brand-primary mb-6">
                               <span className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 rounded-lg"><Calendar size={14} /> {formatDate(event.eventDate)}</span>
                               <span className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 rounded-lg"><Clock size={14} /> {formatTime(event.eventDate)}</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-snug">{event.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3">{event.description}</p>
                            
                            <div className="mt-auto pt-8 border-t border-slate-50">
                               <a 
                                 href={event.link} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center justify-center w-full bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95 group/btn"
                               >
                                 Register for Free <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                               </a>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              )}
            </section>

            {/* ARCHIVE SECTION */}
            <section>
               <div className="flex items-center gap-4 mb-10">
                 <div className="p-3 bg-slate-200 text-slate-500 rounded-2xl">
                    <History size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Archive Sessions</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Watch & Learn</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[...archiveEvents, ...legacyWebinars].map((event) => (
                    <div key={event.id} className="group border-2 border-slate-100 bg-white rounded-[2.5rem] overflow-hidden hover:border-brand-primary hover:shadow-2xl transition-all duration-500 flex flex-col h-full shadow-sm">
                       <div className="relative aspect-[16/10] overflow-hidden">
                          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"; }}
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all duration-500">
                                <Play fill="currentColor" size={20} />
                             </div>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm uppercase tracking-widest z-10">
                             Completed
                          </div>
                       </div>

                       <div className="p-8 flex-grow flex flex-col">
                          <div className="flex items-center text-[10px] font-black mb-4 uppercase tracking-widest text-slate-400">
                             <Calendar className="mr-2" size={14} />
                             {event.eventDate ? formatDate(event.eventDate) : (event as any).date}
                          </div>
                          <h3 className="text-lg font-black text-slate-900 mb-3 leading-snug group-hover:text-brand-primary transition-colors">
                             {event.title}
                          </h3>
                          <p className="text-slate-500 text-sm mb-8 flex-grow leading-relaxed font-medium line-clamp-3">
                             {event.description}
                          </p>
                          <div className="mt-auto">
                             <button
                               onClick={() => handleAction(event.link!)}
                               disabled={event.link === "#"}
                               className={`inline-flex items-center justify-center w-full px-6 py-4 font-black text-xs uppercase tracking-widest rounded-2xl transition-all group ${
                                 event.link === "#" 
                                 ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                 : "bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 active:scale-95"
                               }`}
                             >
                               {event.link === "#" ? "Archive Closed" : "View Recording"}
                               {event.link !== "#" && (
                                 <ExternalLink className="ml-2 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" size={14} />
                               )}
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            </section>

          </div>
        )}

      </div>
    </div>
  );
};

export default WebinarsPage;
