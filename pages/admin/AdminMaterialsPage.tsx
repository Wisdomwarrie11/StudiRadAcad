
import React, { useState, useEffect } from "react";
import * as ReactRouterDOM from "react-router-dom";
const { useLocation } = ReactRouterDOM as any;
import { db } from "../../firebase";
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
import { Trash2, ExternalLink, FileText, Check, Video, Link as LinkIcon, Image, Loader2 } from "lucide-react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

const AdminMaterialsPage = () => {
  const [activeTab, setActiveTab] = useState<"materials" | "videos">("materials");
  const [submissionType, setSubmissionType] = useState<"file" | "link" | "video">("file");
  
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [uploader, setUploader] = useState("");
  const [link, setLink] = useState(""); // Used for single link/video
  const [bulkFiles, setBulkFiles] = useState<any[]>([]); // To store URLs/IDs of bulk uploaded files
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

  const handleCloudinaryUpload = () => {
    if (!window.cloudinary) {
      alert("Cloudinary script not loaded");
      return;
    }

    const uploadedResults: any[] = [];
    
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgorssyvm",
        uploadPreset: "ml_default",
        sources: ["local", "url", "camera"],
        multiple: true,
        maxFiles: 5,
        resource_type: "raw",
        folder: "studiRad_materials",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          uploadedResults.push({
            url: result.info.secure_url,
            publicId: result.info.public_id,
            original_filename: result.info.original_filename
          });
          setBulkFiles([...uploadedResults]);
          setMessage(`✅ ${uploadedResults.length} file(s) ready.`);
        } else if (error) {
          console.error("Upload error:", error);
          setMessage("❌ Upload failed. Try again.");
        }
      }
    );
    myWidget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!course || !uploader) {
      setMessage("⚠️ Please fill in course and uploader fields.");
      setLoading(false);
      return;
    }

    try {
      if (submissionType === 'file') {
        if (bulkFiles.length === 0) {
          setMessage("⚠️ Please upload at least one file.");
          setLoading(false);
          return;
        }

        // Process each file in bulkFiles
        for (const fileData of bulkFiles) {
          await addDoc(collection(db, "materials"), {
            course,
            title: title || fileData.original_filename, // Use specific title or fallback to filename
            uploader,
            link: fileData.url,
            publicId: fileData.publicId,
            type: "file",
            createdAt: serverTimestamp(),
          });
        }
        setMessage(`✅ ${bulkFiles.length} item(s) published successfully!`);
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
      setBulkFiles([]);
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
                            setBulkFiles([]);
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
                      <button 
                        type="button" 
                        onClick={handleCloudinaryUpload}
                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-brand-primary transition-colors flex items-center gap-2"
                      >
                        <Check size={18} /> Select Files via Cloudinary
                      </button>
                    </div>
                    {bulkFiles.length > 0 && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ready to publish:</p>
                        <ul className="space-y-1">
                          {bulkFiles.map((f, i) => (
                            <li key={i} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <FileText size={14} className="text-brand-primary" /> {f.original_filename}
                            </li>
                          ))}
                        </ul>
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
