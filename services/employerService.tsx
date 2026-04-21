import { db, auth, adminDb } from '../firebase';
import { EmployerProfile } from '../types';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, deleteUser, updateProfile } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, addDoc, getDocs, query, where, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'employer_profiles';

/**
 * Send an email verification link to the current user
 */
export const sendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    
    // ActionCodeSettings allows us to specify where to redirect after clicking
    const actionCodeSettings = {
      // The URL to redirect back to. The domain must be whitelisted in Firebase Console.
      url: window.location.origin + '/employer/login?verified=true',
      handleCodeInApp: true,
    };

    await sendEmailVerification(user, actionCodeSettings);
    return { success: true };
  } catch (error: any) {
    console.error("Verification email failed:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Resend verification email (alias for sendVerificationEmail but for semantic clarity in UI)
 */
export const resendVerificationEmail = sendVerificationEmail;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(errInfo.error); // Throw the message for the UI, log the JSON for debugging
}

/**
 * Get all registered employers (Admin only)
 */
export const getAllEmployers = async (): Promise<EmployerProfile[]> => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as EmployerProfile));
  } catch (error) {
    console.error("Error fetching all employers:", error);
    return [];
  }
};

/**
 * Verify or unverify an employer (Admin only)
 */
export const verifyEmployerProfile = async (uid: string, isVerified: boolean) => {
  try {
    await updateDoc(doc(db, COLLECTION, uid), { isVerified });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
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
export const registerEmployer = async (email: string, pass: string, data: Omit<EmployerProfile, 'uid' | 'createdAt'>) => {
  try {
    // Check if organization name already exists before creating auth account
    try {
      console.log(`Checking organization name: ${data.organizationName}`);
      const q = query(collection(db, COLLECTION), where('organizationName', '==', data.organizationName));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error("An organization with this name is already registered. Please contact support if you believe this is an error.");
      }
      console.log("Organization name is available");
    } catch (err) {
      console.error("Organization name check failed:", err);
      if (err instanceof Error && err.message.includes("permission")) {
        handleFirestoreError(err, OperationType.LIST, COLLECTION);
      }
      throw err;
    }

    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = cred.user?.uid;
    
    if (!uid) throw new Error("Auth failed");

    // Set the Display Name in Firebase Auth so the email template is personalized
    // This helps prevent the email from being flagged as spam/broken on mobile
    await updateProfile(cred.user, {
      displayName: data.organizationName
    });

    // Send verification email immediately
    await sendVerificationEmail();

    const profile: EmployerProfile = {
      ...data,
      uid,
      email,
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    // Profiles are kept in the primary db
    try {
      console.log(`Attempting to create profile for UID: ${uid}. Auth CurrentUser UID: ${auth.currentUser?.uid}`);
      await setDoc(doc(db, COLLECTION, uid), profile);
      console.log("Profile created successfully");
    } catch (err: any) {
      console.error("Profile creation failed:", err);
      // Ensure uid is available for the error handler
      const errorPath = `${COLLECTION}/${uid}`;
      handleFirestoreError(err, OperationType.WRITE, errorPath);
    }

    return { 
      success: true, 
      profile, 
      uid 
    };
  } catch (error: any) {
    console.error("Employer Reg Error:", error);
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

    return { 
      success: true, 
      profile,
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
  
  return docSnap.data() as EmployerProfile;
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