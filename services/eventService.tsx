
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc, 
  Timestamp,
  where
} from "firebase/firestore";

export interface EventData {
  id?: string;
  title: string;
  description: string;
  date: string; // ISO string or human readable
  eventDate: Timestamp; 
  imageUrl: string;
  link: string;
  type: 'webinar' | 'event';
  status: 'upcoming' | 'past';
  createdAt: Timestamp;
}

const COLLECTION = "events";

export const addEvent = async (data: Omit<EventData, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getEvents = async (status?: 'upcoming' | 'past') => {
  try {
    let q = query(collection(db, COLLECTION), orderBy("eventDate", status === 'upcoming' ? "asc" : "desc"));
    if (status) {
      q = query(collection(db, COLLECTION), where("status", "==", status), orderBy("eventDate", status === 'upcoming' ? "asc" : "desc"));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const deleteEvent = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateEventStatus = async (id: string, status: 'upcoming' | 'past') => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { status });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
