import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Client App Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1ohcDmEayFGq1kH6GuuNczvJt8oY27WM",
  authDomain: "studirad-platform-new.firebaseapp.com",
  projectId: "studirad-platform-new",
  storageBucket: "studirad-platform-new.firebasestorage.app",
  messagingSenderId: "245412794093",
  appId: "1:245412794093:web:5986d5b30e4976701786e4"
};

// Initialize Client App safely
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const db = firebase.firestore(app) as any;
export const auth = firebase.auth(app) as any;
export const storage = firebase.storage(app) as any;

// Admin App Configuration
const adminFirebaseConfig = {
  apiKey: "AIzaSyBY1KiDfPSAHrxJfRQgcCpf1OkPZOrbNb0",
  authDomain: "studirad-admin-portal.firebaseapp.com",
  projectId: "studirad-admin-portal",
  storageBucket: "studirad-admin-portal.firebasestorage.app",
  messagingSenderId: "287772443459",
  appId: "1:287772443459:web:a91211f5621deb6bd965f6"
};

// Initialize Admin App separately with a unique name
const existingAdminApp = firebase.apps.find(app => app.name === "adminApp");
const adminApp = existingAdminApp || firebase.initializeApp(adminFirebaseConfig, "adminApp");

export const adminAuth = adminApp.auth() as any;
export const adminDb = adminApp.firestore() as any;
export const adminStorage = adminApp.storage() as any;