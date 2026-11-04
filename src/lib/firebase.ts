import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Web configuration is public client configuration.
// Access control must be enforced with Firebase Authentication and Firestore Rules.
const firebaseConfig = {
  apiKey: "AIzaSyBu6qkWtzDVLMSTeDRVrEOToxL1I4VmZZA",
  authDomain: "pkess-products.firebaseapp.com",
  projectId: "pkess-products",
  storageBucket: "pkess-products.firebasestorage.app",
  messagingSenderId: "184070746495",
  appId: "1:184070746495:web:e6964196b90d5007cbea4a"
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
