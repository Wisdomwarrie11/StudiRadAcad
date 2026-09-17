import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CommunityGroup, reportGroup } from '../services/CommunityGroups';

interface FlagGroupModalProps {
  group: CommunityGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onReportSuccess: () => void;
}

const FLAG_REASONS = [
  'Inappropriate or offensive content',
  'Commercial spam, advertising, or scams',
  'Broken or expired invite link',
  'Misleading group description or off-topic',
  'Violation of patient privacy or academic ethics',
  'Other issue'
];

export const FlagGroupModal: React.FC<FlagGroupModalProps> = ({
  group,
  isOpen,
  onClose,
  onReportSuccess
}) => {
  const [reason, setReason] = useState(FLAG_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !group) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await reportGroup(group.id, reason, details);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onReportSuccess();
          onClose();
        }, 1500);
      } else {
        setError(res.error || 'Failed to submit report.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-amber-600 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Flag size={18} />
            <h3 className="text-lg font-bold text-white">
              Report Community Group
            </h3>
          </div>
          <p className="text-xs text-amber-100">
            {group.name}
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="font-bold text-gray-900 text-base mb-1">Report Received</h4>
            <p className="text-xs text-gray-600">
              Thank you for helping keep the StudiRad community clean and safe. Our team will review this report.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Why are you reporting this group?
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-amber-600"
              >
                {FLAG_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Provide any context that will help us investigate..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-amber-600 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FlagGroupModal;
