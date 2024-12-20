/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import auth from "../Firebase/firebase.config";

// Create AuthContext
export const AuthContext = createContext(null);

// Initialize Google and Facebook Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Ensure user is initialized to null
  const [loading, setLoading] = useState(true); // Loading state for auth actions

  // Create a new user
  const createUser = async (email, password) => {
    setLoading(true);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error creating user:", error);
      setLoading(false);
      throw error; // Rethrow the error for higher-level handling
    }
  };

  // Update User Info
  const updateUser = async (displayName, photoURL) => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName, photoURL });
        setLoading(false);
      } else {
        throw new Error("No current user found");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setLoading(false);
      throw error; // Rethrow the error for higher-level handling
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error);
      setLoading(false);
      throw error; // Rethrow the error for higher-level handling
    }
  };

  // Sign out user
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setLoading(false);
    } catch (error) {
      console.error("Error logging out:", error);
      setLoading(false);
      throw error; // Rethrow the error for higher-level handling
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
      throw error; // Rethrow the error for higher-level handling
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    setLoading(true);
    try {
      return await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      setLoading(false);
      throw error; // Rethrow the error for higher-level handling
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once user is set
    });
    return () => unSubscribe(); // Cleanup subscription on unmount
  }, []);

  // Provide auth info to the rest of the app
  const authInfo = {
    user,
    loading,
    createUser,
    logOut,
    signIn,
    signInWithGoogle,
    signInWithFacebook, // Added Facebook login to context
    updateUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
