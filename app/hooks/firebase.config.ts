
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "",
//   authDomain: "react-eveplano.firebaseapp.com",
//   projectId: "react-eveplano",
//   storageBucket: "react-eveplano.appspot.com",
//   messagingSenderId: "404069326803",
//   appId: "1:404069326803:web:deaf7bed1cb89e07c2d926",
// };

// const app = initializeApp(firebaseConfig);

// // ✅ stable (no crash)
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// export default app;

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ env থেকে config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// ✅ init
const app = initializeApp(firebaseConfig);

// ✅ exports
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;