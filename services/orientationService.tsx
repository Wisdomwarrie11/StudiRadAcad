
import { db } from '../firebase';

export interface OrientationRegistration {
  name: string;
  status: string;
  heardFrom: string;
  hasParentalPermission: boolean;
  isUnder18: boolean;
  timestamp: string;
}

/**
 * Saves orientation registration to Firestore
 */
export const registerForOrientation = async (data: OrientationRegistration) => {
  try {
    await db.collection('orientation_registrations').add({
      ...data,
      eventDate: '2026-02-06',
      eventTitle: 'Welcome to Radiography'
    });
    return true;
  } catch (error) {
    console.error("Orientation Reg Error:", error);
    return false;
  }
};
