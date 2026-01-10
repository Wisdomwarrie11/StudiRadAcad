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
  items?: any[]; // Detailed breakdown (hours, days) for instant help
  totalAmount: number;
  startDate: string;
  targetAdminEmail: string;
  paymentRef: string;
  status: string;
  timestamp?: any;
}

/**
 * Saves tutoring enrollment data to Firestore using modular syntax.
 */
export const saveTutoringEnrollment = async (data: Omit<TutoringEnrollment, 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'tutoring_enrollments'), {
      ...data,
      timestamp: serverTimestamp()
    });
    console.log("Tutoring enrollment saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving tutoring enrollment to Firestore:", error);
    throw error;
  }
};