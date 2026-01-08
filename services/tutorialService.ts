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
  totalAmount: number;
  startDate: string;
  targetAdminEmail: string;
  timestamp?: any;
}

/**
 * Saves tutoring enrollment data to Firestore.
 */
export const saveTutoringEnrollment = async (data: Omit<TutoringEnrollment, 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'tutoring_enrollments'), {
      ...data,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving tutoring enrollment:", error);
    return null;
  }
};
