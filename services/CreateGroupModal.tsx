import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  ShieldCheck, 
  Link as LinkIcon, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { 
  CommunityGroup, 
  GroupCategory, 
  AcceptedMembersType, 
  PlatformType, 
  createCommunityGroup, 
  updateCommunityGroup, 
  getAdminGroupsCount, 
  isGroupNameTaken, 
  isValidPlatformLink 
} from '../services/CommunityGroups';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingGroup?: CommunityGroup | null;
  defaultAdminEmail?: string;
}

const CATEGORIES: GroupCategory[] = [
  'Research',
  'Exams (International or Local)',
  'Scholarships',
  'Jobs',
  'Internships',
  'Outreach',
  'Networking'
];

const QUALIFICATIONS = [
  'Undergraduate Radiography Student',
  'Intern / Fresh Graduate',
  'Postgraduate / M.Sc. Student',
  'Ph.D. Scholar / Fellow',
  'Practicing Diagnostic Radiographer',
  'Therapy Radiographer / Radiation Therapist',
  'Sonographer / Ultrasound Specialist',
  'CT / MRI Senior Specialist',
  'Academic Lecturer / Professor',
  'Department Head / Chief Radiographer'
];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingGroup = null,
  defaultAdminEmail = ''
}) => {
  const isEditing = Boolean(editingGroup);

  const [category, setCategory] = useState<GroupCategory>('Research');
  const [name, setName] = useState('');
  const [adminEmail, setAdminEmail] = useState(defaultAdminEmail);
  const [adminPhone, setAdminPhone] = useState('');
  const [adminQualification, setAdminQualification] = useState('');
  const [description, setDescription] = useState('');
  const [acceptedMembers, setAcceptedMembers] = useState<AcceptedMembersType>('all');
  const [platform, setPlatform] = useState<PlatformType>('whatsapp');
  const [platformLink, setPlatformLink] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailGroupCount, setEmailGroupCount] = useState<number | null>(null);

  // Populate fields if editing
  useEffect(() => {
    if (editingGroup) {
      setCategory(editingGroup.category);
      setName(editingGroup.name);
      setAdminEmail(editingGroup.adminEmail);
      setAdminPhone(editingGroup.adminPhone);
      setAdminQualification(editingGroup.adminQualification);
      setDescription(editingGroup.description);
      setAcceptedMembers(editingGroup.acceptedMembers);
      setPlatform(editingGroup.platform);
      setPlatformLink(editingGroup.platformLink);
      setAgreedToTerms(true);
    } else {
      setCategory('Research');
      setName('');
      setAdminEmail(defaultAdminEmail || '');
      setAdminPhone('');
      setAdminQualification('');
      setDescription('');
      setAcceptedMembers('all');
      setPlatform('whatsapp');
      setPlatformLink('');
      setAgreedToTerms(false);
    }
    setErrorMessage(null);
  }, [editingGroup, defaultAdminEmail, isOpen]);

  // Check admin email limits
  const handleEmailBlur = async () => {
    if (!adminEmail.trim() || isEditing) return;
    try {
      const count = await getAdminGroupsCount(adminEmail);
      setEmailGroupCount(count);
      if (count >= 2) {
        setErrorMessage('This email has already created the maximum limit of 2 groups. You cannot create more groups.');
      } else {
        setErrorMessage(null);
      }
    } catch (e) {
      // ignore
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!name.trim()) {
      setErrorMessage('Please provide a unique group name.');
      return;
    }

    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address for the group administrator.');
      return;
    }

    if (!adminPhone.trim()) {
      setErrorMessage('Please enter an active contact phone number.');
      return;
    }

    if (!adminQualification) {
      setErrorMessage('Please select your professional or student qualification.');
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      setErrorMessage('Please provide a clear description of the group (at least 20 characters).');
      return;
    }

    if (!platformLink.trim()) {
      setErrorMessage('Please provide the group invite link.');
      return;
    }

    if (!isValidPlatformLink(platform, platformLink)) {
      setErrorMessage(
        platform === 'whatsapp' 
          ? 'Link must be a valid WhatsApp invite (e.g. chat.whatsapp.com/... or wa.me/...)'
          : platform === 'telegram'
          ? 'Link must be a valid Telegram link (e.g. t.me/...)'
          : 'Link must be a valid Slack invite link (e.g. join.slack.com/...)'
      );
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please confirm that you agree to the StudiRad Community Rules & Regulations.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && editingGroup) {
        const result = await updateCommunityGroup(editingGroup.id, {
          name: name.trim(),
          category,
          adminPhone: adminPhone.trim(),
          adminQualification,
          description: description.trim(),
          acceptedMembers,
          platform,
          platformLink: platformLink.trim()
        });

        if (!result.success) {
          setErrorMessage(result.error || 'Failed to update group.');
          setIsSubmitting(false);
          return;
        }
      } else {
        const result = await createCommunityGroup({
          name: name.trim(),
          category,
          adminEmail: adminEmail.trim(),
          adminPhone: adminPhone.trim(),
          adminQualification,
          description: description.trim(),
          acceptedMembers,
          platform,
          platformLink: platformLink.trim()
        });

        if (!result.success) {
          setErrorMessage(result.error || 'Failed to create group.');
          setIsSubmitting(false);
          return;
        }

        // Store creator email locally so user easily finds their groups
        try {
          const myEmails = JSON.parse(localStorage.getItem('studirad_creator_emails') || '[]');
          if (!myEmails.includes(adminEmail.trim().toLowerCase())) {
            myEmails.push(adminEmail.trim().toLowerCase());
            localStorage.setItem('studirad_creator_emails', JSON.stringify(myEmails));
          }
        } catch (e) {}
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#002147] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            {isEditing ? 'Edit Community Group' : 'Create a Community Group'}
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            {isEditing 
              ? 'Update your group information and invite links.' 
              : 'Create a dedicated space for radiography students and practitioners (Max 2 groups per creator).'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isEditing && emailGroupCount !== null && emailGroupCount < 2 && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-[#002147] flex items-center gap-2">
              <Info size={15} />
              <span>You have created {emailGroupCount} of 2 allowable groups.</span>
            </div>
          )}

          <form id="group-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Category and Group Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GroupCategory)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Unique Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Radiography Research Club"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                />
              </div>
            </div>

            {/* Admin Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Admin Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  disabled={isEditing}
                  placeholder="your.email@example.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147] disabled:bg-gray-100 disabled:text-gray-500"
                />
                {!isEditing && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Used to track your 2-group limit and manage updates.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Admin Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+234 ... or local format"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                />
              </div>
            </div>

            {/* Admin Qualification & Accepted Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Admin Qualification <span className="text-red-500">*</span>
                </label>
                <select
                  value={adminQualification}
                  onChange={(e) => setAdminQualification(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                >
                  <option value="">-- Choose qualification --</option>
                  {QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Accepted Members <span className="text-red-500">*</span>
                </label>
                <select
                  value={acceptedMembers}
                  onChange={(e) => setAcceptedMembers(e.target.value as AcceptedMembersType)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                >
                  <option value="all">Open to All (Students & Professionals)</option>
                  <option value="students">Students Only</option>
                  <option value="professionals">Licensed Professionals Only</option>
                </select>
              </div>
            </div>

            {/* Platform and Link */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Platform <span className="text-red-500">*</span>
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as PlatformType)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="slack">Slack</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon size={14} className="text-gray-500" />
                  Invite Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder={
                    platform === 'whatsapp' 
                      ? 'https://chat.whatsapp.com/...' 
                      : platform === 'telegram'
                      ? 'https://t.me/...'
                      : 'https://join.slack.com/...'
                  }
                  value={platformLink}
                  onChange={(e) => setPlatformLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Group Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe what members will learn, discuss, share, or collaborate on..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147] resize-none"
              />
            </div>

            {/* Rules and Regulations / Terms & Conditions */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <h5 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-amber-700" />
                Group Creator Agreement & StudiRad Values
              </h5>
              <p className="text-xs text-amber-900/90 leading-relaxed mb-3">
                By creating a group on StudiRad, you pledge that this group is purely dedicated to advancing the education, practice, and ethics of Radiography. You agree not to use the group for illegal activities, exam malpractice, commercial scams, or unmoderated spam.
              </p>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className="text-[#002147] mt-0.5 shrink-0 focus:outline-none"
                >
                  {agreedToTerms ? (
                    <CheckSquare size={18} className="text-[#002147]" />
                  ) : (
                    <Square size={18} className="text-gray-400" />
                  )}
                </button>
                <span 
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className="text-xs text-gray-800 font-medium leading-normal"
                >
                  I have read and confirm that the purpose of this group aligns strictly with the values of StudiRad.
                </span>
              </label>
            </div>

            {!isEditing && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-center gap-2">
                <Info size={15} className="text-[#002147] shrink-0" />
                <span>
                  Notice: Once created, your group will be queued for StudiRad Admin approval and published immediately upon review.
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="group-form"
            disabled={isSubmitting || !agreedToTerms}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
              agreedToTerms && !isSubmitting
                ? 'bg-[#002147] hover:bg-[#001733] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{isSubmitting ? 'Submitting...' : isEditing ? 'Save Changes' : 'Submit for Approval'}</span>
            <CheckCircle2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
