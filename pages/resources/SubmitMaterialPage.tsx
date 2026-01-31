
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Upload, CheckCircle, AlertTriangle, Link as LinkIcon, Video, FileText, X, Loader2 } from "lucide-react";
import Modal from "../../components/ui/Modal";

const SubmitMaterialPage = () => {
  const [submissionType, setSubmissionType] = useState<"file" | "link" | "video">("file");
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [uploader, setUploader] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState(""); 
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const getYoutubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` 
      : null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 5) {
            setError("⚠️ Maximum of 5 files allowed at once.");
            return;
        }
        setFiles(selectedFiles);
        setError("");
    }
  };

  const uploadToCloudinary = async (fileToUpload: File) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);
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
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!course || !uploader || !email) {
      setError("⚠️ Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (submissionType === "file" && files.length === 0) {
      setError("⚠️ Please select at least one file.");
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
      if (submissionType === "file") {
        let successCount = 0;
        for (const f of files) {
          const uploadedUrl = await uploadToCloudinary(f);
          if (uploadedUrl) {
            await addDoc(collection(db, "pendingMaterials"), {
              type: "file",
              course,
              title: files.length === 1 && title ? title : f.name, // Use custom title if single file, else filename
              uploader,
              email,
              link: uploadedUrl,
              createdAt: serverTimestamp(),
              status: "pending",
            });
            successCount++;
          }
        }
        if (successCount === 0) throw new Error("All file uploads failed.");
      } else {
        // Single Link or Video
        let finalUrl = url;
        let thumbnailUrl = "";

        if (submissionType === "video") {
          const thumb = getYoutubeThumbnail(url);
          thumbnailUrl = thumb || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop";
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
      }

      setShowModal(true);
      setCourse("");
      setTitle("");
      setUploader("");
      setEmail("");
      setFiles([]);
      setUrl("");
      setAgreed(false);
    } catch (error: any) {
      console.error("Error submitting material:", error);
      setError(`❌ Submission failed: ${error.message || 'Try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-brand-dark p-8 text-center text-white relative">
            <div className="absolute top-4 right-4 bg-brand-accent/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-accent border border-brand-accent/20">
                Bulk Upload (Max 5)
            </div>
            <h2 className="text-3xl font-black mb-2">Submit Material</h2>
            <p className="text-blue-200">Share files, links, or videos with the community</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-6 border border-red-100 font-medium">
                <AlertTriangle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Type Selector */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">What are you submitting?</label>
                <div className="grid grid-cols-3 gap-3">
                    {(['file', 'link', 'video'] as const).map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => { setSubmissionType(type); setFiles([]); }}
                            className={`py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                                submissionType === type 
                                ? 'border-brand-primary bg-blue-50 text-brand-primary' 
                                : 'border-gray-200 hover:border-brand-primary/50 text-gray-500'
                            }`}
                        >
                            {type === 'file' && <FileText size={20} />}
                            {type === 'link' && <LinkIcon size={20} />}
                            {type === 'video' && <Video size={20} />}
                            <span className="text-xs font-black uppercase tracking-wider">{type}</span>
                        </button>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Course Category</label>
                    <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary font-bold text-sm bg-slate-50"
                    >
                        <option value="">Select Category</option>
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
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Title {submissionType === 'file' && files.length > 1 && '(Optional)'}</label>
                    <input
                        type="text"
                        placeholder={submissionType === 'video' ? "Video Title" : "Material Title"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary font-bold text-sm"
                    />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                    <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={uploader}
                    onChange={(e) => setUploader(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary font-bold text-sm bg-slate-50"
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
                    <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary font-bold text-sm bg-slate-50"
                    />
                </div>
              </div>

              {submissionType === 'file' ? (
                <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Select Files (Up to 5)</label>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors group">
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center">
                        <Upload size={40} className="text-slate-300 group-hover:text-brand-primary transition-colors mb-3" />
                        <span className="text-slate-600 font-bold">
                           Click to Select or Drag Files
                        </span>
                        <span className="text-xs text-slate-400 mt-2 font-medium tracking-wide">PDF, DOCX, PPT, IMAGES (Max 10MB per file)</span>
                    </div>
                    </div>

                    {files.length > 0 && (
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Selected Files:</p>
                             <div className="space-y-2">
                                 {files.map((f, i) => (
                                     <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-2">
                                         <div className="flex items-center gap-3 overflow-hidden">
                                             <FileText size={18} className="text-brand-primary shrink-0" />
                                             <span className="text-sm font-bold text-slate-700 truncate">{f.name}</span>
                                             <span className="text-[10px] text-slate-400 font-black">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                                         </div>
                                         <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 p-1">
                                             <X size={18} />
                                         </button>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}
                </div>
              ) : (
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        {submissionType === 'video' ? 'Video URL (YouTube, Vimeo, etc.)' : 'Link URL (Google Drive, Website, etc.)'}
                    </label>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary font-bold text-sm"
                    />
                    {submissionType === 'video' && url && getYoutubeThumbnail(url) && (
                        <div className="mt-4 flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                             <img src={getYoutubeThumbnail(url)!} alt="Preview" className="w-24 h-16 object-cover rounded-lg shadow-md shrink-0" />
                             <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Video Detected</p>
                        </div>
                    )}
                </div>
              )}

              <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 text-brand-primary rounded-lg focus:ring-brand-primary border-gray-300 cursor-pointer"
                />
                <label htmlFor="agreement" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none font-medium">
                    I certify that this content is <strong>my own work</strong> or I have the right to share it. I grant StudiRad permission to publish it. I understand that third-party content without explicit permission is strictly prohibited.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-brand-dark text-white font-black rounded-2xl hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                {loading ? "Processing Uploads..." : `Submit ${submissionType === 'file' ? files.length + ' File(s)' : 'Entry'} for Review`}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submission Successful!">
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce">
             <CheckCircle size={40} />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mb-3">Materials Sent!</h4>
          <p className="text-slate-500 mb-8 font-medium px-4">
            Your content has been queued for review. Once approved by our team, it will appear live in the StudiRad repository.
          </p>
          <button 
            onClick={() => setShowModal(false)}
            className="w-full py-4 bg-brand-dark text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary transition-all shadow-lg"
          >
            Got it
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SubmitMaterialPage;
