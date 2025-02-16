import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserSessionPersistence,
  updateProfile as firebaseUpdateProfile 
} from 'firebase/auth';
import { 
  getFirestore, 
  serverTimestamp as firestoreServerTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAFrudD0XiJz-3Sl2V_PorR3tjFXC2W3Dk",
    authDomain: "react-router-a88d6.firebaseapp.com",
    projectId: "react-router-a88d6",
    storageBucket: "react-router-a88d6.firebasestorage.app",
    messagingSenderId: "530845512286",
    appId: "1:530845512286:web:a4dfd5e4c045bbf2727acf",
    measurementId: "G-K7QPD5MF5B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore services
const auth = getAuth(app);

// Set persistence to session (will clear on browser close)
setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

const db = getFirestore(app);

// Custom update profile function
const updateProfile = async (user, profileData) => {
  try {
    await firebaseUpdateProfile(user, profileData);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Custom server timestamp function
const serverTimestamp = () => {
  return firestoreServerTimestamp();
};

export { auth, db, updateProfile, serverTimestamp };
