import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Copy, 
  Check, 
  Send, 
  ExternalLink, 
  Sparkles, 
  RotateCcw, 
  Users, 
  CheckCircle2, 
  Info,
  AtSign
} from 'lucide-react';
import { CommunityGroup } from '../services/CommunityGroups';
import { 
  generateGroupInviteTemplate, 
  parseEmailList, 
  buildMailtoUrl, 
  buildGmailWebUrl 
} from '../services/groupInviteTemplate';

interface InviteGroupModalProps {
  group: CommunityGroup | null;
  isOpen: boolean;
  onClose: () => void;
  initialEmails?: string;
}

export const InviteGroupModal: React.FC<InviteGroupModalProps> = ({
  group,
  isOpen,
  onClose,
  initialEmails = ''
}) => {
  const [emailsInput, setEmailsInput] = useState(initialEmails);
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  // Initialize or reset template when group changes
  useEffect(() => {
    if (group) {
      const generated = generateGroupInviteTemplate({
        groupName: group.name,
        category: group.category,
        platform: group.platform,
        platformLink: group.platformLink,
        description: group.description,
        acceptedMembers: group.acceptedMembers,
        adminQualification: group.adminQualification,
        adminEmail: group.adminEmail
      });
      setCustomSubject(generated.subject);
      setCustomBody(generated.body);
      setEmailsInput(initialEmails || '');
      setIsCopied(false);
    }
  }, [group, initialEmails, isOpen]);

  if (!isOpen || !group) return null;

  const validEmails = parseEmailList(emailsInput);

  const handleResetTemplate = () => {
    const generated = generateGroupInviteTemplate({
      groupName: group.name,
      category: group.category,
      platform: group.platform,
      platformLink: group.platformLink,
      description: group.description,
      acceptedMembers: group.acceptedMembers,
      adminQualification: group.adminQualification,
      adminEmail: group.adminEmail
    });
    setCustomSubject(generated.subject);
    setCustomBody(generated.body);
  };

  const handleCopy = async () => {
    try {
      const fullInvite = `Subject: ${customSubject}\n\n${customBody}`;
      await navigator.clipboard.writeText(fullInvite);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  const handleOpenMailto = () => {
    const url = buildMailtoUrl(validEmails, customSubject, customBody);
    window.location.href = url;
  };

  const handleOpenGmail = () => {
    const url = buildGmailWebUrl(validEmails, customSubject, customBody);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#002147] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-white/10 text-amber-300">
              <Mail size={16} />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
              Email Invitation
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white line-clamp-1 pr-6">
            Invite Colleagues to "{group.name}"
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            Send a ready-made email invitation to students, colleagues, or study partners.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-gray-700">
          {/* Recipient Input */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AtSign size={14} className="text-[#002147]" />
                Invitee Email Addresses (Optional)
              </span>
              {validEmails.length > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {validEmails.length} recipient{validEmails.length > 1 ? 's' : ''} detected
                </span>
              )}
            </label>
            <input
              type="text"
              placeholder="e.g. colleague@hospital.org, radiographer@university.edu"
              value={emailsInput}
              onChange={(e) => setEmailsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Separate multiple emails with commas, semicolons, or spaces.
            </p>

            {/* Email chips */}
            {validEmails.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {validEmails.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#002147] text-[11px] font-medium border border-blue-100"
                  >
                    <span>{email}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Email Template Preview Box */}
          <div className="rounded-xl border border-gray-200 bg-slate-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  Invitation Email Template
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomize(!showCustomize)}
                  className="text-[11px] font-semibold text-[#002147] hover:underline"
                >
                  {showCustomize ? 'Simple View' : 'Customize Message'}
                </button>
                {showCustomize && (
                  <button
                    type="button"
                    onClick={handleResetTemplate}
                    title="Reset to default template"
                    className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors"
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <span className="text-[11px] font-bold text-gray-500 block mb-1">Subject:</span>
              {showCustomize ? (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#002147]"
                />
              ) : (
                <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-800">
                  {customSubject}
                </div>
              )}
            </div>

            {/* Message Body */}
            <div>
              <span className="text-[11px] font-bold text-gray-500 block mb-1">Message Body:</span>
              {showCustomize ? (
                <textarea
                  rows={8}
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md text-xs text-gray-800 font-mono leading-relaxed focus:outline-none focus:border-[#002147] resize-none"
                />
              ) : (
                <div className="max-h-48 overflow-y-auto p-3 bg-white border border-gray-200 rounded-md text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {customBody}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Guide */}
          <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-[#002147] flex items-center gap-2">
            <Info size={14} className="shrink-0 text-[#002147]" />
            <span>
              Tip: You can copy this template to paste into your personal email, WhatsApp broadcast, or launch directly in your email app.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isCopied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{isCopied ? 'Copied Template!' : 'Copy Template'}</span>
            </button>

            {/* Open in Gmail Web */}
            <button
              type="button"
              onClick={handleOpenGmail}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-all flex items-center gap-1.5 shadow-sm"
              title="Compose in Gmail Web in a new tab"
            >
              <ExternalLink size={13} className="text-red-600" />
              <span>Compose in Gmail</span>
            </button>

            {/* Launch Default Mail Client */}
            <button
              type="button"
              onClick={handleOpenMailto}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#002147] hover:bg-[#001733] text-white transition-all shadow-sm flex items-center gap-1.5"
              title="Open your device default email client"
            >
              <Send size={13} />
              <span>Send via Email App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteGroupModal;
