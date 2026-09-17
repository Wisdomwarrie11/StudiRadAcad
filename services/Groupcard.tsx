import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  Flag, 
  ExternalLink, 
  Calendar, 
  User, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { CommunityGroup, toggleGroupLike } from '../services/CommunityGroups';

interface GroupCardProps {
  group: CommunityGroup;
  onJoinClick: (group: CommunityGroup) => void;
  onFlagClick: (group: CommunityGroup) => void;
  onEditClick?: (group: CommunityGroup) => void;
  onDeleteClick?: (group: CommunityGroup) => void;
  isCreatorOrAdmin?: boolean;
}

const PLATFORM_CONFIG = {
  whatsapp: {
    label: 'WhatsApp',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-600 text-white'
  },
  telegram: {
    label: 'Telegram',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
    badgeColor: 'bg-sky-600 text-white'
  },
  slack: {
    label: 'Slack',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    badgeColor: 'bg-purple-600 text-white'
  }
};

const MEMBERS_LABEL: Record<string, string> = {
  students: 'Students Only',
  professionals: 'Professionals Only',
  all: 'Open to All'
};

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onJoinClick,
  onFlagClick,
  onEditClick,
  onDeleteClick,
  isCreatorOrAdmin = false
}) => {
  const [likes, setLikes] = useState(group.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    try {
      const likedList = JSON.parse(localStorage.getItem('studirad_liked_groups') || '[]');
      if (likedList.includes(group.id)) {
        setIsLiked(true);
      }
    } catch (e) {
      // ignore
    }
  }, [group.id]);

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);

    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikes(prev => nextState ? prev + 1 : Math.max(0, prev - 1));

    try {
      const likedList = JSON.parse(localStorage.getItem('studirad_liked_groups') || '[]');
      if (nextState) {
        if (!likedList.includes(group.id)) likedList.push(group.id);
      } else {
        const idx = likedList.indexOf(group.id);
        if (idx > -1) likedList.splice(idx, 1);
      }
      localStorage.setItem('studirad_liked_groups', JSON.stringify(likedList));

      await toggleGroupLike(group.id, nextState);
    } catch (err) {
      console.warn('Could not persist like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const platformInfo = PLATFORM_CONFIG[group.platform] || PLATFORM_CONFIG.whatsapp;
  const formattedDate = group.createdAt 
    ? new Date(group.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden group">
      {/* Top Banner & Category */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-[#002147] text-xs font-bold tracking-wide border border-blue-100">
            {group.category}
          </span>

          <div className="flex items-center gap-1.5">
            {group.status === 'pending' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                <Clock size={12} /> Pending Approval
              </span>
            )}
            {group.status === 'rejected' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 text-[11px] font-bold border border-red-200">
                <AlertTriangle size={12} /> Rejected
              </span>
            )}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${platformInfo.badgeColor}`}>
              {platformInfo.label}
            </span>
          </div>
        </div>

        {/* Group Name */}
        <h3 className="text-lg sm:text-xl font-extrabold text-[#002147] group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug mb-2">
          {group.name}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
          {group.description}
        </p>

        {/* Group Meta Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-600">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 font-medium">
            <Users size={12} className="text-gray-500" />
            {MEMBERS_LABEL[group.acceptedMembers] || 'Open to All'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 font-medium">
            <User size={12} className="text-gray-500" />
            Lead: {group.adminQualification}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 font-medium">
            <Calendar size={12} className="text-gray-500" />
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Footer / Action Bar */}
      <div className="px-5 sm:px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3">
        {/* Left: Join count, likes, flags */}
        <div className="flex items-center gap-3">
          {/* Join Count */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#002147]" title="People who clicked to join">
            <Users size={15} className="text-gray-500" />
            <span>{group.joinsCount || 0}</span>
            <span className="text-gray-500 font-normal hidden sm:inline">joined</span>
          </div>

          {/* Likes Button */}
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
              isLiked 
                ? 'text-rose-600 bg-rose-50' 
                : 'text-gray-500 hover:text-rose-600 hover:bg-gray-100'
            }`}
            title={isLiked ? 'Unlike group' : 'Like group'}
          >
            <Heart size={14} className={isLiked ? 'fill-rose-600 text-rose-600' : ''} />
            <span>{likes}</span>
          </button>

          {/* Flag Button */}
          <button
            onClick={() => onFlagClick(group)}
            className="text-gray-400 hover:text-amber-600 p-1 rounded hover:bg-gray-100 transition-colors"
            title="Flag or report this group"
          >
            <Flag size={13} />
          </button>
        </div>

        {/* Right: Join or Edit/Delete Controls */}
        <div className="flex items-center gap-2">
          {isCreatorOrAdmin && onEditClick && (
            <button
              onClick={() => onEditClick(group)}
              className="p-2 text-gray-600 hover:text-[#002147] hover:bg-white rounded-lg border border-gray-200 transition-colors"
              title="Edit group details"
            >
              <Edit3 size={14} />
            </button>
          )}

          {isCreatorOrAdmin && onDeleteClick && (
            <button
              onClick={() => onDeleteClick(group)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
              title="Delete group"
            >
              <Trash2 size={14} />
            </button>
          )}

          <button
            onClick={() => onJoinClick(group)}
            className="px-4 py-2 bg-[#002147] hover:bg-[#001733] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Join</span>
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
