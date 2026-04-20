
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ThumbsUp, Share2, Calendar, User, Search, ArrowRight, Bookmark } from 'lucide-react';
import { db } from '../../firebase';
import Modal from '../../components/ui/Modal';
import { BlogPost, BlogCategory } from '../../types';

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setBlogs(blogData);
    });
    return () => unsubscribe();
  }, []);

  const toggleLike = async (blog: BlogPost) => {
    const userId = "guest_user"; // In a real app, use auth.currentUser.uid
    const blogRef = doc(db, "blogs", blog.id);
    const hasLiked = blog.likedBy?.includes(userId);

    try {
      if (hasLiked) {
        await updateDoc(blogRef, {
          likedBy: arrayRemove(userId),
          likeCount: Math.max(0, (blog.likeCount || 0) - 1)
        });
      } else {
        await updateDoc(blogRef, {
          likedBy: arrayUnion(userId),
          likeCount: (blog.likeCount || 0) + 1
        });
      }
    } catch (err) {
      console.error("Like toggle failed", err);
    }
  };

  const getCategoryStyles = (category: string) => {
    const styles: Record<string, string> = {
      [BlogCategory.General]: "bg-slate-100 text-slate-700",
      [BlogCategory.Technology]: "bg-blue-50 text-blue-600",
      [BlogCategory.Health]: "bg-rose-50 text-rose-600",
      [BlogCategory.Education]: "bg-emerald-50 text-emerald-600",
      [BlogCategory.Safety]: "bg-amber-50 text-amber-600",
      default: "bg-gray-100 text-gray-600",
    };
    return styles[category] || styles.default;
  };

  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(b => b.category === activeCategory);

  const visibleBlogs = filteredBlogs.slice(0, displayCount);

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            The StudiRad <span className="text-indigo-600">Journal</span>
          </h1>
          <p className="text-slate-500 mt-4">Discover the latest in radiologic technology and patient safety.</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {['All', ...Object.values(BlogCategory)].map((cat) => (
            <button
              key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-2xl text-sm font-bold transition-all ${
                activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
             <p className="text-slate-400">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleBlogs.map((blog) => (
              <article key={blog.id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col border border-slate-100">
                {blog.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img src={blog.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <span className={`self-start text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider mb-4 ${getCategoryStyles(blog.category)}`}>
                    {blog.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{blog.title}</h2>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">{blog.content}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <button onClick={() => setSelectedBlog(blog)} className="text-sm font-bold text-indigo-600 flex items-center gap-1">
                      Read More <ArrowRight size={14} />
                    </button>
                    <button onClick={() => toggleLike(blog)} className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${blog.likedBy?.includes("guest_user") ? "text-indigo-600" : "text-slate-400 hover:text-indigo-600"}`}>
                      <ThumbsUp size={16} />
                      <span>{blog.likeCount || 0}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {displayCount < filteredBlogs.length && (
          <div className="text-center mt-12">
            <button onClick={() => setDisplayCount(prev => prev + 6)} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all">
              Load More
            </button>
          </div>
        )}
      </div>

      {selectedBlog && (
        <Modal isOpen={!!selectedBlog} onClose={() => setSelectedBlog(null)} title={selectedBlog.title} size="lg">
          <div className="space-y-6">
            {selectedBlog.imageUrl && (
              <img src={selectedBlog.imageUrl} className="w-full h-64 md:h-96 object-cover rounded-2xl" alt="" />
            )}
            <div className="flex items-center gap-4 py-2 border-b border-slate-50">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <User size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedBlog.writerName}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black">{selectedBlog.writerRole}</p>
              </div>
            </div>
            <div className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selectedBlog.content}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BlogPage;
