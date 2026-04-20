import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Clock, 
  DollarSign, 
  Layers, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  PlayCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Upload,
  X
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, adminAuth } from '../../firebase';
import SEO from '../../components/SEO';
import imageCompression from 'browser-image-compression';

interface Module {
  title: string;
  videoUrl: string;
  pdfUrl: string;
}

const AdminCreateCoursePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    category: '',
    duration: '',
    price: '',
    description: '',
    status: 'published'
  });

  const [modules, setModules] = useState<Module[]>([
    { title: '', videoUrl: '', pdfUrl: '' },
    { title: '', videoUrl: '', pdfUrl: '' },
    { title: '', videoUrl: '', pdfUrl: '' }
  ]);

  const [expandedModule, setExpandedModule] = useState<number | null>(0);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddModule = () => {
    if (modules.length < 6) {
      setModules([...modules, { title: '', videoUrl: '', pdfUrl: '' }]);
      setExpandedModule(modules.length);
    }
  };

  const handleRemoveModule = (index: number) => {
    if (modules.length > 3) {
      const newModules = modules.filter((_, i) => i !== index);
      setModules(newModules);
      if (expandedModule === index) setExpandedModule(null);
    }
  };

  const handleModuleChange = (index: number, field: keyof Module, value: string) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title || !formData.category || !formData.duration || !formData.price || !formData.description) {
      setError('Please fill in all required course details.');
      setLoading(false);
      return;
    }

    const invalidModules = modules.some(m => !m.title || !m.videoUrl);
    if (invalidModules) {
      setError('Each module must have a title and a video URL.');
      setLoading(false);
      return;
    }

    try {
      let thumbnailUrl = formData.thumbnail;

      if (imageFile) {
        let fileToUpload = imageFile;
        
        // Only attempt compression if the file is larger than 1MB to avoid library hangs on small files
        if (imageFile.size > 1024 * 1024) {
          const options = { 
            maxSizeMB: 0.8, 
            maxWidthOrHeight: 1200, 
            useWebWorker: true,
            initialQuality: 0.7 
          };
          try {
            fileToUpload = await imageCompression(imageFile, options);
          } catch (compError) {
            console.warn("Image compression failed, proceeding with original file.", compError);
            fileToUpload = imageFile;
          }
        }

        const imageRef = ref(storage, `courseThumbnails/${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`);
        const uploadResult = await uploadBytes(imageRef, fileToUpload);
        thumbnailUrl = await getDownloadURL(uploadResult.ref);
      }

      await addDoc(collection(db, 'courses'), {
        ...formData,
        thumbnail: thumbnailUrl,
        modules,
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/courses');
      }, 2000);
    } catch (err) {
      console.error("Error publishing course:", err);
      setError('Failed to publish course. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <SEO title="Create Course | Admin" description="Publish a new pre-recorded course on StudiRad" />
      
      <div className="container mx-auto max-w-4xl">
        <div className="mb-10">
          <Link to="/admin/courses" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-4 font-bold text-sm uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Courses
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Publish New Course</h1>
          <p className="text-slate-500 font-medium">Create a structured video course with 3-6 modules.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <CheckCircle2 size={20} /> Course published successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column: Course Details */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Layers size={20} className="text-brand-primary" /> Course Info
                </h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Course Title *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. MRI Physics & Instrumentation"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category *</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option value="X-ray">X-ray</option>
                      <option value="CT">CT</option>
                      <option value="MRI">MRI</option>
                      <option value="Ultrasound">Ultrasound</option>
                      <option value="Nuclear Medicine">Nuclear Medicine</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Price *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text"
                        required
                        placeholder="Free or ₦5,000"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full pl-10 pr-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Duration *</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text"
                      required
                      placeholder="e.g. 12 Hours Total"
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                      className="w-full pl-10 pr-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Course Thumbnail *</label>
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className={`w-full h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${imagePreview ? 'border-brand-primary' : 'border-slate-200 hover:border-brand-primary/50'}`}>
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => { setImageFile(null); setImagePreview(null); }}
                              className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-6">
                            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <Upload size={20} />
                            </div>
                            <p className="text-xs font-bold text-slate-400">Click to upload or drag and drop</p>
                            <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ImageIcon className="text-slate-400" size={16} />
                      </div>
                      <input 
                        type="url"
                        placeholder="Or paste image URL..."
                        value={formData.thumbnail}
                        onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                        className="w-full pl-10 pr-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <FileText size={20} className="text-brand-primary" /> Description
                </h3>
                <textarea 
                  required
                  rows={6}
                  placeholder="Detailed course description and objectives..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all resize-none"
                ></textarea>
              </div>
            </div>

            {/* Right Column: Modules */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <PlayCircle size={20} className="text-brand-primary" /> Course Modules
                  </h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {modules.length} / 6
                  </span>
                </div>

                <div className="space-y-4">
                  {modules.map((module, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                      <button
                        type="button"
                        onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-black">
                            {idx + 1}
                          </div>
                          <span className="font-bold text-slate-700 truncate max-w-[180px]">
                            {module.title || `Module ${idx + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {modules.length > 3 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveModule(idx);
                              }}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          {expandedModule === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </button>

                      {expandedModule === idx && (
                        <div className="p-6 bg-white space-y-4 border-t border-slate-50">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Module Title *</label>
                            <input 
                              type="text"
                              required
                              placeholder="e.g. Introduction to MRI"
                              value={module.title}
                              onChange={e => handleModuleChange(idx, 'title', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-sm transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Video URL (Google Drive) *</label>
                            <input 
                              type="url"
                              required
                              placeholder="https://drive.google.com/..."
                              value={module.videoUrl}
                              onChange={e => handleModuleChange(idx, 'videoUrl', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-sm transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Supplemental Material (PDF/Slides)</label>
                            <input 
                              type="url"
                              placeholder="https://drive.google.com/..."
                              value={module.pdfUrl}
                              onChange={e => handleModuleChange(idx, 'pdfUrl', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-sm transition-all"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {modules.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add Module
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-12 py-5 bg-brand-primary text-white rounded-2xl font-black flex items-center gap-3 hover:bg-brand-dark disabled:opacity-50 transition-all shadow-xl shadow-brand-primary/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Publish Course</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateCoursePage;
