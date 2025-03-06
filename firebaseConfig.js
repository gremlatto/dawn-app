import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBxKl5InVzrqzVszhaophaZKpNrT9vvxsw", // Use the full apiKey from your Firebase console
  authDomain: "dawnapp-67422.firebaseapp.com",
  projectId: "dawnapp-67422",
  storageBucket: "dawnapp-67422.appspot.com",
  messagingSenderId: "795598125411",
  appId: "1:785508125411:web:463d6e58883c714f40d3d6", // Use the full appId from your Firebase console
  measurementId: "G-V2RTCH5HP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };