import React, { useState } from 'react';
import { X, Sparkles, Award, User, Mail, Building2, Send, CheckCircle2, AlertCircle, Loader2, Heart } from 'lucide-react';

interface NominateSpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NominateSpotlightModal: React.FC<NominateSpotlightModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nomineeName: '',
    category: 'Student of the Month',
    institution: '',
    nomineeEmail: '',
    achievements: '',
    impactStory: '',
    nominatorName: '',
    nominatorEmail: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomineeName || !formData.institution || !formData.achievements) {
      setError('Please fill in all required fields (Nominee Name, Institution, and Key Achievements).');
      return;
    }

    setLoading(true);
    setError(null);

    // Store in local storage for admin review or draft
    try {
      const existing = JSON.parse(localStorage.getItem('studirad_spotlight_nominations') || '[]');
      existing.unshift({
        ...formData,
        id: `nomination-${Date.now()}`,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('studirad_spotlight_nominations', JSON.stringify(existing));
    } catch (err) {
      console.warn('Could not save to localStorage:', err);
    }

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 400);
  };

  const handleReset = () => {
    setFormData({
      nomineeName: '',
      category: 'Student of the Month',
      institution: '',
      nomineeEmail: '',
      achievements: '',
      impactStory: '',
      nominatorName: '',
      nominatorEmail: ''
    });
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-brand-dark to-slate-900 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2 border border-amber-400/30">
            <Sparkles size={14} className="text-amber-400" /> Community Recognition
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            Nominate for Community Spotlight
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
            Celebrate a radiography student, intern, tutor, or clinical colleague who inspires others.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          {success ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Nomination Received! 🎉</h4>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you for celebrating excellence in our community! Our editorial team reviews nominations to select featured honorees.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white text-xs font-extrabold uppercase tracking-widest rounded-xl hover:bg-brand-primary/90 transition-colors shadow-md"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Nominee Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award size={14} className="text-brand-primary" /> Nominee Information
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nominee Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g., Jane Doe, Rad. Emmanuel"
                      value={formData.nomineeName}
                      onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Spotlight Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="Student of the Month">Student of the Month</option>
                      <option value="Radiographer of the Month">Radiographer of the Month</option>
                      <option value="Peer Mentor of the Month">Peer Mentor of the Month</option>
                      <option value="Innovator of the Month">Innovator / Researcher</option>
                      <option value="Community Champion">Community Champion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Institution / Hospital <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. UNTH, LUTH, ABUTH"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nominee Email or Social Handle (Optional)
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. email@example.com or @handle"
                      value={formData.nomineeEmail}
                      onChange={(e) => setFormData({ ...formData, nomineeEmail: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Key Achievements & Why They Deserve This <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe their contributions, clinical impact, mentoring efforts, or academic excellence..."
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  />
                </div>
              </div>

              {/* Nominator Details */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Heart size={14} className="text-rose-500" /> Your Info (Nominator)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name (optional)"
                      value={formData.nominatorName}
                      onChange={(e) => setFormData({ ...formData, nominatorName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email (optional)"
                      value={formData.nominatorEmail}
                      onChange={(e) => setFormData({ ...formData, nominatorEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-brand-primary/20 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Submit Nomination
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NominateSpotlightModal;
