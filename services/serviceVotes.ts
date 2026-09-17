import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export interface ServiceVoteData {
  privateClassesVotes: number;
}

const DEFAULT_VOTES: ServiceVoteData = {
  privateClassesVotes: 194
};

const getClientId = (): string => {
  try {
    let id = localStorage.getItem('studirad_client_id');
    if (!id) {
      id = 'client_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
      localStorage.setItem('studirad_client_id', id);
    }
    return id;
  } catch (e) {
    return 'anon_client';
  }
};

export const getServiceVotes = async (): Promise<ServiceVoteData> => {
  try {
    const docRef = doc(db, 'service_votes', 'summary');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        privateClassesVotes: typeof data.privateClassesVotes === 'number' ? data.privateClassesVotes : DEFAULT_VOTES.privateClassesVotes
      };
    } else {
      await setDoc(docRef, DEFAULT_VOTES, { merge: true });
      return DEFAULT_VOTES;
    }
  } catch (err) {
    try {
      const local = localStorage.getItem('studirad_service_votes');
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_VOTES;
  }
};

export const hasUserVotedPrivateClasses = async (): Promise<boolean> => {
  // 1. Fast check in localStorage
  try {
    if (localStorage.getItem('studirad_voted_private_classes') === 'true') {
      return true;
    }
  } catch (e) {
    // ignore
  }

  // 2. Check in Firestore log by client ID
  try {
    const clientId = getClientId();
    const voteLogRef = doc(db, 'service_votes', `voter_${clientId}`);
    const snap = await getDoc(voteLogRef);
    if (snap.exists() && snap.data()?.votedForPrivateClasses) {
      try {
        localStorage.setItem('studirad_voted_private_classes', 'true');
      } catch (e) {}
      return true;
    }
  } catch (e) {
    // ignore
  }

  return false;
};

export const voteForPrivateClasses = async (): Promise<number> => {
  // Save permanently in localStorage first
  try {
    localStorage.setItem('studirad_voted_private_classes', 'true');
  } catch (e) {
    // ignore
  }

  const clientId = getClientId();

  // Try updating Firestore
  try {
    // Record voter log to prevent double voting
    const voterRef = doc(db, 'service_votes', `voter_${clientId}`);
    await setDoc(voterRef, {
      votedForPrivateClasses: true,
      timestamp: new Date().toISOString()
    }, { merge: true });

    // Increment tally
    const summaryRef = doc(db, 'service_votes', 'summary');
    await updateDoc(summaryRef, {
      privateClassesVotes: increment(1)
    });

    const snap = await getDoc(summaryRef);
    if (snap.exists() && typeof snap.data().privateClassesVotes === 'number') {
      return snap.data().privateClassesVotes;
    }
  } catch (err) {
    console.warn('Firestore vote recording fallback:', err);
  }

  // Fallback to local storage counter
  try {
    const localVotes = JSON.parse(localStorage.getItem('studirad_service_votes') || JSON.stringify(DEFAULT_VOTES));
    localVotes.privateClassesVotes = (localVotes.privateClassesVotes || DEFAULT_VOTES.privateClassesVotes) + 1;
    localStorage.setItem('studirad_service_votes', JSON.stringify(localVotes));
    return localVotes.privateClassesVotes;
  } catch (e) {
    return DEFAULT_VOTES.privateClassesVotes + 1;
  }
};
