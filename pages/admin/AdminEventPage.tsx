
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../../firebase';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Clock, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { addEvent, getEvents, deleteEvent, EventData, updateEventStatus } from '../../services/eventService';
import { Timestamp } from 'firebase/firestore';

const AdminEventsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    imageUrl: '',
    link: '',
    type: 'webinar' as 'webinar' | 'event',
    status: 'upcoming' as 'upcoming' | 'past'
  });

  useEffect(() => {
    const unsubscribe = adminAuth.onAuthStateChanged((user) => {
      if (!user) navigate("/admin/login");
    });
    fetchEvents();
    return () => unsubscribe();
  }, [navigate]);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await getEvents();
    setEvents(data);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate image URL roughly
      if (formData.imageUrl && !formData.imageUrl.startsWith('http')) {
         throw new Error("Please provide a valid image URL (starting with http/https)");
      }

      const eventData = {
        ...formData,
        eventDate: Timestamp.fromDate(new Date(formData.date))
      };

      const result = await addEvent(eventData);
      if (result.success) {
        setSuccess('Event added successfully!');
        setFormData({
          title: '',
          description: '',
          date: '',
          imageUrl: '',
          link: '',
          type: 'webinar',
          status: 'upcoming'
        });
        fetchEvents();
      } else {
        setError(result.error || 'Failed to add event');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const result = await deleteEvent(id);
      if (result.success) fetchEvents();
    }
  };

  const toggleStatus = async (id: string, currentStatus: 'upcoming' | 'past') => {
    const newStatus = currentStatus === 'upcoming' ? 'past' : 'upcoming';
    const result = await updateEventStatus(id, newStatus);
    if (result.success) fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="flex items-center gap-4 mb-8">
           <button 
             onClick={() => navigate("/admin/dashboard")}
             className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
           >
             <ChevronLeft size={20} />
           </button>
           <h1 className="text-3xl font-black text-slate-900">Manage Webinars & Events</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Add Event Form */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                      <Plus size={20} />
                   </div>
                   <h2 className="text-xl font-bold">Add New Entry</h2>
                </div>

                {success && (
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2 text-sm font-bold">
                    <CheckCircle2 size={18} /> {success}
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-2 text-sm font-bold">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                      <input 
                        type="text" required name="title"
                        value={formData.title} onChange={handleInputChange}
                        placeholder="e.g. Navigating Radiography Internships"
                        className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 font-bold text-sm"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                        <select 
                          name="type" value={formData.type} onChange={handleInputChange}
                          className="w-full p-3.5 rounded-xl border border-slate-200 bg-white font-bold text-sm"
                        >
                           <option value="webinar">Webinar</option>
                           <option value="event">Event</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                        <select 
                          name="status" value={formData.status} onChange={handleInputChange}
                          className="w-full p-3.5 rounded-xl border border-slate-200 bg-white font-bold text-sm"
                        >
                           <option value="upcoming">Upcoming</option>
                           <option value="past">Past (Archive)</option>
                        </select>
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date & Time</label>
                      <input 
                        type="datetime-local" required name="date"
                        value={formData.date} onChange={handleInputChange}
                        className="w-full p-3.5 rounded-xl border border-slate-200 font-bold text-sm"
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                      <input 
                        type="url" required name="imageUrl"
                        value={formData.imageUrl} onChange={handleInputChange}
                        placeholder="https://..."
                        className="w-full p-3.5 rounded-xl border border-slate-200 font-bold text-sm"
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Link (Registration/Watch)</label>
                      <input 
                        type="url" name="link"
                        value={formData.link} onChange={handleInputChange}
                        placeholder="https://..."
                        className="w-full p-3.5 rounded-xl border border-slate-200 font-bold text-sm"
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        rows={4} required name="description"
                        value={formData.description} onChange={handleInputChange}
                        placeholder="Brief summary of the session..."
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 font-medium text-sm leading-relaxed"
                      />
                   </div>

                   <button 
                     type="submit" disabled={submitting}
                     className="w-full py-4 bg-brand-primary text-white rounded-xl font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all disabled:opacity-50 active:scale-95"
                   >
                     {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Push to Live"}
                   </button>
                </form>
             </div>
          </div>

          {/* List of Events */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                   Live Database <span className="text-sm font-normal text-slate-400">({events.length} entries)</span>
                </h3>
             </div>

             {loading ? (
                <div className="flex justify-center py-20">
                   <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                </div>
             ) : events.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
                   <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
                   <p className="text-slate-500 font-bold">No webinars or events published yet.</p>
                </div>
             ) : (
                <div className="grid md:grid-cols-1 gap-4">
                   {events.map((event) => (
                      <div key={event.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 relative group">
                         <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                               <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${event.type === 'webinar' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                  {event.type}
                               </span>
                               <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${event.status === 'upcoming' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                  {event.status}
                               </span>
                            </div>
                            <h4 className="text-lg font-black text-slate-900 group-hover:text-brand-primary transition-colors">{event.title}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                               <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(event.eventDate.toDate()).toLocaleDateString()}</span>
                               <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(event.eventDate.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                         </div>
                         <div className="flex flex-col gap-2 justify-center">
                            <button 
                               onClick={() => toggleStatus(event.id!, event.status)}
                               className="p-3 bg-slate-50 hover:bg-brand-primary hover:text-white rounded-xl transition-all text-xs font-bold"
                            >
                               Mark {event.status === 'upcoming' ? 'Past' : 'Upcoming'}
                            </button>
                            <button 
                               onClick={() => handleDelete(event.id!)}
                               className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                            >
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;
