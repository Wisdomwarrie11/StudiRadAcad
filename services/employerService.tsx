import { db, auth, adminDb } from '../firebase';
import { EmployerProfile } from '../types';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, addDoc, getDocs, query, where, updateDoc, deleteDoc } from 'firebase/firestore';

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
 * Delete an opportunity
 */
export const deleteEmployerOpportunity = async (type: 'job' | 'internship' | 'scholarship', id: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const collectionName = type === 'job' ? 'jobs' : type === 'internship' ? 'internships' : 'scholarships';
    const docRef = doc(adminDb, collectionName, id);
    
    // Verify ownership before deleting (Security rules should also handle this)
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("Not found");
    if (docSnap.data().postedBy !== user.uid) throw new Error("Unauthorized");

    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
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
    // Check if organization name already exists before creating auth account
    const q = query(collection(db, COLLECTION), where('organizationName', '==', data.organizationName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("An organization with this name is already registered. Please contact support if you believe this is an error.");
    }

    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = cred.user?.uid;
    
    if (!uid) throw new Error("Auth failed");

    const profile: EmployerProfile = {
      ...data,
      uid,
      email,
      verified: false,
      isPreExisting: false,
      createdAt: new Date().toISOString()
    };

    // Profiles are kept in the primary db
    await setDoc(doc(db, COLLECTION, uid), profile);

    // Send email verification
    let emailSent = true;
    let emailError = null;
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/#/employer/verify`,
        handleCodeInApp: true,
      };
      await sendEmailVerification(cred.user, actionCodeSettings);
    } catch (err: any) {
      console.error("Error sending verification email with settings:", err);
      if (err.code === 'auth/unauthorized-continue-uri') {
        // Fallback to default verification if domain is not allowlisted
        try {
          await sendEmailVerification(cred.user);
          console.log("Verification email sent using default settings (fallback).");
        } catch (fallbackErr: any) {
          console.error("Fallback verification email failed:", fallbackErr);
          emailSent = false;
          emailError = fallbackErr.message;
        }
      } else {
        emailSent = false;
        emailError = err.message;
      }
    }

    return { success: true, profile, emailSent, emailError };
  } catch (error: any) {
    console.error("Employer Reg Error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Resend verification email to current user
 */
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user session found. Please try logging in again.");
    
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/#/employer/verify`,
        handleCodeInApp: true,
      };
      await sendEmailVerification(user, actionCodeSettings);
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-continue-uri') {
        // Fallback to default verification if domain is not allowlisted
        await sendEmailVerification(user);
      } else {
        throw err;
      }
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
export const forgotPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
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

    const profile = docSnap.data() as EmployerProfile;
    // Handle pre-existing users
    const isPreExisting = profile.isPreExisting === undefined && profile.verified === undefined;

    return { 
      success: true, 
      profile: { ...profile, isPreExisting: isPreExisting || profile.isPreExisting },
      emailVerified: cred.user.emailVerified
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all opportunities across all types (Admin only)
 */
export const getAllOpportunities = async () => {
  try {
    const types = ['jobs', 'internships', 'scholarships'];
    const allData: any[] = [];

    for (const type of types) {
      const snapshot = await getDocs(collection(adminDb, type));
      snapshot.docs.forEach(doc => {
        allData.push({
          id: doc.id,
          type: type.slice(0, -1), // remove 's'
          ...doc.data()
        });
      });
    }

    return allData;
  } catch (error) {
    console.error("Error fetching all opportunities:", error);
    return [];
  }
};

/**
 * Get current employer profile
 */
export const getCurrentEmployer = async (): Promise<EmployerProfile | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  const docSnap = await getDoc(doc(db, COLLECTION, user.uid));
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data() as EmployerProfile;
  // If isPreExisting is not set, we assume it's an old user who doesn't need verification
  if (data.isPreExisting === undefined && data.verified === undefined) {
    return { ...data, isPreExisting: true };
  }
  
  return data;
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