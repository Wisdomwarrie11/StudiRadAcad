import React, { useState, useEffect } from 'react';
import { MapPin, Building2, ChevronRight, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminDb } from '../../firebase';
import { Opportunity } from '../../types';

const OpportunitiesPreview: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // We use adminDb because the data is stored in the 'studirad-admin-portal' project
        
        // Fetch latest items from all 3 collections in parallel
        const [jobsSnap, internshipsSnap, scholarshipsSnap] = await Promise.all([
          adminDb.collection('jobs').orderBy('createdAt', 'desc').limit(4).get(),
          adminDb.collection('internships').orderBy('createdAt', 'desc').limit(4).get(),
          adminDb.collection('scholarships').orderBy('createdAt', 'desc').limit(4).get()
        ]);

        const parseDate = (val: any): Date => {
          if (!val) return new Date();
          
          // Handle Firestore Timestamp (has toDate method)
          if (val && typeof val.toDate === 'function') {
            return val.toDate();
          }
          
          // Handle Firestore Timestamp serialized as object {seconds, nanoseconds}
          if (val && val.seconds !== undefined && typeof val.seconds === 'number') {
            return new Date(val.seconds * 1000);
          }

          // Handle standard Date strings or numbers
          const d = new Date(val);
          if (!isNaN(d.getTime())) {
            return d;
          }
          
          return new Date();
        };

        const formatData = (doc: any, type: 'Job' | 'Internship' | 'Scholarship'): Opportunity => {
          const data = doc.data();
          
          // Determine the display date:
          // 1. Try 'postedAt' (manual entry, usually string in Jobs)
          // 2. Try 'createdAt' (system entry, usually Timestamp)
          // 3. Fallback to now
          
          let dateObj: Date;
          
          if (data.postedAt) {
             dateObj = parseDate(data.postedAt);
             // If parseDate returned "now" because of invalid string, fallback to createdAt
             // We can check if the parsed date is reasonably valid, or just check the input string validity
             const testDate = new Date(data.postedAt);
             if (isNaN(testDate.getTime())) {
                 dateObj = parseDate(data.createdAt);
             }
          } else {
             dateObj = parseDate(data.createdAt);
          }

          return {
            id: doc.id,
            title: data.title,
            organization: data.organization,
            type: type,
            // Scholarships might not have location, so we default based on type
            location: data.location || (type === 'Scholarship' ? 'Global/Online' : 'Remote'),
            datePosted: dateObj.toISOString()
          };
        };

        const jobs = jobsSnap.docs.map((doc: any) => formatData(doc, 'Job'));
        const internships = internshipsSnap.docs.map((doc: any) => formatData(doc, 'Internship'));
        const scholarships = scholarshipsSnap.docs.map((doc: any) => formatData(doc, 'Scholarship'));

        // Combine all, sort by newest first (descending), and take top 4
        const allOpportunities = [...jobs, ...internships, ...scholarships]
          .sort((a, b) => {
             const dateA = new Date(a.datePosted).getTime();
             const dateB = new Date(b.datePosted).getTime();
             return dateB - dateA;
          })
          .slice(0, 4);

        setOpportunities(allOpportunities);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Job': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Internship': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Scholarship': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };
  
  const getLinkPath = (type: string) => {
      switch (type) {
          case 'Job': return '/jobs';
          case 'Internship': return '/internship';
          case 'Scholarship': return '/scholarship';
          default: return '/opportunities';
      }
  };

  return (
    <section id="opportunities" className="py-20 bg-brand-dark text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent rounded-full filter blur-[80px] opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-brand-accent font-bold uppercase tracking-wider mb-2 text-sm md:text-base">Career Hub</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white">Latest Opportunities</h3>
          </div>
        
           <Link to="/opportunities">  
              <button className="group bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 border border-white/5 hover:border-white/20">
                Browse All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </Link>
        </div>

        {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
                <p className="text-slate-400 text-sm">Loading opportunities...</p>
            </div>
        ) : opportunities.length === 0 ? (
             <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-white text-lg font-medium">No recent opportunities found.</p>
                <p className="text-sm text-slate-400 mt-2">Check back soon for new jobs, internships, and grants.</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {opportunities.map((opp) => (
                <div key={opp.id} className="group bg-slate-800/50 border border-white/10 rounded-2xl p-6 hover:bg-slate-800 hover:border-brand-primary/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full shadow-lg hover:shadow-brand-primary/10">
                  <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeColor(opp.type)}`}>
                        {opp.type}
                      </span>
                      <span className="text-slate-400 text-xs whitespace-nowrap">{getRelativeTime(opp.datePosted)}</span>
                  </div>
                  
                  <h4 className="text-lg font-bold mb-3 line-clamp-2 text-white group-hover:text-brand-accent transition-colors min-h-[3.5rem]">
                    {opp.title}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                      <Building2 size={16} className="text-brand-primary shrink-0" />
                      <span className="truncate">{opp.organization}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                      <MapPin size={16} className="shrink-0" />
                      <span className="truncate">{opp.location}</span>
                  </div>

                  <Link to={getLinkPath(opp.type)} className="mt-auto w-full py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white bg-white/5 hover:bg-brand-primary hover:border-brand-primary transition-all text-center block">
                      View Details
                  </Link>
                </div>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default OpportunitiesPreview;