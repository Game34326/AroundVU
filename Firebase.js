// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth/react-native';
import {getStorage, ref} from 'firebase/storage';
import {
  getFirestore,
  connectFirestoreEmulator,
  initializeFirestore,
} from 'firebase/firestore';
// Your web app's Firebase configuration

// const USE_EMULATOR = true

const firebaseConfig = {
  apiKey: '',
  authDomain: 'around-vu-68b32.firebaseapp.com',
  projectId: 'around-vu-68b32',
  storageBucket: 'around-vu-68b32.appspot.com',
  messagingSenderId: '92218944887',
  appId: '1:92218944887:web:38ba922b958986059a8572',
};

// if (USE_EMULATOR == true) {
//   console.log('######### USING LOCAL EMULATOR ##########');
//   connectFirestoreEmulator(db, "192.168.1.236", 8080);
//   connectAuthEmulator(auth, "http://localhost:9099");
//   } else {
//   console.log('######### USING PRODUCTION ##########');
//   }

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const storage = getStorage(app);
