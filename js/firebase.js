// =============================================
// VIBEZEE — Firebase Config
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBNeNP79jp1mr894citf2V5RHN4UQCCWaU",
  authDomain:        "vibezee-845ba.firebaseapp.com",
  projectId:         "vibezee-845ba",
  storageBucket:     "vibezee-845ba.firebasestorage.app",
  messagingSenderId: "456545528983",
  appId:             "1:456545528983:web:8ace5d1c6a49acf68fcdd2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
