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
