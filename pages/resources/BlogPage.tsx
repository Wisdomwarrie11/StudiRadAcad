import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Share2, Clock, User, ChevronRight, BookOpen, Loader2, Search, Check } from 'lucide-react';
import SEO from '../../components/SEO';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  writerName: string;
  writerRole: string;
  category: string;
  imageUrl?: string;
  createdAt?: any;
}

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ['All', 'General', 'Technology', 'Health', 'Education', 'Safety'];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            content: data.content || '',
            writerName: data.writerName || 'StudiRad Team',
            writerRole: data.writerRole || 'Editor',
            category: data.category || 'General',
            imageUrl: data.imageUrl || '',
            createdAt: data.createdAt
          } as BlogPost;
        });
        setPosts(fetched);
        setFilteredPosts(fetched);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = posts;

    if (selectedCategory !== 'All') {
      result = result.filter(post => post.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(queryLower) || 
        post.content.toLowerCase().includes(queryLower) ||
        post.writerName.toLowerCase().includes(queryLower)
      );
    }

    setFilteredPosts(result);
  }, [selectedCategory, searchQuery, posts]);

  const handleShare = async (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#/resources/blog`;
    const text = `Read "${post.title}" by ${post.writerName} on StudiRad! 🚀\n\n${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Read this insightful article on StudiRad!`,
          url: shareUrl
        });
      } catch (err) {
        console.debug('Share API failed, falling back to copy', err);
        copyToClipboard(post.id, text);
      }
    } else {
      copyToClipboard(post.id, text);
    }
  };

  const copyToClipboard = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Could not copy text', err);
    }
  };

  const formatBlogDate = (post: BlogPost) => {
    if (!post.createdAt) return 'Recent';
    const dateObj = post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <SEO 
        title="StudiRad Blog & News"
        description="Read the latest insights, technology updates, safety tips, and medical advancements in the field of radiography."
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">StudiRad Blog</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay up to date with core insights, clinical safety practices, and tech tutorials curated by professional radiographers.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm shadow-sm"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading publications...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Articles Found</h3>
            <p className="text-slate-500 text-sm">We couldn't find any articles matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <article 
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-600">
                        <BookOpen size={48} className="opacity-40" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium">
                      <Clock size={14} />
                      <span>{formatBlogDate(post)}</span>
                    </div>

                    <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-amber-600 transition-colors mb-3 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                </div>

                {/* Footer details & share button */}
                <div className="p-6 pt-0 border-t border-slate-50 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-none">{post.writerName}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1 leading-none">{post.writerRole}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleShare(e, post)}
                    className={`p-2.5 rounded-full transition-all flex items-center justify-center ${copiedId === post.id ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'}`}
                  >
                    {copiedId === post.id ? <Check size={16} /> : <Share2 size={16} />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Cover */}
            <div className="relative h-64 md:h-80 w-full bg-slate-900 flex-shrink-0">
              {selectedPost.imageUrl ? (
                <img 
                  src={selectedPost.imageUrl} 
                  alt={selectedPost.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-600">
                  <BookOpen size={64} className="opacity-40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors font-bold text-lg"
              >
                ✕
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                  {selectedPost.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-black leading-tight">
                  {selectedPost.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-8 overflow-y-auto flex-grow space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedPost.writerName}</p>
                    <p className="text-xs text-slate-400 font-medium">{selectedPost.writerRole}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Clock size={14} />
                    <span>{formatBlogDate(selectedPost)}</span>
                  </div>

                  <button
                    onClick={(e) => handleShare(e, selectedPost)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${copiedId === selectedPost.id ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'}`}
                  >
                    {copiedId === selectedPost.id ? (
                      <>
                        <Check size={16} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={16} />
                        <span>Share Article</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Text Body */}
              <div className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap font-normal">
                {selectedPost.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
