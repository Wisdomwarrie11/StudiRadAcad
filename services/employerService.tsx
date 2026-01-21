import { db, auth, adminDb } from '../firebase';
import { EmployerProfile } from '../types';

const COLLECTION = 'employer_profiles';

/**
 * Register a new employer organization
 */
export const registerEmployer = async (email: string, pass: string, data: Omit<EmployerProfile, 'uid' | 'createdAt' | 'verified'>) => {
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    const uid = cred.user?.uid;
    
    if (!uid) throw new Error("Auth failed");

    const profile: EmployerProfile = {
      ...data,
      uid,
      email,
      verified: false,
      createdAt: new Date().toISOString()
    };

    // Profiles are kept in the primary db
    await db.collection(COLLECTION).doc(uid).set(profile);
    return { success: true, profile };
  } catch (error: any) {
    console.error("Employer Reg Error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Login employer
 */
export const loginEmployer = async (email: string, pass: string) => {
  try {
    const cred = await auth.signInWithEmailAndPassword(email, pass);
    const uid = cred.user?.uid;
    if (!uid) throw new Error("Login failed");
    
    const doc = await db.collection(COLLECTION).doc(uid).get();
    if (!doc.exists) throw new Error("Profile not found");

    return { success: true, profile: doc.data() as EmployerProfile };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Get current employer profile
 */
export const getCurrentEmployer = async (): Promise<EmployerProfile | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  const doc = await db.collection(COLLECTION).doc(user.uid).get();
  return doc.exists ? (doc.data() as EmployerProfile) : null;
};

/**
 * Post an opportunity on behalf of an employer.
 * Explicitly uses adminDb to match the public listings source.
 */
export const postEmployerOpportunity = async (type: 'job' | 'internship' | 'scholarship', data: any) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const collectionName = type === 'job' ? 'jobs' : type === 'internship' ? 'internships' : 'scholarships';
    
    const payload = {
      ...data,
      postedBy: user.uid,
      isAdminPost: false,
      createdAt: new Date(),
      postedAt: new Date().toISOString()
    };

    // Use adminDb for consistency across all platform opportunities
    const docRef = await adminDb.collection(collectionName).add(payload);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Get opportunities posted by current employer
 */
export const getMyOpportunities = async (type: 'job' | 'internship' | 'scholarship') => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const collectionName = type === 'job' ? 'jobs' : type === 'internship' ? 'internships' : 'scholarships';
    const snapshot = await adminDb.collection(collectionName)
      .where('postedBy', '==', user.uid)
      .get();

    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching my posts:", error);
    return [];
  }
};