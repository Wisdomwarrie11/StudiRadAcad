import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { Edit2, Trash2, Image as ImageIcon, Plus, Save, X, Loader2 } from "lucide-react";
import Modal from "../../components/ui/Modal";

const AdminBlogPage = () => {
  const [title, setTitle] = useState("");
  const [writerName, setWriterName] = useState("");
  const [writerRole, setWriterRole] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  // Edit State
  const [editModalShow, setEditModalShow] = useState(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("General");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "blogs"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
        const compressedFile = await imageCompression(imageFile, options);

        const imageRef = ref(storage, `blogImages/${Date.now()}_${compressedFile.name}`);
        await uploadBytes(imageRef, compressedFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "blogs"), {
        title,
        content,
        writerName,
        writerRole,
        category,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setMessage("✅ Blog post successfully added!");
      setTitle("");
      setContent("");
      setWriterName("");
      setWriterRole("");
      setImageFile(null);
      setCategory("General");
      fetchPosts();
    } catch (error) {
      console.error("Error adding blog post:", error);
      setMessage("❌ Failed to add post. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "blogs", id));
        fetchPosts();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const openEditModal = (post: any) => {
    setEditPostId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category || "General");
    setEditModalShow(true);
  };

  const handleEditSave = async () => {
    if (!editTitle.trim() || !editContent.trim() || !editPostId) return;

    setEditLoading(true);
    try {
      await updateDoc(doc(db, "blogs", editPostId), {
        title: editTitle,
        content: editContent,
        category: editCategory,
        updatedAt: new Date(),
      });
      setEditModalShow(false);
      fetchPosts();
    } catch (error) {
      console.error("Error updating blog:", error);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-bold text-center text-brand-dark mb-8">Blog Management</h2>

        {message && (
          <div className={`p-4 rounded-xl mb-8 text-center font-medium ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Post Form */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Plus size={20} className="text-brand-accent" /> Create New Post
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Writer Name</label>
                      <input
                        type="text"
                        value={writerName}
                        onChange={(e) => setWriterName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                      <input
                        type="text"
                        value={writerRole}
                        onChange={(e) => setWriterRole(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm bg-white"
                    >
                      <option value="General">General</option>
                      <option value="Technology">Technology</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Safety">Safety</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Content</label>
                    <textarea
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Cover Image</label>
                    <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center">
                         <ImageIcon size={20} className="text-gray-400 mb-1" />
                         <span className="text-xs text-gray-500">{imageFile ? imageFile.name : "Select Image"}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : "Publish Post"}
                  </button>
                </form>
             </div>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Published Posts</h3>
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center text-gray-400 border border-gray-100">
                  No posts published yet.
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">{post.category || "General"}</span>
                      <div className="flex gap-2">
                         <button onClick={() => openEditModal(post)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                           <Edit2 size={16} />
                         </button>
                         <button onClick={() => handleDelete(post.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-brand-dark text-lg mb-1">{post.title}</h4>
                    <p className="text-xs text-gray-500 mb-3">
                      By {post.writerName} • {post.writerRole}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={editModalShow}
        onClose={() => setEditModalShow(false)}
        title="Edit Blog Post"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm bg-white"
            >
              <option value="General">General</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Safety">Safety</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Content</label>
            <textarea
              rows={8}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => setEditModalShow(false)}
              className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleEditSave}
              disabled={editLoading}
              className="px-4 py-2 text-sm font-bold bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2"
            >
              {editLoading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBlogPage;