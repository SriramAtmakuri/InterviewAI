import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Check if Firebase should be skipped (for development without Firebase setup)
const SKIP_FIREBASE = process.env.SKIP_FIREBASE === 'true';

let db = null;
let storage = null;
let auth = null;

// Initialize Firebase Admin
const initializeFirebase = () => {
  if (SKIP_FIREBASE) {
    console.log('⚠️  Firebase skipped - Running in development mode without Firebase');
    console.log('ℹ️  Database features will use in-memory storage');
    return;
  }

  try {
    // Check if required environment variables are present
    if (!process.env.FIREBASE_PROJECT_ID ||
        !process.env.FIREBASE_PRIVATE_KEY ||
        !process.env.FIREBASE_CLIENT_EMAIL) {
      console.log('⚠️  Firebase credentials not found - Running without Firebase');
      console.log('ℹ️  Add Firebase credentials to .env to enable database features');
      return;
    }

    // For Render deployment, use environment variables
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    console.log('✅ Firebase Admin initialized successfully');

    // Initialize services
    db = getFirestore();
    storage = getStorage();
    auth = admin.auth();
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.log('⚠️  Continuing without Firebase - some features will be limited');
  }
};

// Initialize Firebase
initializeFirebase();

// Export Firestore and Storage instances (may be null in dev mode)
export { db, storage, auth };

// Firestore Collections
export const collections = {
  USERS: 'users',
  INTERVIEWS: 'interviews',
  FEEDBACK: 'feedback',
  QUESTION_BANKS: 'questionBanks',
  CODE_SUBMISSIONS: 'codeSubmissions',
  VIDEO_RECORDINGS: 'videoRecordings',
  ANALYTICS: 'analytics',
  RESUMES: 'resumes',
};

export default admin;
