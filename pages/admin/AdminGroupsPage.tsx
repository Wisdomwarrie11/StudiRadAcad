import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAuth } from '../../firebase';
import { 
  getAllGroupsForAdmin, 
  approveGroup, 
  rejectGroup, 
  deleteCommunityGroup, 
  CommunityGroup 
} from '../../services/CommunityGroups';
import CreateGroupModal from '../../services/CreateGroupModal';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Users, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Clock, 
  Flag, 
  PlusCircle, 
  Phone, 
  Mail, 
  Award,
  Search
} from 'lucide-react';

export const AdminGroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'flagged' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CommunityGroup | null>(null);
  const [rejectDialogGroup, setRejectDialogGroup] = useState<CommunityGroup | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState<CommunityGroup | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = adminAuth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin/login');
      } else {
        fetchGroups();
      }
    });
    return () => unsub();
  }, [navigate]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await getAllGroupsForAdmin();
      setGroups(data);
    } catch (err) {
      console.error('Error fetching admin groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApprove = async (group: CommunityGroup) => {
    try {
      await approveGroup(group.id);
      showToast(`Group "${group.name}" approved and is now live!`);
      fetchGroups();
    } catch (err) {
      alert('Failed to approve group.');
    }
  };

  const handleReject = async () => {
    if (!rejectDialogGroup) return;
    try {
      await rejectGroup(rejectDialogGroup.id, rejectionReason);
      showToast(`Group "${rejectDialogGroup.name}" has been rejected.`);
      setRejectDialogGroup(null);
      setRejectionReason('');
      fetchGroups();
    } catch (err) {
      alert('Failed to reject group.');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmGroup) return;
    try {
      await deleteCommunityGroup(deleteConfirmGroup.id);
      showToast(`Group "${deleteConfirmGroup.name}" deleted.`);
      setDeleteConfirmGroup(null);
      fetchGroups();
    } catch (err) {
      alert('Failed to delete group.');
    }
  };

  const pendingGroups = groups.filter(g => g.status === 'pending');
  const approvedGroups = groups.filter(g => g.status === 'approved');
  const flaggedGroups = groups.filter(g => (g.flagsCount || 0) > 0);
  const rejectedGroups = groups.filter(g => g.status === 'rejected');

  const currentTabGroups = 
    activeTab === 'pending' ? pendingGroups :
    activeTab === 'approved' ? approvedGroups :
    activeTab === 'flagged' ? flaggedGroups :
    rejectedGroups;

  const filteredGroups = currentTabGroups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#002147] text-white rounded-2xl shadow-xl flex items-center gap-3 border border-blue-800 animate-fadeIn">
          <CheckCircle2 size={20} className="text-[#f59e0b] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header in Oxford Blue */}
      <header className="bg-[#002147] text-white py-6 px-4 sm:px-8 border-b border-blue-900">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Back to Admin Dashboard"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Community Groups Administration
              </h1>
              <p className="text-xs text-blue-200">
                Review pending submissions, manage live groups, and investigate reported community links.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/community"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>View Public Page</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={() => {
                setEditingGroup(null);
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#002147] text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <PlusCircle size={15} />
              <span>Create Group</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-[#002147] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Clock size={14} />
            <span>Pending Approvals</span>
            {pendingGroups.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-[#002147] font-black">
                {pendingGroups.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'approved'
                ? 'bg-[#002147] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <CheckCircle2 size={14} />
            <span>Live Approved ({approvedGroups.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('flagged')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'flagged'
                ? 'bg-[#002147] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Flag size={14} />
            <span>Flagged Reports ({flaggedGroups.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'rejected'
                ? 'bg-[#002147] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <XCircle size={14} />
            <span>Rejected ({rejectedGroups.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#002147]"
          />
        </div>

        {/* Groups List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-[#002147] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500">Loading groups...</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Users size={36} className="mx-auto text-gray-300 mb-2" />
            <h3 className="text-sm font-bold text-gray-800 mb-1">
              {searchQuery ? 'No matching groups found' : 'No groups in this queue'}
            </h3>
            <p className="text-xs text-gray-500">
              {searchQuery
                ? 'No groups match your search query.'
                : activeTab === 'pending'
                ? 'No pending group submissions awaiting review.'
                : activeTab === 'approved'
                ? 'No approved community groups yet.'
                : activeTab === 'flagged'
                ? 'No reported or flagged groups.'
                : 'No rejected groups.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#002147] text-[11px] font-bold border border-blue-100">
                        {group.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-semibold uppercase">
                        {group.platform}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700 font-medium">
                        Target: {group.acceptedMembers}
                      </span>
                      {group.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 flex items-center gap-1">
                          <Clock size={11} /> Pending Review
                        </span>
                      )}
                      {(group.flagsCount || 0) > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold border border-red-200 flex items-center gap-1">
                          <Flag size={11} /> {group.flagsCount} Report(s)
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {group.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      {group.description}
                    </p>

                    {/* Creator Metadata Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="text-gray-400 shrink-0" />
                        <span className="truncate">{group.adminEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-gray-400 shrink-0" />
                        <span>{group.adminPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award size={13} className="text-gray-400 shrink-0" />
                        <span className="truncate">{group.adminQualification}</span>
                      </div>
                    </div>

                    {/* Invite Link & Joins stats */}
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <a
                        href={group.platformLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#002147] hover:underline font-bold flex items-center gap-1.5"
                      >
                        <span>Open {group.platform.toUpperCase()} Invite Link</span>
                        <ExternalLink size={12} />
                      </a>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-600 font-medium">
                        Joins: <strong className="text-gray-900">{group.joinsCount || 0}</strong>
                      </span>
                      <span className="text-gray-600 font-medium">
                        Likes: <strong className="text-gray-900">{group.likesCount || 0}</strong>
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-400 text-[11px]">
                        Created: {group.createdAt ? new Date(group.createdAt).toLocaleString() : 'N/A'}
                      </span>
                    </div>

                    {/* Flag reports details if any */}
                    {group.flags && group.flags.length > 0 && (
                      <div className="mt-3 p-3 bg-red-50/70 border border-red-200 rounded-xl">
                        <h5 className="text-xs font-bold text-red-900 mb-1 flex items-center gap-1">
                          <Flag size={12} /> User Reports Log:
                        </h5>
                        <ul className="text-xs text-red-800 space-y-1 list-disc pl-4">
                          {group.flags.map((f, i) => (
                            <li key={i}>
                              <strong>{f.reason}</strong>
                              {f.details ? ` - "${f.details}"` : ''} ({new Date(f.reportedAt).toLocaleDateString()})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex lg:flex-col items-center justify-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    {group.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(group)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 w-full justify-center"
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve & Publish</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectDialogGroup(group);
                            setRejectionReason('');
                          }}
                          className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl transition-colors border border-amber-200 flex items-center gap-1.5 w-full justify-center"
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setEditingGroup(group);
                        setIsCreateModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 w-full justify-center"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmGroup(group)}
                      className="px-3.5 py-2 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 w-full justify-center"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {rejectDialogGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200 shadow-xl">
            <h4 className="font-bold text-gray-900 text-base mb-1">Reject Community Group</h4>
            <p className="text-xs text-gray-600 mb-4">
              Specify the reason for rejecting <strong>"{rejectDialogGroup.name}"</strong>. The creator will be able to see this feedback.
            </p>

            <textarea
              rows={3}
              placeholder="e.g., Invite link expired, inappropriate group description, or duplicate..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#002147] mb-4 resize-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectDialogGroup(null)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-gray-200 shadow-xl text-center">
            <AlertTriangle size={36} className="text-red-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 text-base mb-1">Delete Group?</h4>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to permanently delete <strong>"{deleteConfirmGroup.name}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmGroup(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        editingGroup={editingGroup}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingGroup(null);
        }}
        onSuccess={() => {
          showToast(editingGroup ? 'Group updated.' : 'Group created.');
          fetchGroups();
        }}
      />
    </div>
  );
};

export default AdminGroupsPage;
