import { initializeApp } from "firebase/app";

import { getFirestore }
from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    "AIzaSyActIrw_EXdXce_TJldtiWBpgwNoGMT99c",

  authDomain:
    "pm-tool-85d80.firebaseapp.com",

  projectId:
    "pm-tool-85d80",

  storageBucket:
    "pm-tool-85d80.firebasestorage.app",

  messagingSenderId:
    "108192871609",

  appId:
    "1:108192871609:web:aa6ba91d8df7c5f98d9768",
};

const app =
  initializeApp(
    firebaseConfig
  );

export const db =
  getFirestore(app);