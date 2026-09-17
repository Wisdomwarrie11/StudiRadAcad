import React, { useState } from 'react';
import { 
  X, 
  Users, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  AlertCircle, 
  Calendar,
  User,
  Globe2
} from 'lucide-react';
import { CommunityGroup, recordGroupJoin } from '../services/CommunityGroups';

interface JoinGroupModalProps {
  group: CommunityGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess: (groupId: string) => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp Group',
  telegram: 'Telegram Channel/Group',
  slack: 'Slack Workspace'
};

const MEMBERS_LABEL: Record<string, string> = {
  students: 'Radiography Students Only',
  professionals: 'Licensed Professionals Only',
  all: 'Open to All Radiographers & Students'
};

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  group,
  isOpen,
  onClose,
  onJoinSuccess
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!isOpen || !group) return null;

  const handleJoin = async () => {
    if (!agreedToTerms) {
      setHasError(true);
      return;
    }

    try {
      // Record join click count
      await recordGroupJoin(group.id);
      onJoinSuccess(group.id);

      // Open invite link
      window.open(group.platformLink, '_blank', 'noopener,noreferrer');
      onClose();
    } catch (err) {
      console.warn('Error recording join:', err);
      window.open(group.platformLink, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  const formattedDate = group.createdAt 
    ? new Date(group.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recently';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header in Oxford Blue */}
        <div className="bg-[#002147] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[#f59e0b] text-[11px] font-bold uppercase tracking-wider mb-2 border border-white/10">
            {group.category}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white pr-8">
            {group.name}
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            Platform: {PLATFORM_LABELS[group.platform] || group.platform}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-gray-700 text-xs sm:text-sm">
          {/* About Group */}
          <div>
            <h4 className="font-bold text-gray-900 mb-1.5 text-xs uppercase tracking-wider text-gray-500">
              Group Description
            </h4>
            <p className="p-4 bg-gray-50 border border-gray-200 rounded-xl leading-relaxed text-gray-700 whitespace-pre-wrap">
              {group.description}
            </p>
          </div>

          {/* Group Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
              <Users size={16} className="text-[#002147] shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-gray-500 font-medium">Eligible Members</span>
                <span className="font-bold text-gray-800 text-xs">
                  {MEMBERS_LABEL[group.acceptedMembers] || 'Open to All'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
              <User size={16} className="text-[#002147] shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-gray-500 font-medium">Group Lead Qualification</span>
                <span className="font-bold text-gray-800 text-xs">
                  {group.adminQualification}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
              <Calendar size={16} className="text-[#002147] shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-gray-500 font-medium">Date Created</span>
                <span className="font-bold text-gray-800 text-xs">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
              <Globe2 size={16} className="text-[#002147] shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-gray-500 font-medium">Current Community Joins</span>
                <span className="font-bold text-gray-800 text-xs">
                  {group.joinsCount || 0} members joined
                </span>
              </div>
            </div>
          </div>

          {/* Terms, Rules & Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <h5 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-amber-700" />
              Community Guidelines & Disclaimer
            </h5>
            <ul className="text-xs text-amber-900/90 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Members must maintain respect, courtesy, and professional medical ethics.</li>
              <li>Patient privacy is strictly protected: never share identifiable patient images or hospital records.</li>
              <li>No commercial spam, crypto offers, political broadcasts, or unrelated advertisements.</li>
              <li>StudiRad provides community indexing. Group administrators are responsible for managing internal discussions.</li>
            </ul>
          </div>

          {/* Agreement Checkbox */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => {
                  setAgreedToTerms(!agreedToTerms);
                  setHasError(false);
                }}
                className="text-[#002147] mt-0.5 shrink-0 focus:outline-none"
              >
                {agreedToTerms ? (
                  <CheckSquare size={18} className="text-[#002147]" />
                ) : (
                  <Square size={18} className="text-gray-400" />
                )}
              </button>
              <span 
                onClick={() => {
                  setAgreedToTerms(!agreedToTerms);
                  setHasError(false);
                }}
                className="text-xs text-gray-700 font-medium leading-normal"
              >
                I have read and confirm the StudiRad Community Rules & Disclaimers, and I agree to uphold these standards upon joining.
              </span>
            </label>

            {hasError && !agreedToTerms && (
              <p className="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle size={14} />
                Please confirm your agreement to proceed.
              </p>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleJoin}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
              agreedToTerms 
                ? 'bg-[#002147] hover:bg-[#001733] text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Proceed to {PLATFORM_LABELS[group.platform]?.split(' ')[0] || 'Group'}</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupModal;
