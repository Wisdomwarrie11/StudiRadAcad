import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Calendar, Globe, ArrowRight, Newspaper } from "lucide-react";

const NewsPage = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Use a 'news' collection in Firestore. 
  // If none exists, we will show a placeholder state to ensure the page looks good.
  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("publishedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNews(newsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block py-2 px-4 rounded-full bg-red-50 text-red-600 font-bold text-sm uppercase tracking-wider mb-2">
            Global Updates
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">Radiography News</h2>
          <p className="text-xl text-gray-500">
            Stay informed with the latest breakthroughs, policy changes, and technological advancements in medical imaging.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="max-w-4xl mx-auto">
             {/* Empty State Fallback / Demo Content */}
             <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 mb-12">
                <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-600">No News Articles Found</h3>
                <p className="text-gray-400">Be the first to know when updates arrive.</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <a 
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-56 overflow-hidden relative bg-gray-100">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                       <Globe size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                    {item.source || "News"}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar size={14} />
                    <span>
                      {item.publishedAt?.toDate ? item.publishedAt.toDate().toLocaleDateString() : "Recent"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                    {item.summary || "Click to read the full story on the original source."}
                  </p>

                  <div className="mt-auto flex items-center text-brand-primary font-bold text-sm">
                    Read Full Story <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
        
        {/* Newsletter Promo for News Page */}
        <div className="mt-20 bg-brand-dark rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Never Miss an Update</h3>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">Get a weekly digest of the most important radiography news delivered specifically to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                 <input type="email" placeholder="Enter your email" className="px-6 py-3 rounded-xl text-gray-900 focus:outline-none w-full" />
                 <button className="bg-brand-accent text-brand-dark font-bold px-8 py-3 rounded-xl hover:bg-white transition-colors">Subscribe</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;