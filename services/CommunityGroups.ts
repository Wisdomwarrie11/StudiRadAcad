import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    setDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    increment, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  export type GroupCategory = 
    | 'Research'
    | 'Exams (International or Local)'
    | 'Scholarships'
    | 'Jobs'
    | 'Internships'
    | 'Outreach'
    | 'Networking';
  
  export type AcceptedMembersType = 'students' | 'professionals' | 'all';
  export type PlatformType = 'whatsapp' | 'telegram' | 'slack';
  export type GroupStatus = 'pending' | 'approved' | 'rejected';
  
  export interface GroupFlagReport {
    id: string;
    reason: string;
    details?: string;
    reportedAt: string;
  }
  
  export interface CommunityGroup {
    id: string;
    name: string;
    nameLower: string;
    category: GroupCategory;
    adminEmail: string;
    adminPhone: string;
    adminQualification: string;
    description: string;
    acceptedMembers: AcceptedMembersType;
    platform: PlatformType;
    platformLink: string;
    status: GroupStatus;
    joinsCount: number;
    likesCount: number;
    flagsCount: number;
    flags?: GroupFlagReport[];
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  const COLLECTION_NAME = 'community_groups';
  
  // Validate platform link
  export const isValidPlatformLink = (platform: PlatformType, url: string): boolean => {
    const trimmed = url.trim().toLowerCase();
    try {
      const parsed = new URL(trimmed);
      const host = parsed.hostname.toLowerCase();
  
      if (platform === 'whatsapp') {
        return host.includes('whatsapp.com') || host.includes('wa.me');
      }
      if (platform === 'telegram') {
        return host.includes('t.me') || host.includes('telegram.me') || host.includes('telegram.org');
      }
      if (platform === 'slack') {
        return host.includes('slack.com');
      }
      return false;
    } catch (e) {
      return false;
    }
  };
  
  // Check if group name is already taken
  export const isGroupNameTaken = async (name: string, excludeGroupId?: string): Promise<boolean> => {
    const nameLower = name.trim().toLowerCase();
    const q = query(collection(db, COLLECTION_NAME), where('nameLower', '==', nameLower));
    const snap = await getDocs(q);
    
    if (snap.empty) return false;
    if (!excludeGroupId) return true;
    
    // If excluding current group when editing
    return snap.docs.some(d => d.id !== excludeGroupId);
  };
  
  // Count how many groups an admin email has created
  export const getAdminGroupsCount = async (email: string): Promise<number> => {
    const normalizedEmail = email.trim().toLowerCase();
    const q = query(collection(db, COLLECTION_NAME), where('adminEmail', '==', normalizedEmail));
    const snap = await getDocs(q);
    // Exclude rejected groups from counting against the 2-group limit
    const activeOrPending = snap.docs.filter(d => d.data().status !== 'rejected');
    return activeOrPending.length;
  };
  
  // Fetch all approved groups for public display directly from Firestore
  export const getApprovedGroups = async (categoryFilter?: string): Promise<CommunityGroup[]> => {
    try {
      const groupsRef = collection(db, COLLECTION_NAME);
      let q = query(groupsRef, where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
  
      if (categoryFilter && categoryFilter !== 'All') {
        q = query(
          groupsRef, 
          where('status', '==', 'approved'), 
          where('category', '==', categoryFilter), 
          orderBy('createdAt', 'desc')
        );
      }
  
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CommunityGroup));
    } catch (err) {
      console.warn('Error fetching approved groups with compound query, falling back to basic query:', err);
      try {
        const qAll = query(collection(db, COLLECTION_NAME));
        const snap = await getDocs(qAll);
        let groups = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as CommunityGroup))
          .filter(g => g.status === 'approved');
  
        if (categoryFilter && categoryFilter !== 'All') {
          groups = groups.filter(g => g.category === categoryFilter);
        }
        return groups.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (e) {
        console.error('Failed to load groups from Firestore:', e);
        return [];
      }
    }
  };
  
  // Fetch groups by admin email (for creator management)
  export const getGroupsByAdminEmail = async (email: string): Promise<CommunityGroup[]> => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const q = query(collection(db, COLLECTION_NAME), where('adminEmail', '==', normalizedEmail));
      const snap = await getDocs(q);
      return snap.docs
        .map(d => ({ id: d.id, ...d.data() } as CommunityGroup))
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } catch (err) {
      console.error('Error fetching admin groups:', err);
      return [];
    }
  };
  
  // Fetch all groups for StudiRad admin review
  export const getAllGroupsForAdmin = async (): Promise<CommunityGroup[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const snap = await getDocs(q);
      return snap.docs
        .map(d => ({ id: d.id, ...d.data() } as CommunityGroup))
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } catch (err) {
      console.error('Error fetching all groups for admin:', err);
      return [];
    }
  };
  
  // Create a new group (default status: pending)
  export const createCommunityGroup = async (
    groupData: Omit<CommunityGroup, 'id' | 'status' | 'joinsCount' | 'likesCount' | 'flagsCount' | 'createdAt' | 'updatedAt' | 'nameLower'>
  ): Promise<{ success: boolean; id?: string; error?: string }> => {
    try {
      const normalizedEmail = groupData.adminEmail.trim().toLowerCase();
      
      // 1. Check max 2 groups limit
      const existingCount = await getAdminGroupsCount(normalizedEmail);
      if (existingCount >= 2) {
        return { 
          success: false, 
          error: 'You have reached the maximum limit of 2 groups per administrator. You cannot create more than 2 groups.' 
        };
      }
  
      // 2. Check unique group name
      const isTaken = await isGroupNameTaken(groupData.name);
      if (isTaken) {
        return { 
          success: false, 
          error: `A group named "${groupData.name.trim()}" already exists. Please choose a unique name.` 
        };
      }
  
      // 3. Check platform link
      if (!isValidPlatformLink(groupData.platform, groupData.platformLink)) {
        return {
          success: false,
          error: `Please provide a valid ${groupData.platform.toUpperCase()} invite link.`
        };
      }
  
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...groupData,
        name: groupData.name.trim(),
        nameLower: groupData.name.trim().toLowerCase(),
        adminEmail: normalizedEmail,
        adminPhone: groupData.adminPhone.trim(),
        status: 'pending', // Requires admin approval
        joinsCount: 0,
        likesCount: 0,
        flagsCount: 0,
        flags: [],
        createdAt: now,
        updatedAt: now
      });
  
      return { success: true, id: docRef.id };
    } catch (err: any) {
      console.error('Error creating group:', err);
      return { success: false, error: err.message || 'Failed to create group. Please try again.' };
    }
  };
  
  // Update group
  export const updateCommunityGroup = async (
    groupId: string,
    updatedData: Partial<CommunityGroup>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (updatedData.name) {
        const isTaken = await isGroupNameTaken(updatedData.name, groupId);
        if (isTaken) {
          return { 
            success: false, 
            error: `A group named "${updatedData.name.trim()}" already exists. Please choose a unique name.` 
          };
        }
        updatedData.name = updatedData.name.trim();
        updatedData.nameLower = updatedData.name.trim().toLowerCase();
      }
  
      if (updatedData.platform && updatedData.platformLink) {
        if (!isValidPlatformLink(updatedData.platform, updatedData.platformLink)) {
          return {
            success: false,
            error: `Please provide a valid ${updatedData.platform.toUpperCase()} invite link.`
          };
        }
      }
  
      const docRef = doc(db, COLLECTION_NAME, groupId);
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
  
      return { success: true };
    } catch (err: any) {
      console.error('Error updating group:', err);
      return { success: false, error: err.message || 'Failed to update group.' };
    }
  };
  
  // Delete group
  export const deleteCommunityGroup = async (groupId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, groupId));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting group:', err);
      return { success: false, error: err.message || 'Failed to delete group.' };
    }
  };
  
  // Track join click
  export const recordGroupJoin = async (groupId: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, groupId);
      await updateDoc(docRef, {
        joinsCount: increment(1),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Error recording join count:', err);
    }
  };
  
  // Toggle like for a group
  export const toggleGroupLike = async (groupId: string, isLiking: boolean): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, groupId);
      await updateDoc(docRef, {
        likesCount: increment(isLiking ? 1 : -1)
      });
    } catch (err) {
      console.warn('Error updating like:', err);
    }
  };
  
  // Record flag/report for a group
  export const reportGroup = async (
    groupId: string, 
    reason: string, 
    details?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, groupId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return { success: false, error: 'Group not found.' };
      }
  
      const currentFlags = snap.data().flags || [];
      const newFlag: GroupFlagReport = {
        id: 'flag_' + Date.now().toString(36),
        reason,
        details: details?.trim() || '',
        reportedAt: new Date().toISOString()
      };
  
      await updateDoc(docRef, {
        flagsCount: increment(1),
        flags: [...currentFlags, newFlag]
      });
  
      return { success: true };
    } catch (err: any) {
      console.error('Error reporting group:', err);
      return { success: false, error: err.message || 'Failed to submit report.' };
    }
  };
  
  // Admin approve group
  export const approveGroup = async (groupId: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, groupId);
    await updateDoc(docRef, {
      status: 'approved',
      updatedAt: new Date().toISOString()
    });
  };
  
  // Admin reject group
  export const rejectGroup = async (groupId: string, reason?: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, groupId);
    await updateDoc(docRef, {
      status: 'rejected',
      rejectionReason: reason?.trim() || 'Did not meet StudiRad community standards.',
      updatedAt: new Date().toISOString()
    });
  };
  