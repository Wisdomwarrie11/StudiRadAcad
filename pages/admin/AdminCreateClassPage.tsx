import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Calendar, 
  DollarSign, 
  Layers, 
  Users, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Monitor,
  MessageCircle,
  Video,
  Upload,
  X
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, adminAuth } from '../../firebase';
import SEO from '../../components/SEO';
import imageCompression from 'browser-image-compression';

const AdminCreateClassPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
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
    technologies: [] as string[],
    minStudents: '',
    maxStudents: '',
    status: 'ongoing',
    level: 'Beginner',
    registrationLink: '',
    isPaid: false
  });

  const techOptions = [
    { id: 'google-meet', name: 'Google Meet', icon: <Video size={16} /> },
    { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle size={16} /> },
    { id: 'google-classroom', name: 'Google Classroom', icon: <Monitor size={16} /> },
    { id: 'zoom', name: 'Zoom', icon: <Video size={16} /> }
  ];

  useEffect(() => {
    const unsubscribeAuth = adminAuth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });

    if (isEdit) {
      const fetchClass = async () => {
        try {
          const docRef = doc(db, 'classes', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              title: data.title || '',
              thumbnail: data.thumbnail || '',
              category: data.category || '',
              duration: data.duration || '',
              price: data.price || '',
              description: data.description || '',
              technologies: data.technologies || [],
              minStudents: data.minStudents?.toString() || '',
              maxStudents: data.maxStudents?.toString() || '',
              status: data.status || 'ongoing',
              level: data.level || 'Beginner',
              registrationLink: data.registrationLink || '',
              isPaid: data.price !== 'Free'
            });
            if (data.thumbnail) {
              setImagePreview(data.thumbnail);
            }
          } else {
            setError('Class not found');
            navigate('/admin/classes');
          }
        } catch (err) {
          console.error("Error fetching class:", err);
          setError('Failed to load class details.');
        } finally {
          setFetching(false);
        }
      };
      fetchClass();
    }

    return () => unsubscribeAuth();
  }, [navigate, id, isEdit]);

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

  const handleTechToggle = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title || !formData.category || !formData.duration || !formData.description) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (formData.isPaid && !formData.price) {
      setError('Please specify the price for paid classes.');
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

        const imageRef = ref(storage, `classThumbnails/${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`);
        const uploadResult = await uploadBytes(imageRef, fileToUpload);
        thumbnailUrl = await getDownloadURL(uploadResult.ref);
      }

      const classData = {
        ...formData,
        price: formData.isPaid ? formData.price : 'Free',
        thumbnail: thumbnailUrl,
        minStudents: formData.minStudents ? parseInt(formData.minStudents) : null,
        maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : null,
        updatedAt: serverTimestamp()
      };

      if (isEdit) {
        await updateDoc(doc(db, 'classes', id), classData);
      } else {
        await addDoc(collection(db, 'classes'), {
          ...classData,
          createdAt: serverTimestamp()
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/classes');
      }, 2000);
    } catch (err) {
      console.error("Error saving class:", err);
      setError(`Failed to ${isEdit ? 'update' : 'publish'} class. Please try again.`);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <SEO title="Create Class | Admin" description="Publish a new live/cohort class on StudiRad" />
      
      <div className="container mx-auto max-w-4xl">
        <div className="mb-10">
          <Link to="/admin/classes" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-4 font-bold text-sm uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Classes
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{isEdit ? 'Edit' : 'Publish New'} Class</h1>
          <p className="text-slate-500 font-medium tracking-tight">{isEdit ? 'Update existing' : 'Fill in the details below to list a new'} live or cohort-based class.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <CheckCircle2 size={20} /> Class published successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Layers size={20} className="text-brand-primary" /> Basic Info
                  </h3>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, status: 'ongoing'})}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.status === 'ongoing' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400'}`}
                    >
                      Ongoing
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, status: 'coming-soon'})}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.status === 'coming-soon' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-400'}`}
                    >
                      Soon
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Class Title *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Advanced CT Protocols Masterclass"
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
                      <option value="">Select</option>
                      <option value="X-ray">X-ray</option>
                      <option value="CT">CT</option>
                      <option value="MRI">MRI</option>
                      <option value="Ultrasound">Ultrasound</option>
                      <option value="Nuclear Medicine">Nuclear Medicine</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Level *</label>
                    <select 
                      required
                      value={formData.level}
                      onChange={e => setFormData({...formData, level: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all appearance-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pricing Model:</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          checked={!formData.isPaid}
                          onChange={() => setFormData({...formData, isPaid: false, price: 'Free'})}
                          className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Free</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          checked={formData.isPaid}
                          onChange={() => setFormData({...formData, isPaid: true, price: ''})}
                          className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Paid</span>
                      </label>
                    </div>
                  </div>
                  
                  {formData.isPaid && (
                    <div className="space-y-2 mt-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount (e.g. ₦15,000)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text"
                          required={formData.isPaid}
                          placeholder="₦0,000"
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: e.target.value})}
                          className="w-full pl-10 pr-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {formData.status === 'coming-soon' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registration Link (Optional)</label>
                    <input 
                      type="url"
                      placeholder="https://..."
                      value={formData.registrationLink}
                      onChange={e => setFormData({...formData, registrationLink: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Duration / Schedule *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text"
                      required
                      placeholder="e.g. 4 Weeks (Saturdays 10AM)"
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                      className="w-full pl-10 pr-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 transition-all duration-500 ${formData.status === 'coming-soon' ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Monitor size={20} className="text-brand-primary" /> Technologies Used
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {techOptions.map(tech => (
                    <button
                      key={tech.id}
                      type="button"
                      disabled={formData.status === 'coming-soon'}
                      onClick={() => handleTechToggle(tech.name)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all font-bold text-sm ${
                        formData.technologies.includes(tech.name)
                          ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                          : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {tech.icon} {tech.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <ImageIcon size={20} className="text-brand-primary" /> Media & Description
                </h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Class Thumbnail *</label>
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
                            <p className="text-xs font-bold text-slate-400">Click to upload or drag</p>
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

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Objectives / Description *</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="What will students learn? What is the class about?"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 transition-all duration-500 ${formData.status === 'coming-soon' ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Users size={20} className="text-brand-primary" /> Student Capacity
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Min Students</label>
                    <input 
                      type="number"
                      placeholder="e.g. 5"
                      value={formData.minStudents}
                      onChange={e => setFormData({...formData, minStudents: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Max Students</label>
                    <input 
                      type="number"
                      placeholder="e.g. 30"
                      value={formData.maxStudents}
                      onChange={e => setFormData({...formData, maxStudents: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button 
              type="submit"
              disabled={loading}
              className="px-12 py-5 bg-brand-primary text-white rounded-2xl font-black flex items-center gap-3 hover:bg-brand-dark disabled:opacity-50 transition-all shadow-xl shadow-brand-primary/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {isEdit ? 'Update Class' : (formData.status === 'coming-soon' ? 'Announce Class' : 'Publish Class')}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateClassPage;
