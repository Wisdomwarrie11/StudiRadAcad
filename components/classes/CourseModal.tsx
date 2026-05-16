import React from 'react';
import Modal from '../ui/Modal';
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Monitor, 
  MessageCircle, 
  Video,
  X,
  ArrowRight,
  Users,
  Bell
} from 'lucide-react';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any | null;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course }) => {
  if (!course) return null;

  const isLiveClass = !course.modules || course.modules.length === 0;
  const isComingSoon = course.status === 'coming-soon';

  const handleActionClick = () => {
    if (isComingSoon && course.registrationLink) {
      window.open(course.registrationLink, '_blank');
    } else if (!isComingSoon) {
      // Standard enrollment logic - currently just a placeholder
      console.log("Enroll in:", course.title);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header Image */}
        <div className="relative h-64 w-full">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
              {isComingSoon ? <Bell size={64} className="animate-pulse" /> : (isLiveClass ? <Video size={64} /> : <PlayCircle size={64} />)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-6 left-8 right-8">
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-brand-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                {course.category}
              </span>
              {isComingSoon && (
                <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
                  Coming Soon
                </span>
              )}
              {course.level && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {course.level}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">{course.title}</h2>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl text-center">
              <Clock className="mx-auto mb-2 text-brand-primary" size={20} />
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
              <span className="font-black text-slate-900 text-xs">{course.duration}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-center">
              {isLiveClass ? (
                <Users className="mx-auto mb-2 text-brand-primary" size={20} />
              ) : (
                <BookOpen className="mx-auto mb-2 text-brand-primary" size={20} />
              )}
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {isLiveClass ? 'Capacity' : 'Modules'}
              </span>
              <span className="font-black text-slate-900 text-xs">
                {isLiveClass ? (course.maxStudents || 'Unlimited') : (course.modules?.length || 0)}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-center">
              <CheckCircle2 className="mx-auto mb-2 text-brand-primary" size={20} />
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</span>
              <span className={`font-black text-xs ${isComingSoon ? 'text-amber-500' : 'text-slate-900'}`}>
                {course.price}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">About this {isComingSoon ? 'Announcement' : (isLiveClass ? 'Class' : 'Course')}</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Registration Info for Coming Soon */}
          {isComingSoon && (
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
              <h4 className="text-sm font-black text-amber-700 uppercase tracking-widest flex items-center gap-2">
                <Bell size={16} /> Get Notified
              </h4>
              <p className="text-xs font-semibold text-amber-600 leading-relaxed">
                This course is currently in preparation. Register interest to receive early access and launch discounts!
              </p>
            </div>
          )}

          {/* Technologies (for Live Classes) */}
          {isLiveClass && course.technologies && course.technologies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Technologies Used</h3>
              <div className="flex flex-wrap gap-3">
                {course.technologies.map((tech: string) => (
                  <div key={tech} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                    {tech.toLowerCase().includes('meet') && <Video size={14} className="text-blue-500" />}
                    {tech.toLowerCase().includes('whatsapp') && <MessageCircle size={14} className="text-green-500" />}
                    {tech.toLowerCase().includes('classroom') && <Monitor size={14} className="text-emerald-500" />}
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modules (for Pre-recorded Courses) */}
          {!isLiveClass && course.modules && course.modules.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Course Curriculum</h3>
              <div className="space-y-3">
                {course.modules.map((module: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-xs text-brand-primary shadow-sm">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-slate-700">{module.title}</span>
                    </div>
                    <PlayCircle size={18} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={handleActionClick}
            className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl ${
              isComingSoon 
                ? (course.registrationLink ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none')
                : 'bg-brand-primary text-white hover:bg-brand-dark shadow-brand-primary/20'
            }`}
          >
            {isComingSoon ? (course.registrationLink ? 'Register Interest' : 'Coming Soon') : 'Enroll Now'} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CourseModal;
