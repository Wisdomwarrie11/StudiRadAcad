import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Upload, CheckCircle, AlertTriangle, Link as LinkIcon, Video, FileText } from "lucide-react";
import Modal from "../../components/ui/Modal";

const SubmitMaterialPage = () => {
  const [submissionType, setSubmissionType] = useState<"file" | "link" | "video">("file");
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [uploader, setUploader] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState(""); // Shared for Link/Video URL
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Helper to extract YouTube Thumbnail
  const getYoutubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` 
      : null;
  };

  const handleFileUpload = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("resource_type", "raw");
    formData.append("folder", "studiRad_materials");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dgorssyvm/raw/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      if (data.secure_url) return data.secure_url;
      else throw new Error("Cloudinary upload failed");
    } catch (err) {
      console.error("Upload error:", err);
      setError("❌ File upload failed. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!course || !title || !uploader || !email) {
      setError("⚠️ Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (submissionType === "file" && !file) {
      setError("⚠️ Please select a file.");
      setLoading(false);
      return;
    }

    if ((submissionType === "link" || submissionType === "video") && !url) {
      setError(`⚠️ Please enter the ${submissionType} URL.`);
      setLoading(false);
      return;
    }

    if (!agreed) {
        setError("⚠️ You must agree to the copyright and permission terms.");
        setLoading(false);
        return;
    }

    try {
      let finalUrl = url;
      let thumbnailUrl = "";

      if (submissionType === "file") {
        const uploadedUrl = await handleFileUpload();
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        finalUrl = uploadedUrl;
      } else if (submissionType === "video") {
        const thumb = getYoutubeThumbnail(url);
        if (thumb) {
            thumbnailUrl = thumb;
        } else {
            // Default placeholder or try to fetch open graph in backend (not possible here easily)
            thumbnailUrl = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"; 
        }
      }

      await addDoc(collection(db, "pendingMaterials"), {
        type: submissionType,
        course,
        title,
        uploader,
        email,
        link: finalUrl,
        thumbnailUrl: thumbnailUrl,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      setShowModal(true);
      setCourse("");
      setTitle("");
      setUploader("");
      setEmail("");
      setFile(null);
      setUrl("");
      setAgreed(false);
    } catch (error) {
      console.error("Error submitting material:", error);
      setError("❌ Failed to send material. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-brand-dark p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-2">Submit Material</h2>
            <p className="text-blue-200">Share files, links, or videos with the community</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-6 border border-red-100">
                <AlertTriangle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Type Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">What are you submitting?</label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => setSubmissionType("file")}
                        className={`py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                            submissionType === 'file' 
                            ? 'border-brand-primary bg-blue-50 text-brand-primary' 
                            : 'border-gray-200 hover:border-brand-primary/50 text-gray-500'
                        }`}
                    >
                        <FileText size={20} />
                        <span className="text-sm font-bold">File</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSubmissionType("link")}
                        className={`py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                            submissionType === 'link' 
                            ? 'border-brand-primary bg-blue-50 text-brand-primary' 
                            : 'border-gray-200 hover:border-brand-primary/50 text-gray-500'
                        }`}
                    >
                        <LinkIcon size={20} />
                        <span className="text-sm font-bold">Link</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSubmissionType("video")}
                        className={`py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                            submissionType === 'video' 
                            ? 'border-brand-primary bg-blue-50 text-brand-primary' 
                            : 'border-gray-200 hover:border-brand-primary/50 text-gray-500'
                        }`}
                    >
                        <Video size={20} />
                        <span className="text-sm font-bold">Video</span>
                    </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Course Category</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
                >
                  <option value="">Select Course</option>
                  <option value="Anatomy">Anatomy</option>
                  <option value="Physiology">Physiology</option>
                  <option value="Radiographic Technology">Rad Tech</option>
                  <option value="Radiographic Equipment">Radiographic Equipment</option>
                  <option value="Pathology">Pathology</option>
                  <option value="CT">CT</option>
                  <option value="MRI">MRI</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="Projects">Projects</option>
                  <option value="Past Questions">Past Questions</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder={submissionType === 'video' ? "Video Title" : "Material Title"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                    <input
                    type="text"
                    placeholder="Enter your name"
                    value={uploader}
                    onChange={(e) => setUploader(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
                    />
                </div>
              </div>

              {submissionType === 'file' ? (
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Upload File (PDF, DOCX, PPT)</label>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                        <Upload size={32} className="text-brand-muted mb-2" />
                        <span className="text-gray-600 font-medium">
                        {file ? file.name : "Click or Drag to Upload"}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">Max size: 10MB</span>
                    </div>
                    </div>
                </div>
              ) : (
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        {submissionType === 'video' ? 'Video URL (YouTube, Vimeo, etc.)' : 'Link URL (Google Drive, Website, etc.)'}
                    </label>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
                    />
                    {submissionType === 'video' && url && getYoutubeThumbnail(url) && (
                        <div className="mt-3">
                             <p className="text-xs text-gray-500 mb-1">Preview Thumbnail:</p>
                             <img src={getYoutubeThumbnail(url)!} alt="Preview" className="w-32 h-20 object-cover rounded-lg shadow-sm" />
                        </div>
                    )}
                </div>
              )}

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 text-brand-primary rounded focus:ring-brand-primary border-gray-300 cursor-pointer"
                />
                <label htmlFor="agreement" className="text-sm text-gray-700 leading-relaxed cursor-pointer select-none">
                    I certify that this content is <strong>my own work</strong> or I have the right to share it, and I grant StudiRad permission to publish it. I understand that third-party content without permission is prohibited.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition-all shadow-lg shadow-brand-dark/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : `Submit ${submissionType === 'video' ? 'Video' : 'Material'} for Review`}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submission Successful!">
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
             <CheckCircle size={40} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h4>
          <p className="text-gray-500 mb-6">
            Your {submissionType} has been sent for review. Once approved by an admin, it will appear in the library.
          </p>
          <button 
            onClick={() => setShowModal(false)}
            className="px-6 py-2 bg-brand-dark text-white rounded-lg font-bold hover:bg-brand-primary transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SubmitMaterialPage;