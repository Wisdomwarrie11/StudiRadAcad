
import { db } from '../firebase';
import { LocumProfile, LocumSubscription } from '../types';

const COLLECTION_NAME = 'locum_profiles';

const sanitizeEmail = (email: string) => email.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '_');

// Create or Update Locum Profile
export const registerLocum = async (profile: Partial<LocumProfile>): Promise<boolean> => {
    try {
        if (!profile.email) throw new Error("Email is required");
        const docId = sanitizeEmail(profile.email);
        
        // Generate search keys
        // Format: "State" and "State_LGA"
        const searchKeys: string[] = [];
        profile.locations?.forEach(loc => {
            searchKeys.push(loc.state); // Enable searching by State
            loc.lgas.forEach(lga => {
                searchKeys.push(`${loc.state}_${lga}`); // Enable searching by specific LGA
            });
        });

        // Ensure uniqueness in search keys
        const uniqueSearchKeys = Array.from(new Set(searchKeys));

        const dataToSave = {
            ...profile,
            searchKeys: uniqueSearchKeys,
            createdAt: new Date().toISOString(),
            id: docId
        };

        await db.collection(COLLECTION_NAME).doc(docId).set(dataToSave, { merge: true });
        return true;
    } catch (error) {
        console.error("Error registering locum:", error);
        return false;
    }
};

// Update Locum Profile (Preserves creation date, updates search keys)
export const updateLocum = async (profile: Partial<LocumProfile>): Promise<boolean> => {
    try {
        if (!profile.email) throw new Error("Email is required");
        const docId = sanitizeEmail(profile.email);
        
        const dataToSave: any = { ...profile };

        // If locations are provided, regenerate search keys
        if (profile.locations) {
            const searchKeys: string[] = [];
            profile.locations.forEach(loc => {
                searchKeys.push(loc.state); 
                loc.lgas.forEach(lga => {
                    searchKeys.push(`${loc.state}_${lga}`);
                });
            });
            dataToSave.searchKeys = Array.from(new Set(searchKeys));
        }

        // Use merge to update fields without overwriting everything
        await db.collection(COLLECTION_NAME).doc(docId).set(dataToSave, { merge: true });
        return true;
    } catch (error) {
        console.error("Error updating locum:", error);
        return false;
    }
};

// Get Locum Profile
export const getLocumProfile = async (email: string): Promise<LocumProfile | null> => {
    try {
        const docId = sanitizeEmail(email);
        const doc = await db.collection(COLLECTION_NAME).doc(docId).get();
        if (doc.exists) {
            return doc.data() as LocumProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
};

// Toggle Availability
export const toggleLocumAvailability = async (email: string, isAvailable: boolean): Promise<boolean> => {
    try {
        const docId = sanitizeEmail(email);
        await db.collection(COLLECTION_NAME).doc(docId).update({ isAvailable });
        return true;
    } catch (error) {
        console.error("Error toggling availability:", error);
        return false;
    }
};

// Search Locums
// Note: Firestore array-contains allows only one value. We can filter client side for better UX if needed,
// but for now, we search by location tag.
export const searchLocums = async (state: string, lga?: string): Promise<LocumProfile[]> => {
    try {
        let query = db.collection(COLLECTION_NAME)
            .where('isAvailable', '==', true)
            .where('subscription.isActive', '==', true);
        
        // Construct the search tag
        // If LGA is selected: "State_LGA"
        // If only State: "State"
        const searchTag = lga && lga !== 'All' ? `${state}_${lga}` : state;

        query = query.where('searchKeys', 'array-contains', searchTag);
        
        const snapshot = await query.get();
        return snapshot.docs.map(doc => doc.data() as LocumProfile);
    } catch (error) {
        console.error("Error searching locums:", error);
        return [];
    }
};