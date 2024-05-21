import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoe3ZptSKWu4Y8hH6UZMvfuJEcB_ykf4Y",
  authDomain: "householdtypescript-906f7.firebaseapp.com",
  projectId: "householdtypescript-906f7",
  storageBucket: "householdtypescript-906f7.appspot.com",
  messagingSenderId: "458685633453",
  appId: "1:458685633453:web:bb6fbdd3b5b6c496570724",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
