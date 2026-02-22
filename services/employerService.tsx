import { db, auth, adminDb } from '../firebase';
import { EmployerProfile } from '../types';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

const COLLECTION = 'employer_profiles';

/**
 * Get all registered employers (Admin only)
 */
export const getAllEmployers = async (): Promise<EmployerProfile[]> => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => ({ ...doc.data() } as EmployerProfile));
  } catch (error) {
    console.error("Error fetching all employers:", error);
    return [];
  }
};

/**
 * Update an existing opportunity
 */
export const updateEmployerOpportunity = async (type: 'job' | 'internship' | 'scholarship', id: string, data: any) => {
  try {
    const collectionName = type === 'job' ? 'jobs' : type === 'internship' ? 'internships' : 'scholarships';
    const docRef = doc(adminDb, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Get a single opportunity by ID
 */
export const getOpportunityById = async (type: 'job' | 'internship' | 'scholarship', id: string) => {
  try {
    const collectionName = type === 'job' ? 'jobs' : type === 'internship' ? 'internships' : 'scholarships';
    const docSnap = await getDoc(doc(adminDb, collectionName, id));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: "Not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Register a new employer organization
 */
export const registerEmployer = async (email: string, pass: string, data: Omit<EmployerProfile, 'uid' | 'createdAt' | 'verified'>) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
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
    await setDoc(doc(db, COLLECTION, uid), profile);

    // Send email verification
    try {
      await sendEmailVerification(cred.user);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // We don't fail registration if email fails, but we log it
    }

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
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const uid = cred.user?.uid;
    if (!uid) throw new Error("Login failed");
    
    const docSnap = await getDoc(doc(db, COLLECTION, uid));
    if (!docSnap.exists()) throw new Error("Profile not found");

    return { success: true, profile: docSnap.data() as EmployerProfile };
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
  const docSnap = await getDoc(doc(db, COLLECTION, user.uid));
  return docSnap.exists() ? (docSnap.data() as EmployerProfile) : null;
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
    const docRef = await addDoc(collection(adminDb, collectionName), payload);
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
    const q = query(collection(adminDb, collectionName), where('postedBy', '==', user.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching my posts:", error);
    return [];
  }
};