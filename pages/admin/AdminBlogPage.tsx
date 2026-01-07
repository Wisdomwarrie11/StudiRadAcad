
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, addDoc, onSnapshot, query, orderBy, 
  deleteDoc, doc, updateDoc, serverTimestamp 
} from "firebase/firestore";
import { 
  Edit2, Trash2, Image as ImageIcon, Plus, 
  Save, Loader2, CheckCircle, AlertCircle, 
  X, ChevronRight, LayoutList, UploadCloud
} from 'lucide-react';
import { db } from '../../firebase';
import Modal from '../../components/ui/Modal';
import { processAndCompressImage, uploadImageToStorage } from '../../services/imageService';
import { BlogPost, BlogCategory } from '../../types';

const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'compressing' | 'uploading' | 'saving'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [writerName, setWriterName] = useState("");
  const [writerRole, setWriterRole] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<BlogCategory>(BlogCategory.General);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<BlogCategory>(BlogCategory.General);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(data);
    }, (err) => {
      console.error("Firestore sync error:", err);
      setError("Failed to sync posts with database.");
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setTitle("");
    setWriterName("");
    setWriterRole("");
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    setCategory(BlogCategory.General);
    setUploadProgress(0);
    setUploadStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      let finalImageUrl = "";

      if (imageFile) {
        setUploadStatus('compressing');
        const compressed = await processAndCompressImage(imageFile);
        
        setUploadStatus('uploading');
        finalImageUrl = await uploadImageToStorage(compressed, (progress) => {
          setUploadProgress(progress);
        });
      }

      setUploadStatus('saving');
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        writerName,
        writerRole,
        category,
        imageUrl: finalImageUrl,
        createdAt: serverTimestamp(),
        likeCount: 0,
        likedBy: []
      });

      setSuccess("Article published successfully!");
      clearForm();
    } catch (err: any) {
      console.error("Publishing error:", err);
      setError(err.message || "Failed to publish article. Please check your connection.");
    } finally {
      setLoading(false);
      setUploadStatus('idle');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanent delete? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "blogs", id));
      } catch (err) {
        setError("Could not delete post.");
      }
    }
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category as BlogCategory);
    setIsEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editingPost) return;
    try {
      await updateDoc(doc(db, "blogs", editingPost.id), {
        title: editTitle,
        content: editContent,
        category: editCategory,
        updatedAt: serverTimestamp()
      });
      setIsEditModalOpen(false);
      setSuccess("Post updated.");
    } catch (err) {
      setError("Update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto py-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Blog Admin</h1>
            <p className="text-slate-500 mt-1">Manage radiologic publications and insights</p>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="font-medium text-sm">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X size={18} /></button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-2">
            <CheckCircle size={20} />
            <p className="font-medium text-sm">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto text-emerald-400 hover:text-emerald-600"><X size={18} /></button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky top-28">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <Plus size={18} />
                </div>
                <h2 className="font-bold text-slate-800">New Publication</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
                  <input
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="Engaging headline..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Author</label>
                    <input
                      type="text" required value={writerName} onChange={(e) => setWriterName(e.target.value)}
                      placeholder="Name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                    <input
                      type="text" required value={writerRole} onChange={(e) => setWriterRole(e.target.value)}
                      placeholder="Role"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogCategory)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white cursor-pointer"
                  >
                    {Object.values(BlogCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Content</label>
                  <textarea
                    required rows={4} value={content} onChange={(e) => setContent(e.target.value)}
                    placeholder="Write something amazing..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cover Image</label>
                  <div className="group relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 transition-all bg-slate-50/50">
                    <input
                      type="file" accept="image/*" onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      ref={fileInputRef}
                    />
                    {imagePreview ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="text-white" size={32} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4 text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <UploadCloud size={32} strokeWidth={1.5} className="mb-2" />
                        <span className="text-xs font-semibold">Click to upload photo</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-all flex flex-col items-center justify-center gap-1 shadow-xl disabled:bg-slate-300 relative overflow-hidden"
                >
                  <div className="flex items-center gap-2">
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <ChevronRight size={20} />}
                    <span>
                      {uploadStatus === 'idle' && "Publish Article"}
                      {uploadStatus === 'compressing' && "Optimizing Image..."}
                      {uploadStatus === 'uploading' && `Uploading (${uploadProgress}%)`}
                      {uploadStatus === 'saving' && "Finalizing..."}
                    </span>
                  </div>
                  {loading && uploadProgress > 0 && (
                    <div className="w-full h-1 bg-white/20 absolute bottom-0 left-0">
                      <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <LayoutList size={20} className="text-indigo-600" />
              Published Posts
            </h3>

            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-white border border-slate-100 p-16 rounded-3xl text-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                    <ImageIcon size={32} />
                   </div>
                   <p className="text-slate-400 text-sm">No articles published yet.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all group flex gap-4 items-center">
                    {post.imageUrl && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                        <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{post.title}</h4>
                      <p className="text-slate-500 text-xs line-clamp-1 mt-1">{post.content}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditModal(post)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Article">
        <div className="space-y-4">
          <input
            type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm"
          />
          <textarea
            rows={6} value={editContent} onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm resize-none"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500">Cancel</button>
            <button onClick={saveEdit} className="px-6 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl">Save Changes</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBlogPage;
