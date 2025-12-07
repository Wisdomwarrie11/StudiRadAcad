import { db } from '../firebase';
import { ChallengeLevel, ChallengePurpose, ChallengeQuestion, ChallengeTopic, UserChallengeProfile } from '../types';

// Import Question Data
import { BASIC_TECHNIQUE, BASIC_SAFETY, BASIC_MRI, BASIC_CT, BASIC_USS, BASIC_SPECIAL_PROCEDURES } from '../data/basicQuestions';
import { ADVANCED_TECHNIQUE, ADVANCED_SAFETY, ADVANCED_SPECIAL_PROCEDURES, ADVANCED_MRI, ADVANCED_CT, ADVANCED_USS } from '../data/advancedqQuestions';
import { MASTER_TECHNIQUE, MASTER_SAFETY, MASTER_SPECIAL_PROCEDURES, MASTER_MRI, MASTER_CT, MASTER_USS } from '../data/masterQuestions';

// Collection Name in Firestore
const COLLECTION_NAME = 'daily_challenge_users';

// Helper to sanitize email for use as Document ID
const sanitizeId = (email: string) => {
  return email.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '_');
};

// Generate a random 6-character referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// --- Firestore Interactions ---

/**
 * Check if user exists (used for Landing Page quick login)
 */
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const docId = sanitizeId(email);
    const doc = await db.collection(COLLECTION_NAME).doc(docId).get();
    return doc.exists;
  } catch (error) {
    console.error("SERVICE ERROR: checkUserExists", error);
    return false;
  }
};

/**
 * Register a new user or retrieve existing one by email.
 * This acts as the "Login/Register" for the challenge.
 */
export const registerUserForChallenge = async (
  email: string, 
  name: string, 
  level: ChallengeLevel, 
  purpose: ChallengePurpose,
  referrerCode?: string
): Promise<UserChallengeProfile> => {
  try {
    const docId = sanitizeId(email); 
    console.log(`Checking Firestore for user: ${docId} in ${COLLECTION_NAME}`);
    
    const userRef = db.collection(COLLECTION_NAME).doc(docId);
    const doc = await userRef.get();

    if (doc.exists) {
      console.log("User found, returning profile.");
      return doc.data() as UserChallengeProfile;
    } else {
      console.log("User not found, creating new profile.");
      
      // Handle Referral Logic
      if (referrerCode) {
        try {
          // Find the user who owns this referral code
          const referrerQuery = await db.collection(COLLECTION_NAME)
            .where('referralCode', '==', referrerCode)
            .limit(1)
            .get();

          if (!referrerQuery.empty) {
            const referrerDoc = referrerQuery.docs[0];
            const referrerData = referrerDoc.data() as UserChallengeProfile;
            
            // Avoid self-referral if email matches (though ID check prevents this usually)
            if (referrerData.email !== email) {
                // Award 0.5 coins to referrer
                await referrerDoc.ref.update({
                    coins: (referrerData.coins || 0) + 0.5
                });
                console.log(`Referral reward applied to ${referrerData.email}`);
            }
          }
        } catch (refError) {
          console.error("Error processing referral code:", refError);
          // Continue with registration even if referral fails
        }
      }

      // Create new profile
      const newProfile: UserChallengeProfile = {
        uid: docId,
        email: email,
        displayName: name,
        level,
        purpose,
        currentDay: 1,
        lastPlayedDate: null,
        referralCode: generateReferralCode(), // Generate unique code for new user
        scores: {},
        totalScore: 0,
        coins: 0,
        unlockedDays: [1], // Day 1 is always unlocked
        completedLevels: []
      };
      
      await userRef.set(newProfile);
      return newProfile;
    }
  } catch (error) {
    console.error("SERVICE ERROR: registerUserForChallenge", error);
    throw error;
  }
};

/**
 * Get a user's profile by their email (ID)
 */
export const getUserProfile = async (email: string): Promise<UserChallengeProfile | null> => {
  try {
    const docId = sanitizeId(email);
    const doc = await db.collection(COLLECTION_NAME).doc(docId).get();
    if (doc.exists) {
      // Ensure existing users get a referral code if they don't have one
      const data = doc.data() as UserChallengeProfile;
      if (!data.referralCode) {
         const newCode = generateReferralCode();
         await doc.ref.update({ referralCode: newCode });
         data.referralCode = newCode;
      }
      return data;
    }
    return null;
  } catch (error) {
    console.error("SERVICE ERROR: getUserProfile", error);
    return null;
  }
};

export const startChallengeDay = async (email: string, day: number): Promise<void> => {
  try {
    const docId = sanitizeId(email);
    const userRef = db.collection(COLLECTION_NAME).doc(docId);
    const doc = await userRef.get();
    
    if (!doc.exists) return;
    const data = doc.data() as UserChallengeProfile;

    // Only update start time if it's the current day
    if (data.currentDay === day) {
      const now = new Date();
      // If we haven't started yet, or if the last start was over 24h ago (re-start), update it
      const lastStart = data.lastChallengeStartedAt ? new Date(data.lastChallengeStartedAt) : null;
      const shouldUpdate = !lastStart || (now.getTime() - lastStart.getTime() > 24 * 60 * 60 * 1000);

      if (shouldUpdate) {
        await userRef.update({
          lastChallengeStartedAt: now.toISOString()
        });
      }
    }
  } catch (error) {
    console.error("SERVICE ERROR: startChallengeDay", error);
  }
};

/**
 * Update user progress after a quiz
 */
export const updateUserProgress = async (
  email: string, 
  day: number, 
  score: number, 
  shouldAdvanceDay: boolean
): Promise<void> => {
  try {
    const docId = sanitizeId(email);
    const userRef = db.collection(COLLECTION_NAME).doc(docId);
    
    const doc = await userRef.get();
    if (!doc.exists) throw new Error("User not found");
    
    const currentData = doc.data() as UserChallengeProfile;
    
    // Update scores map
    // We only update if the new score is higher or if it wasn't there before
    const oldScore = currentData.scores[`day${day}`] || 0;
    const newScoreToSave = Math.max(oldScore, score);

    const updatedScores = { ...currentData.scores, [`day${day}`]: newScoreToSave };
    
    // Calculate new total
    const newTotal = (Object.values(updatedScores) as number[]).reduce((a, b) => a + b, 0);

    const updatePayload: any = {
      scores: updatedScores,
      totalScore: newTotal
    };

    if (shouldAdvanceDay) {
      // Natural progression: currentDay only moves forward if we completed the currentDay
      const nextDay = currentData.currentDay + 1;
      updatePayload.currentDay = Math.min(Math.max(currentData.currentDay, nextDay), 7);
      // SET THE TIMER TIMESTAMP HERE
      updatePayload.lastPlayedDate = new Date().toISOString();
      
      // NOTE: We do NOT automatically add nextDay to unlockedDays anymore.
      // unlockedDays is reserved for Day 1 and PAIDs unlocks.
      // Natural progression relies on currentDay and date checking in canPlayDay.
    }

    // Check for Level Completion (If Day 6 is finished)
    if (day === 6 && score > 0) { 
      const completedLevels = new Set(currentData.completedLevels || []);
      completedLevels.add(currentData.level);
      updatePayload.completedLevels = Array.from(completedLevels);
    }

    await userRef.update(updatePayload);

  } catch (error) {
    console.error("SERVICE ERROR: updateUserProgress", error);
    throw error;
  }
};

/**
 * Switch User Level (Cost: 1 Coin if not completed)
 */
export const switchLevel = async (email: string, newLevel: ChallengeLevel): Promise<boolean> => {
  try {
    const docId = sanitizeId(email);
    const userRef = db.collection(COLLECTION_NAME).doc(docId);
    const doc = await userRef.get();
    
    if (!doc.exists) throw new Error("User not found");
    const userData = doc.data() as UserChallengeProfile;

    const isCompleted = userData.completedLevels?.includes(userData.level);
    
    if (isCompleted) {
        await userRef.update({
            level: newLevel,
        });
        return true;
    }

    // If not completed, need 1 coin (250 naira)
    if (userData.coins < 1) {
        return false;
    }

    await userRef.update({
        level: newLevel,
        coins: userData.coins - 1
    });

    return true;

  } catch (error) {
    console.error("SERVICE ERROR: switchLevel", error);
    throw error;
  }
};

/**
 * Add Coins to User Wallet
 */
export const addCoins = async (email: string, amount: number): Promise<void> => {
  try {
    const docId = sanitizeId(email);
    const userRef = db.collection(COLLECTION_NAME).doc(docId);
    
    const doc = await userRef.get();
    if (!doc.exists) throw new Error("User not found");
    
    const currentCoins = doc.data()?.coins || 0;
    
    await userRef.update({
      coins: currentCoins + amount
    });
  } catch (error) {
    console.error("SERVICE ERROR: addCoins", error);
    throw error;
  }
};

/**
 * Reward user for sharing. 
 * Adds 0.5 coins, limited to once per day.
 */
export const rewardShare = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const docId = sanitizeId(email);
    const userRef = db.collection(COLLECTION_NAME).doc(docId);
    
    const doc = await userRef.get();
    if (!doc.exists) throw new Error("User not found");
    
    const userData = doc.data() as UserChallengeProfile;
    const now = new Date();
    
    // Check if shared today
    if (userData.lastShareDate) {
      const lastShare = new Date(userData.lastShareDate);
      const isSameDay = 
        lastShare.getDate() === now.getDate() &&
        lastShare.getMonth() === now.getMonth() &&
        lastShare.getFullYear() === now.getFullYear();
        
      if (isSameDay) {
        return { success: false, message: "You have already earned your share reward for today. Come back tomorrow!" };
      }
    }
    
    // Add 0.5 coins
    const currentCoins = userData.coins || 0;
    
    await userRef.update({
      coins: currentCoins + 0.5,
      lastShareDate: now.toISOString()
    });
    
    return { success: true, message: "0.5 Coins added to your wallet for sharing!" };
  } catch (error) {
    console.error("SERVICE ERROR: rewardShare", error);
    return { success: false, message: "Failed to process reward." };
  }
};

/**
 * Unlock a specific day using coins
 */
export const unlockDay = async (email: string, day: number): Promise<boolean> => {
  try {
    const docId = sanitizeId(email);
    const userRef = db.collection(COLLECTION_NAME).doc(docId);
    
    const doc = await userRef.get();
    if (!doc.exists) throw new Error("User not found");
    
    const userData = doc.data() as UserChallengeProfile;
    
    // Cost is 2 Coins (500 Naira) for a day
    if (userData.coins < 2) {
      return false; // Not enough coins
    }
    
    const currentUnlocked = new Set(userData.unlockedDays || [1]);
    if (currentUnlocked.has(day)) {
      return true; // Already unlocked
    }
    
    currentUnlocked.add(day);
    
    await userRef.update({
      coins: userData.coins - 2,
      unlockedDays: Array.from(currentUnlocked)
    });
    
    return true;
  } catch (error) {
    console.error("SERVICE ERROR: unlockDay", error);
    throw error;
  }
};

/**
 * Fetch Leaderboard (Top 20 by Total Score)
 */
export const getLeaderboard = async (): Promise<UserChallengeProfile[]> => {
  try {
    const snapshot = await db.collection(COLLECTION_NAME)
      .orderBy('totalScore', 'desc')
      .limit(20)
      .get();
    
    return snapshot.docs.map((doc: any) => doc.data() as UserChallengeProfile);
  } catch (error) {
    console.error("SERVICE ERROR: getLeaderboard", error);
    return [];
  }
};

// --- Helper Functions ---

export const getQuestionsForDay = (day: number, level: ChallengeLevel): { topic: ChallengeTopic, questions: ChallengeQuestion[] } => {
  const topicMap: Record<number, ChallengeTopic> = {
    1: ChallengeTopic.TECHNIQUE,
    2: ChallengeTopic.SPECIAL_PROCEDURES,
    3: ChallengeTopic.MRI,
    4: ChallengeTopic.CT,
    5: ChallengeTopic.USS,
    6: ChallengeTopic.SAFETY
  };

  const topic = topicMap[day] || ChallengeTopic.SAFETY;
  let rawQuestions: any[] = [];

  if (level === ChallengeLevel.BASIC) {
    switch(topic) {
      case ChallengeTopic.TECHNIQUE: rawQuestions = BASIC_TECHNIQUE; break;
      case ChallengeTopic.SPECIAL_PROCEDURES: rawQuestions = BASIC_SPECIAL_PROCEDURES; break;
      case ChallengeTopic.MRI: rawQuestions = BASIC_MRI; break;
      case ChallengeTopic.CT: rawQuestions = BASIC_CT; break;
      case ChallengeTopic.USS: rawQuestions = BASIC_USS; break;
      case ChallengeTopic.SAFETY: rawQuestions = BASIC_SAFETY; break;
    }
  } else if (level === ChallengeLevel.ADVANCED) {
    switch(topic) {
      case ChallengeTopic.TECHNIQUE: rawQuestions = ADVANCED_TECHNIQUE; break;
      case ChallengeTopic.SPECIAL_PROCEDURES: rawQuestions = ADVANCED_SPECIAL_PROCEDURES; break;
      case ChallengeTopic.MRI: rawQuestions = ADVANCED_MRI; break;
      case ChallengeTopic.CT: rawQuestions = ADVANCED_CT; break;
      case ChallengeTopic.USS: rawQuestions = ADVANCED_USS; break;
      case ChallengeTopic.SAFETY: rawQuestions = ADVANCED_SAFETY; break;
    }
  } else { // MASTER
    switch(topic) {
      case ChallengeTopic.TECHNIQUE: rawQuestions = MASTER_TECHNIQUE; break;
      case ChallengeTopic.SPECIAL_PROCEDURES: rawQuestions = MASTER_SPECIAL_PROCEDURES; break;
      case ChallengeTopic.MRI: rawQuestions = MASTER_MRI; break;
      case ChallengeTopic.CT: rawQuestions = MASTER_CT; break;
      case ChallengeTopic.USS: rawQuestions = MASTER_USS; break;
      case ChallengeTopic.SAFETY: rawQuestions = MASTER_SAFETY; break;
    }
  }

  // Fallback to random questions if array is empty (mock safety)
  if (!rawQuestions || rawQuestions.length === 0) {
    rawQuestions = [
        { text: `Placeholder question for ${topic} (${level})`, options: ["A", "B", "C", "D"], correctIndex: 0, explanation: "Placeholder", referenceLink: "" },
        { text: `Another question for ${topic}`, options: ["1", "2", "3", "4"], correctIndex: 1, explanation: "Placeholder", referenceLink: "" }
    ]; 
  }

  const processedQuestions: ChallengeQuestion[] = rawQuestions.map((q, i) => {
    // Basic shuffle of options logic would go here, simplified for this response
    const correctOptionText = q.options[q.correctIndex];
    // Shallow copy and sort random
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

    return {
      id: `${topic}-${level}-${i}`,
      text: q.text,
      options: shuffledOptions,
      correctIndex: newCorrectIndex,
      explanation: q.explanation,
      referenceLink: q.referenceLink,
      level,
      topic
    };
  });

  return { topic, questions: processedQuestions };
};

export const canPlayDay = (day: number, profile: UserChallengeProfile): { allowed: boolean, reason?: string, requiresUnlock?: boolean, canPayToUnlock?: boolean } => {
  const unlockedDays = new Set(profile.unlockedDays || [1]);
  
  // 1. If previously unlocked (paid or Day 1), allow
  if (unlockedDays.has(day)) return { allowed: true };
  
  // 2. Previous days can always be replayed
  if (day < profile.currentDay) {
    return { allowed: true };
  }

  // 3. Current progression day
  if (day === profile.currentDay) {
    // Check Date logic
    if (!profile.lastPlayedDate) {
      return { allowed: true }; // First time playing ever
    }

    // Helper to safely parse dates inside this function
    const parseDate = (d: any) => {
      if (typeof d === 'string') return new Date(d);
      if (d?.toDate) return d.toDate();
      return new Date(d);
    };

    const lastDate = parseDate(profile.lastPlayedDate);
    
    // If date is invalid, allow access as fail-safe
    if (isNaN(lastDate.getTime())) return { allowed: true };

    const now = new Date();
    
    // Calculate difference in hours
    const diffMs = now.getTime() - lastDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      // It has been less than 24 hours
      const remainingHours = Math.ceil(24 - diffHours);
      return { 
        allowed: false, 
        reason: `Unlocks in ${remainingHours}h`, 
        requiresUnlock: true, 
        canPayToUnlock: true 
      };
    } else {
      // 24 hours passed, allow access
      return { allowed: true };
    }
  }

  // 4. Future days
  return { 
    allowed: false, 
    reason: "Locked. Complete previous days first.", 
    requiresUnlock: true, 
    canPayToUnlock: true // Technically can pay to jump ahead
  };
};