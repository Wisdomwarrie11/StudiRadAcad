
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db, adminAuth } from "../../firebase";
import { supabase } from "../../src/supabase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { Trash2, ExternalLink, FileText, Check, Video, Link as LinkIcon, Image, Loader2, Upload, X } from "lucide-react";
import imageCompression from 'browser-image-compression';

const AdminMaterialsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = adminAuth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const [activeTab, setActiveTab] = useState<"materials" | "videos">("materials");
  const [submissionType, setSubmissionType] = useState<"file" | "link" | "video">("file");
  
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [uploader, setUploader] = useState("");
  const [link, setLink] = useState(""); // Used for single link/video
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // To store selected files
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [message, setMessage] = useState("");
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const getYoutubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` 
      : null;
  };

  const fetchItems = async () => {
    setFetching(true);
    try {
      const collectionName = activeTab;
      const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      setMessage(`❌ Failed to load ${activeTab}.`);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const uploadToSupabase = async (fileToUpload: File, onProgress?: (percent: number) => void) => {
    try {
      let file = fileToUpload;

      // Compress if it's an image
      if (file.type.startsWith('image/')) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        try {
          file = await imageCompression(file, options);
        } catch (error) {
          console.warn("Compression failed, uploading original", error);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `admin/${Date.now()}_${fileName}`;

      // Simulate progress for better UX
      let progress = 10;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) {
          clearInterval(interval);
        } else if (onProgress) {
          onProgress(Math.floor(progress));
        }
      }, 500);

      const { data, error } = await supabase.storage
        .from('materials')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

      clearInterval(interval);
      if (error) throw error;

      if (onProgress) onProgress(100);

      const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error("Supabase upload error:", err);
      return null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Check file sizes (50MB limit)
      const oversized = files.filter((f: File) => f.size > 50 * 1024 * 1024);
      if (oversized.length > 0) {
          setMessage(`⚠️ Some files exceed the 50MB limit: ${oversized.map((f: File) => f.name).join(", ")}`);
          return;
      }

      setSelectedFiles(files);
      setMessage(`✅ ${files.length} file(s) selected.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setUploadProgress({});

    if (!course || !uploader) {
      setMessage("⚠️ Please fill in course and uploader fields.");
      setLoading(false);
      return;
    }

    try {
      if (submissionType === 'file') {
        if (selectedFiles.length === 0) {
          setMessage("⚠️ Please select at least one file.");
          setLoading(false);
          return;
        }

        // Parallel uploads using Promise.all
        const uploadPromises = selectedFiles.map(async (file) => {
          setUploadProgress(prev => ({ ...prev, [file.name]: 10 }));

          const uploadedUrl = await uploadToSupabase(file, (p) => {
            setUploadProgress(prev => ({ ...prev, [file.name]: p }));
          });

          if (!uploadedUrl) {
            throw new Error(`Failed to upload ${file.name}`);
          }

          return {
            course,
            title: title || file.name,
            uploader,
            link: uploadedUrl,
            type: "file",
            createdAt: serverTimestamp(),
          };
        });

        const uploadedItems = await Promise.all(uploadPromises);

        // Add all to Firestore after successful uploads
        const firestorePromises = uploadedItems.map(item => 
          addDoc(collection(db, "materials"), item)
        );
        await Promise.all(firestorePromises);
        
        setMessage(`✅ ${uploadedItems.length} item(s) published successfully!`);
      } else {
        // Handle single link or video
        if (!title || !link) {
          setMessage("⚠️ Title and URL are required.");
          setLoading(false);
          return;
        }

        let collectionName = "materials";
        let payload: any = {
          course,
          title,
          uploader,
          link,
          createdAt: serverTimestamp(),
        };

        if (submissionType === 'video') {
          collectionName = "videos";
          const thumb = getYoutubeThumbnail(link);
          payload.thumbnailUrl = thumb || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop";
        } else {
          payload.type = "link";
        }

        await addDoc(collection(db, collectionName), payload);
        setMessage(`✅ ${submissionType} published successfully!`);
      }
      
      // Reset form
      setCourse("");
      setTitle("");
      setUploader("");
      setLink("");
      setSelectedFiles([]);
      fetchItems();
    } catch (error) {
      console.error("❌ Error uploading:", error);
      setMessage("❌ Failed to upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteDoc(doc(db, activeTab, id));
      setMessage("🗑️ Deleted successfully.");
      fetchItems();
    } catch (error) {
      console.error("Error deleting:", error);
      setMessage("❌ Failed to delete.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return "—";
    return timestamp.toDate().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-brand-dark mb-8">Admin: Manage Content</h2>

        {message && (
          <div className={`p-4 rounded-xl mb-8 text-center font-medium ${message.includes("✅") ? "bg-green-100 text-green-800" : message.includes("🗑️") ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Post New Content</h3>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                {(['file', 'link', 'video'] as const).map(type => (
                    <button
                        key={type}
                        onClick={() => {
                            setSubmissionType(type);
                            setLink("");
                            setSelectedFiles([]);
                        }}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold capitalize transition-all ${submissionType === type ? 'bg-white shadow text-brand-primary' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Course Category</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">Select Course</option>
                  <option value="Anatomy">Anatomy</option>
                  <option value="Physiology">Physiology</option>
                  <option value="Rad Tech">Rad Tech</option>
                  <option value="Rad Equipment">Rad Equipment</option>
                  <option value="Pathology">Pathology</option>
                  <option value="MRI">MRI</option>
                  <option value="CT">CT</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="Projects">Projects</option>
                  <option value="Professional Exams PQ">Professional Exams PQ</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title {submissionType === 'file' && '(Optional if uploading files)'}</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Uploader / Author Name</label>
              <input
                type="text"
                placeholder="Enter admin name or author"
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {submissionType === 'file' ? 'Upload Files (Max 5)' : submissionType === 'video' ? 'Video URL' : 'Link URL'}
              </label>
              
              {submissionType === 'file' ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <label className="cursor-pointer px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-brand-primary transition-colors flex items-center gap-2">
                        <Upload size={18} /> Select Files
                        <input 
                          type="file" 
                          multiple 
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-slate-400 font-medium">PDF, DOCX, PPT, IMAGES (Max 50MB per file)</span>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="space-y-3">
                        {selectedFiles.map((f, i) => (
                          <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText size={18} className="text-brand-primary shrink-0" />
                                <span className="text-sm font-bold text-slate-700 truncate">{f.name}</span>
                                <span className="text-[10px] text-slate-400 font-black">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                              {!loading && (
                                  <button type="button" onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 p-1">
                                      <X size={18} />
                                  </button>
                              )}
                            </div>
                            {loading && uploadProgress[f.name] !== undefined && (
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-brand-primary transition-all duration-300"
                                        style={{ width: `${uploadProgress[f.name]}%` }}
                                    />
                                </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
              ) : (
                  <div>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                     {submissionType === 'video' && link && getYoutubeThumbnail(link) && (
                        <div className="mt-2 flex items-center gap-2">
                             <img src={getYoutubeThumbnail(link)!} alt="Preview" className="h-16 rounded border" />
                             <span className="text-xs text-green-600 font-bold">Thumbnail Detected</span>
                        </div>
                    )}
                  </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition-all disabled:opacity-50 shadow-lg shadow-brand-dark/10"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : `Publish ${submissionType === 'file' ? 'All Selected' : submissionType}`}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-1">
            <button 
                onClick={() => setActiveTab('materials')}
                className={`pb-3 px-4 font-bold transition-colors border-b-2 ${activeTab === 'materials' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
                Manage Materials
            </button>
            <button 
                onClick={() => setActiveTab('videos')}
                className={`pb-3 px-4 font-bold transition-colors border-b-2 ${activeTab === 'videos' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
                Manage Videos
            </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-dark text-white">
                <tr>
                  <th className="p-4 font-semibold text-sm">Course</th>
                  <th className="p-4 font-semibold text-sm">Title</th>
                  <th className="p-4 font-semibold text-sm">Type</th>
                  <th className="p-4 font-semibold text-sm">Date</th>
                  <th className="p-4 font-semibold text-sm text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fetching ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Loading items...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No {activeTab} found.</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-brand-primary">{item.course}</td>
                      <td className="p-4 text-sm text-gray-800">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-brand-accent flex items-center gap-2">
                           {activeTab === 'videos' ? <Video size={14}/> : <FileText size={14} />} 
                           {item.title}
                        </a>
                      </td>
                      <td className="p-4 text-sm text-gray-600 capitalize">
                        {activeTab === 'videos' ? 'Video' : (item.type || 'File')}
                      </td>
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMaterialsPage;
