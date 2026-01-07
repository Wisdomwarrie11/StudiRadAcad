
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface TutoringLead {
  name: string;
  role: string;
  level: string;
  initialCourse: string;
  initialTopic: string;
  timestamp: any;
}

export const saveTutoringLead = async (lead: Omit<TutoringLead, 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'tutoring_leads'), {
      ...lead,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving lead:", error);
    return null;
  }
};
