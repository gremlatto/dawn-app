import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "mock-key",
  authDomain: "dawn-app.firebaseapp.com",
  projectId: "dawn-app",
  storageBucket: "dawn-app.appspot.com",
  messagingSenderId: "000000000000",
  appId: "mock-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 