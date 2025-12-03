import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  doc,
  query,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ThumbsUp, Share2, Calendar, User } from "lucide-react";
import Modal from "../../components/ui/Modal";

const BlogPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState("");

  const categoryColors: Record<string, string> = {
    General: "bg-brand-accent text-brand-dark",
    Technology: "bg-blue-500 text-white",
    Health: "bg-red-500 text-white",
    Education: "bg-green-600 text-white",
    Safety: "bg-orange-500 text-white",
    default: "bg-gray-500 text-white",
  };

  const getCategoryColor = (category: string) => {
    if (!category) return categoryColors.default;
    const key = category.trim();
    return categoryColors[key] || categoryColors.default;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user && user.emailVerified) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogData);
    });
    return () => unsubscribe();
  }, []);

  const toggleLike = async (blog: any) => {
    const userId = currentUser?.uid || "guest";
    const blogRef = doc(db, "blogs", blog.id);
    const hasLiked = blog.likedBy?.includes(userId);
    const currentCount = blog.likeCount || blog.likedBy?.length || 0;

    try {
      if (hasLiked) {
        await updateDoc(blogRef, {
          likedBy: arrayRemove(userId),
          likeCount: currentCount > 0 ? currentCount - 1 : 0,
        });
      } else {
        await updateDoc(blogRef, {
          likedBy: arrayUnion(userId),
          likeCount: currentCount + 1,
        });
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: `${title} | StudiRad Blog`,
        text: "Check out this article on StudiRad!",
        url: window.location.href,
      });
    } else {
      setAlertMessage("Sharing is not supported on this browser.");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const getSnippet = (text: string, min = 100, max = 300) => {
    if (!text) return "";
    if (text.length <= max) return text;
    let snippet = text.substring(0, max);
    const lastSpace = snippet.lastIndexOf(" ");
    if (lastSpace > min) snippet = snippet.substring(0, lastSpace);
    return snippet + "...";
  };

  const visibleBlogs = blogs.slice(0, displayCount);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="inline-block py-2 px-4 rounded-full bg-brand-accent/10 text-brand-dark font-bold text-sm uppercase tracking-wider mb-2">
            StudiRad Blog
          </span>
          <h2 className="text-4xl font-bold text-brand-dark">Insights & Articles</h2>
        </div>

        {alertMessage && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center shadow-sm border border-yellow-200">
            {alertMessage}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
               <Calendar size={32} />
             </div>
             <p className="text-gray-500 text-lg">No blog posts available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleBlogs.map((blog) => (
                <div 
                  key={blog.id} 
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full border border-gray-100 hover:-translate-y-1"
                >
                  {blog.imageUrl && (
                    <div className="h-56 overflow-hidden relative">
                       <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-4 left-4 z-20 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${getCategoryColor(blog.category)}`}>
                        {blog.category || "General"}
                      </span>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <h5 className="text-xl font-bold text-brand-dark mb-3 line-clamp-2 leading-tight">
                      {blog.title}
                    </h5>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{blog.writerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{blog.createdAt?.toDate ? blog.createdAt.toDate().toDateString() : "Unknown Date"}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                      {getSnippet(blog.content, 100, 150)}
                    </p>

                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="w-full py-2.5 rounded-lg border border-brand-accent text-brand-dark font-semibold hover:bg-brand-accent hover:text-white transition-all mb-4 text-sm"
                    >
                      Read More
                    </button>

                    <div className="flex justify-between items-center text-gray-500 text-sm">
                      <button 
                        onClick={() => toggleLike(blog)} 
                        className={`flex items-center gap-1.5 hover:text-brand-accent transition-colors ${blog.likedBy?.includes(currentUser?.uid || "guest") ? "text-brand-accent font-medium" : ""}`}
                      >
                        <ThumbsUp size={18} />
                        <span>{blog.likeCount || blog.likedBy?.length || 0}</span>
                      </button>

                      <button 
                        onClick={() => handleShare(blog.title)} 
                        className="flex items-center gap-1.5 hover:text-brand-primary transition-colors"
                      >
                        <Share2 size={18} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayCount < blogs.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setDisplayCount(displayCount + 6)}
                  className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <Modal
          isOpen={!!selectedBlog}
          onClose={() => setSelectedBlog(null)}
          title={selectedBlog.title}
          size="lg"
        >
          <div className="space-y-6">
            {selectedBlog.imageUrl && (
              <img
                src={selectedBlog.imageUrl}
                alt={selectedBlog.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-md"
              />
            )}

            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryColor(selectedBlog.category)}`}>
                {selectedBlog.category || "General"}
              </span>
              <span className="text-sm text-gray-500">
                By <strong className="text-gray-900">{selectedBlog.writerName}</strong> ({selectedBlog.writerRole})
              </span>
            </div>

            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedBlog.content}
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
               <button 
                  onClick={() => toggleLike(selectedBlog)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedBlog.likedBy?.includes(currentUser?.uid || "guest") 
                      ? "bg-brand-accent text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <ThumbsUp size={20} />
                  <span>{selectedBlog.likeCount || selectedBlog.likedBy?.length || 0} Likes</span>
                </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BlogPage;