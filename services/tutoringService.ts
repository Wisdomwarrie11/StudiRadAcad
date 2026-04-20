import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface TutoringEnrollment {
  name: string;
  email: string;
  whatsapp: string;
  level: string;
  bookingType: 'instant' | 'subscription';
  planId?: string;
  courses: string[];
  items?: any[]; 
  totalAmount: number;
  startDate: string;
  targetAdminEmail: string;
  paymentRef: string;
  status: string;
  timestamp?: any;
}

/**
 * Saves tutoring enrollment data to Firestore.
 * Strips undefined fields to prevent Firebase validation/permission errors.
 */
export const saveTutoringEnrollment = async (data: Omit<TutoringEnrollment, 'timestamp'>) => {
  try {
    // Filter out undefined values as Firestore rejects them
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    const docRef = await addDoc(collection(db, 'tutoring_enrollments'), {
      ...cleanData,
      timestamp: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Firestore Save Error:", error);
    throw error; // Rethrow to allow UI fail-safe
  }
};