import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "stag-hunt-game",
  appId: "1:848803728748:web:451f0fe8ce971aa91d3749",
  storageBucket: "stag-hunt-game.firebasestorage.app",
  apiKey: "AIzaSyAetEggWMfEjlcfOmwdPsz_TvgVgiYZOEk",
  authDomain: "stag-hunt-game.firebaseapp.com",
  messagingSenderId: "848803728748"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
