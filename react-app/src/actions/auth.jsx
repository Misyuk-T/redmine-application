import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { get, getDatabase, push, ref } from "firebase/database";

import { initializeApp } from "firebase/app";
import useAuthStore from "../store/userStore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const openLoginPopup = async () => {
  provider.addScope("profile");
  provider.addScope("email");
  await signInWithRedirect(auth, provider).then();
};

export const loginUser = async (googleUserData) => {
  try {
    const { displayName, email, photoURL, uid } = googleUserData;
    const userData = {
      name: displayName,
      email: email,
      photo: photoURL,
      ownerId: uid,
      schedules: [],
    };
    const db = getDatabase();
    const usersRef = ref(db, "users");
    const userQuery = await get(usersRef);
    let existingUserData = null;

    if (userQuery.exists()) {
      userQuery.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.ownerId === uid) {
          existingUserData = user;
        }
      });
    }

    if (!existingUserData) {
      await push(usersRef, userData);
      existingUserData = { ...userData, id: usersRef.key };
      console.log("User saved to database:");
    }

    useAuthStore.setState({ user: existingUserData });
  } catch (err) {
    console.error(err);
  }
};

export const logoutUser = async () => {
  await signOut(auth).then(() => {
    useAuthStore.setState({ isAuthObserve: true });
  });
};

export const observeAuth = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await loginUser(user);
    } else {
      await logoutUser();
    }
  });
};
