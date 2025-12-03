import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import { Trash2, ExternalLink, FileText, Check } from "lucide-react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

const AdminMaterialsPage = () => {
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [uploader, setUploader] = useState("");
  const [link, setLink] = useState("");
  const [publicId, setPublicId] = useState("");
  const [message, setMessage] = useState("");
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { course, title, uploader, link } = location.state as any;
      if (course) setCourse(course);
      if (title) setTitle(title);
      if (uploader) setUploader(uploader);
      if (link) setLink(link);
    }
  }, [location.state]);

  const fetchMaterials = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, "materials"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setMessage("❌ Failed to load materials.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleCloudinaryUpload = () => {
    if (!window.cloudinary) {
      alert("Cloudinary script not loaded");
      return;
    }
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgorssyvm",
        uploadPreset: "ml_default",
        sources: ["local", "url", "camera"],
        multiple: false,
        resource_type: "raw",
        folder: "studiRad_materials",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const uploaded = result.info;
          setLink(uploaded.secure_url);
          setPublicId(uploaded.public_id);
          setMessage("✅ File uploaded successfully!");
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

    if (!course || !title || !uploader || !link) {
      setMessage("⚠️ Please fill in all fields and upload a file.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "materials"), {
        course,
        title,
        uploader,
        link,
        publicId,
        createdAt: serverTimestamp(),
      });

      setMessage("✅ Material uploaded successfully!");
      setCourse("");
      setTitle("");
      setUploader("");
      setLink("");
      setPublicId("");
      fetchMaterials();
    } catch (error) {
      console.error("❌ Error uploading material to Firestore:", error);
      setMessage("❌ Failed to upload. Please check Firebase rules.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, publicId?: string) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      await deleteDoc(doc(db, "materials", id));
      setMessage("🗑️ Material deleted successfully.");
      fetchMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
      setMessage("❌ Failed to delete material.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return "—";
    const date = timestamp.toDate();
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-brand-dark mb-8">Admin: Manage Materials</h2>

        {message && (
          <div className={`p-4 rounded-xl mb-8 text-center font-medium ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Upload New Material</h3>
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Material Title</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Uploader Name</label>
              <input
                type="text"
                placeholder="Enter uploader name"
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">File</label>
              <div className="flex gap-4 items-center">
                <button 
                  type="button" 
                  onClick={handleCloudinaryUpload}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Upload via Cloudinary
                </button>
                {link && (
                  <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 font-bold text-sm">
                    <Check size={16} /> File Ready
                  </a>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition-all disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Publish Material"}
            </button>
          </form>
        </div>

        <h3 className="text-xl font-bold mb-4 text-gray-800 px-2">Uploaded Materials</h3>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-dark text-white">
                <tr>
                  <th className="p-4 font-semibold text-sm">Course</th>
                  <th className="p-4 font-semibold text-sm">Title</th>
                  <th className="p-4 font-semibold text-sm">Uploader</th>
                  <th className="p-4 font-semibold text-sm">Date</th>
                  <th className="p-4 font-semibold text-sm text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fetching ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Loading materials...</td>
                  </tr>
                ) : materials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No materials uploaded yet.</td>
                  </tr>
                ) : (
                  materials.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-brand-primary">{item.course}</td>
                      <td className="p-4 text-sm text-gray-800">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-brand-accent flex items-center gap-2">
                           <FileText size={14} /> {item.title}
                        </a>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{item.uploader}</td>
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id, item.publicId)}
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