// import { initializeApp } from 'firebase/app';
// import { initializeAuth } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getFirestore } from 'firebase/firestore';
// import type { Auth } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: "AIzaSyBMFIeDsa4oyV9QXpC1Q_nWTw3whVn6CAk",
//   authDomain: "react-eveplano.firebaseapp.com",
//   projectId: "react-eveplano",
//   storageBucket: "react-eveplano.appspot.com",
//   messagingSenderId: "404069326803",
//   appId: "1:404069326803:web:deaf7bed1cb89e07c2d926"
// };

// const app = initializeApp(firebaseConfig);

// // ✅ Properly typed auth
// export const auth: Auth = initializeAuth(app, {
//   persistence: AsyncStorage as any,
// });

// export const db = getFirestore(app);

// export default app;

// hooks/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBMFIeDsa4oyV9QXpC1Q_nWTw3whVn6CAk",
  authDomain: "react-eveplano.firebaseapp.com",
  projectId: "react-eveplano",
  storageBucket: "react-eveplano.appspot.com",
  messagingSenderId: "404069326803",
  appId: "1:404069326803:web:deaf7bed1cb89e07c2d926",
};

const app = initializeApp(firebaseConfig);

// ✅ stable (no crash)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;