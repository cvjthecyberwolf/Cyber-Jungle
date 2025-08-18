import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: 'cvj-jungle-ai-cyber-ecosystem',
  appId: '1:718648641575:web:818fcd7b6ebc4cd6fda602',
  storageBucket: 'cvj-jungle-ai-cyber-ecosystem.firebasestorage.app',
  apiKey: 'AIzaSyC7sUXE_eqmFIBDw9_Eu03I5JD9Ap9e3So',
  authDomain: 'cvj-jungle-ai-cyber-ecosystem.firebaseapp.com',
  messagingSenderId: '718648641575',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
