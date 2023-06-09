import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBx7CogrGItu75DtyO72xU7tBnld5YzPio",
  authDomain: "curso5firebase.firebaseapp.com",
  projectId: "curso5firebase",
  storageBucket: "curso5firebase.appspot.com",
  messagingSenderId: "940005053895",
  appId: "1:940005053895:web:b01684067646ece720b5e2",
};

//const firebaseApp = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(app);
//const storage = getStorage(firebaseApp);
export { auth, db, storage };
