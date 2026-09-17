import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PlusCircle, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Bell, 
  ExternalLink,
  MessageSquare,
  MessageCircle,
  Sparkles,
  BookOpen,
  Briefcase,
  GraduationCap,
  Globe,
  Radio
} from 'lucide-react';
import SEO from '../components/SEO';
import GroupCard from '../services/Groupcard';
import JoinGroupModal from '../services/JoinGroupModal';
import CreateGroupModal from '../services/CreateGroupModal';
import FlagGroupModal from '../services/FlagGroupModal';
import { 
  CommunityGroup, 
  GroupCategory, 
  getApprovedGroups, 
  getGroupsByAdminEmail, 
  deleteCommunityGroup,
  getAllGroupsForAdmin
} from '../services/CommunityGroups';
import { adminAuth } from '../firebase';
import { Link } from 'react-router-dom';

const CATEGORIES: { label: string; value: string; icon?: any }[] = [
  { label: 'All Groups', value: 'All' },
  { label: 'Research', value: 'Research' },
  { label: 'Exams (International/Local)', value: 'Exams (International or Local)' },
  { label: 'Scholarships', value: 'Scholarships' },
  { label: 'Jobs', value: 'Jobs' },
  { label: 'Internships', value: 'Internships' },
  { label: 'Outreach', value: 'Outreach' },
  { label: 'Networking', value: 'Networking' }
];

export const CommunityPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  
  const [activeTab, setActiveTab] = useState<'explore' | 'my-groups'>('explore');

  // Groups state
  const [approvedGroups, setApprovedGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // My Groups state
  const [creatorEmail, setCreatorEmail] = useState('');
  const [myGroups, setMyGroups] = useState<CommunityGroup[]>([]);
  const [loadingMyGroups, setLoadingMyGroups] = useState(false);

  // StudiRad Admin state
  const [isStudiRadAdmin, setIsStudiRadAdmin] = useState(false);
  const [pendingAdminGroupsCount, setPendingAdminGroupsCount] = useState(0);

  // Modals state
  const [activeModalGroup, setActiveModalGroup] = useState<CommunityGroup | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CommunityGroup | null>(null);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState<CommunityGroup | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load initial approved groups
  const loadApprovedGroups = async (category: string = selectedCategory) => {
    setLoading(true);
    try {
      const list = await getApprovedGroups(category);
      setApprovedGroups(list);
    } catch (err) {
      console.error('Error loading approved groups:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check admin status and pending queue
  useEffect(() => {
    const unsub = adminAuth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsStudiRadAdmin(true);
        try {
          const all = await getAllGroupsForAdmin();
          const pending = all.filter(g => g.status === 'pending');
          setPendingAdminGroupsCount(pending.length);
        } catch (e) {
          // ignore
        }
      } else {
        setIsStudiRadAdmin(false);
      }
    });

    // Load stored creator email if exists
    try {
      const storedEmails = JSON.parse(localStorage.getItem('studirad_creator_emails') || '[]');
      if (storedEmails.length > 0) {
        setCreatorEmail(storedEmails[0]);
      }
    } catch (e) {}

    return () => unsub();
  }, []);

  useEffect(() => {
    loadApprovedGroups(selectedCategory);
  }, [selectedCategory]);

  // Load My Groups when switching to my-groups tab or changing email
  useEffect(() => {
    if (activeTab === 'my-groups' && creatorEmail.trim()) {
      handleFetchMyGroups();
    }
  }, [activeTab, creatorEmail]);

  const handleFetchMyGroups = async () => {
    if (!creatorEmail.trim()) return;
    setLoadingMyGroups(true);
    try {
      const list = await getGroupsByAdminEmail(creatorEmail);
      setMyGroups(list);
    } catch (err) {
      console.error('Error fetching my groups:', err);
    } finally {
      setLoadingMyGroups(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleJoinClick = (group: CommunityGroup) => {
    setActiveModalGroup(group);
    setIsJoinModalOpen(true);
  };

  const handleFlagClick = (group: CommunityGroup) => {
    setActiveModalGroup(group);
    setIsFlagModalOpen(true);
  };

  const handleEditClick = (group: CommunityGroup) => {
    setEditingGroup(group);
    setIsCreateModalOpen(true);
  };

  const handleDeleteGroup = async () => {
    if (!deleteConfirmGroup) return;
    try {
      await deleteCommunityGroup(deleteConfirmGroup.id);
      showToast(`Group "${deleteConfirmGroup.name}" has been deleted.`);
      setDeleteConfirmGroup(null);
      loadApprovedGroups();
      if (creatorEmail) handleFetchMyGroups();
    } catch (err) {
      alert('Failed to delete group. Please try again.');
    }
  };

  const handleJoinSuccess = (groupId: string) => {
    // Increment local counter
    setApprovedGroups(prev => prev.map(g => g.id === groupId ? { ...g, joinsCount: (g.joinsCount || 0) + 1 } : g));
  };

  // Filter groups
  const filteredGroups = approvedGroups.filter(g => {
    const matchesSearch = 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = selectedPlatform === 'all' || g.platform === selectedPlatform;
    const matchesAudience = selectedAudience === 'all' || g.acceptedMembers === selectedAudience || g.acceptedMembers === 'all';

    return matchesSearch && matchesPlatform && matchesAudience;
  });

  const totalMembersJoined = approvedGroups.reduce((acc, g) => acc + (g.joinsCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SEO 
        title="Community Groups"
        description="Join verified Radiography community groups for research, exams, scholarships, jobs, internships, outreach, and professional networking."
      />

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#003947] text-white rounded-2xl shadow-xl flex items-center gap-3 border border-blue-800 animate-fadeIn">
          <CheckCircle2 size={20} className="text-[#f59e0b] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Hero Header in Oxford Blue */}
      <section className="bg-[#003247] text-white pt-28 pb-14 px-4 sm:px-6 lg:px-8 border-b border-blue-900">
        <div className="max-w-6xl mx-auto">
          {/* Admin trigger notification banner */}
          {isStudiRadAdmin && pendingAdminGroupsCount > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Bell size={18} className="text-[#f59e0b] animate-bounce shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  Admin Trigger: {pendingAdminGroupsCount} group{pendingAdminGroupsCount > 1 ? 's' : ''} submitted and awaiting your approval.
                </span>
              </div>
              <Link
                to="/admin/groups"
                className="px-4 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-[#002147] font-extrabold text-xs transition-colors self-start sm:self-auto"
              >
                Review Groups
              </Link>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#f59e0b] text-xs font-bold uppercase tracking-wider mb-3 border border-white/10">
                StudiRad Hub
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Radiography Community Groups
              </h1>
              <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
                Connect directly with fellow radiographers, students, and tutors across research, licensing exams, scholarships, jobs, internships, outreach, and networking.
              </p>
            </div>

            {/* Action Buttons: Join Official Community & Create Group */}
            <div className="flex flex-wrap items-center gap-3">
           

              <button
                onClick={() => {
                  setEditingGroup(null);
                  setIsCreateModalOpen(true);
                }}
                className="px-5 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#002147] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <PlusCircle size={17} />
                <span>Create a Group</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 pt-8 border-t border-white/10 text-center sm:text-left">
            <div>
              <span className="text-xs text-blue-200 font-semibold block">Active Groups</span>
              <span className="text-xl sm:text-2xl font-black text-white">{approvedGroups.length}</span>
            </div>
            <div>
              <span className="text-xs text-blue-200 font-semibold block">Disciplines</span>
              <span className="text-xl sm:text-2xl font-black text-white">7 Categories</span>
            </div>
            <div>
              <span className="text-xs text-blue-200 font-semibold block">Community Joins</span>
              <span className="text-xl sm:text-2xl font-black text-[#f59e0b]">
                {totalMembersJoined > 0 ? `${totalMembersJoined}+` : 0}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Tabs: Explore vs My Groups */}
        <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'explore'
                ? 'bg-[#002147] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#002147] hover:bg-gray-100'
            }`}
          >
            <Users size={15} />
            <span>Explore Groups</span>
          </button>

          <button
            onClick={() => setActiveTab('my-groups')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'my-groups'
                ? 'bg-[#002147] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#002147] hover:bg-gray-100'
            }`}
          >
            <ShieldCheck size={15} />
            <span>My Created Groups</span>
          </button>

          {isStudiRadAdmin && (
            <Link
              to="/admin/groups"
              className="ml-auto px-3.5 py-1.5 rounded-lg bg-blue-50 text-[#002147] hover:bg-blue-100 text-xs font-bold transition-colors flex items-center gap-1.5 border border-blue-200"
            >
              <span>Admin Portal</span>
              {pendingAdminGroupsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#002147] text-white text-[10px] rounded-full">
                  {pendingAdminGroupsCount}
                </span>
              )}
            </Link>
          )}
        </div>

        {activeTab === 'explore' ? (
          <div>
                     {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 hide-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-[#002147] text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            

            {/* Search and Secondary Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-8 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search group name, topic, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:bg-white"
                />
              </div>

              {/* Secondary Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 font-medium focus:outline-none focus:border-[#002147]"
                >
                  <option value="all">All Platforms</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="slack">Slack</option>
                </select>

                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 font-medium focus:outline-none focus:border-[#002147]"
                >
                  <option value="all">All Members</option>
                  <option value="students">Students Only</option>
                  <option value="professionals">Professionals Only</option>
                </select>
              </div>
            </div>

            {/* Groups Grid */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-[#002147] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-gray-500 font-semibold">Loading community groups...</p>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg mx-auto">
                <Users size={36} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {approvedGroups.length === 0 ? 'No Community Groups Yet' : 'No matching groups found'}
                </h3>
                <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                  {approvedGroups.length === 0
                    ? 'No community groups have been created yet. Be the first to start a verified group for research, exams, scholarships, jobs, or networking!'
                    : 'There are currently no approved groups matching your query. Try resetting filters or search keywords.'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="https://chat.whatsapp.com/IUdVHb0WusrJoi8qHY1biS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    <span>Join Official WhatsApp</span>
                    <ExternalLink size={13} />
                  </a>

                  <button
                    onClick={() => {
                      setEditingGroup(null);
                      setIsCreateModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#002e47] hover:bg-[#001733] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    {approvedGroups.length === 0 ? 'Create the First Group' : `Create Group Under ${selectedCategory !== 'All' ? selectedCategory : 'Community'}`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onJoinClick={handleJoinClick}
                    onFlagClick={handleFlagClick}
                    onEditClick={isStudiRadAdmin ? handleEditClick : undefined}
                    onDeleteClick={isStudiRadAdmin ? (g) => setDeleteConfirmGroup(g) : undefined}
                    isCreatorOrAdmin={isStudiRadAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* My Groups Section */
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="max-w-xl mb-6">
              <h3 className="text-xl font-extrabold text-[#002147] mb-1">
                Manage Your Created Groups
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Admins can create up to 2 groups. Enter your administrator email below to view your groups, edit details, or track approval status.
              </p>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="email"
                  placeholder="Enter creator email..."
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFetchMyGroups();
                  }}
                  className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#002147]"
                />
                <button
                  onClick={handleFetchMyGroups}
                  disabled={loadingMyGroups}
                  className="px-5 py-2.5 bg-[#002147] hover:bg-[#001733] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                >
                  {loadingMyGroups ? 'Searching...' : 'Find My Groups'}
                </button>
              </div>
            </div>

            {loadingMyGroups ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-3 border-[#002147] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-gray-500">Checking your groups...</p>
              </div>
            ) : myGroups.length === 0 ? (
              <div className="p-8 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <p className="text-xs text-gray-600 mb-3">
                  {creatorEmail 
                    ? `No groups found under "${creatorEmail}".` 
                    : 'Enter your administrator email above to view your groups.'}
                </p>
                <button
                  onClick={() => {
                    setEditingGroup(null);
                    setIsCreateModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#002147] text-white text-xs font-bold rounded-lg hover:bg-[#001733] transition-colors"
                >
                  Create a New Group
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span>Your Groups ({myGroups.length} of 2 max created)</span>
                  {myGroups.length < 2 && (
                    <button
                      onClick={() => {
                        setEditingGroup(null);
                        setIsCreateModalOpen(true);
                      }}
                      className="text-[#002147] hover:underline font-bold"
                    >
                      + Create another group
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myGroups.map((g) => (
                    <div key={g.id} className="relative">
                      <GroupCard
                        group={g}
                        onJoinClick={handleJoinClick}
                        onFlagClick={handleFlagClick}
                        onEditClick={handleEditClick}
                        onDeleteClick={(group) => setDeleteConfirmGroup(group)}
                        isCreatorOrAdmin={true}
                      />
                      {g.status === 'rejected' && g.rejectionReason && (
                        <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700">
                          <strong>Rejection reason:</strong> {g.rejectionReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-gray-200 shadow-xl text-center">
            <AlertCircle size={36} className="text-red-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 text-base mb-1">Delete Group?</h4>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to delete <strong>"{deleteConfirmGroup.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmGroup(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
         {/* Pinned Official StudiRad Discussion Community Banner */}
         <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#003447] via-[#003f5c] to-[#01566e] p-5 sm:p-6 text-white shadow-lg border border-blue-800/80 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-400 shadow-inner">
                    <MessageCircle size={28} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                        <CheckCircle2 size={11} /> Official Community
                      </span>
                      <span className="text-xs text-blue-200 font-semibold">Verified WhatsApp Group</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white">
                      StudiRad Official Discussion Community
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl mt-1 leading-relaxed">
                      Connect directly with tutors, clinical radiographers, and fellow students globally. Discuss daily cases, licensing exams, research ideas, and platform announcements.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <a
                    href="https://chat.whatsapp.com/IUdVHb0WusrJoi8qHY1biS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5"
                  >
                    <MessageCircle size={18} />
                    <span>Join Official WhatsApp</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </div>

      {/* Join Group Modal */}
      <JoinGroupModal
        group={activeModalGroup}
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false);
          setActiveModalGroup(null);
        }}
        onJoinSuccess={handleJoinSuccess}
      />

      {/* Create / Edit Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        editingGroup={editingGroup}
        defaultAdminEmail={creatorEmail}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingGroup(null);
        }}
        onSuccess={() => {
          showToast(
            editingGroup 
              ? 'Group updated successfully!' 
              : 'Group created and submitted for StudiRad Admin approval!'
          );
          loadApprovedGroups();
          if (creatorEmail) handleFetchMyGroups();
        }}
      />

      {/* Flag / Report Modal */}
      <FlagGroupModal
        group={activeModalGroup}
        isOpen={isFlagModalOpen}
        onClose={() => {
          setIsFlagModalOpen(false);
          setActiveModalGroup(null);
        }}
        onReportSuccess={() => {
          showToast('Thank you. Your report has been submitted to StudiRad administrators.');
        }}

        
      />
    </div>
  );
};

export default CommunityPage;
