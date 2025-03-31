import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types"; // Import PropTypes
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

import { AuthContext } from "./AuthContext";

// Initialize Google and Facebook Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create a new user
  const createUser = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Create User Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update User Info
  const updateUser = useCallback(async (displayName, photoURL) => {
    try {
      if (!auth.currentUser) throw new Error("No current user found");

      await updateProfile(auth.currentUser, { displayName, photoURL });
      setUser((prevUser) => ({ ...prevUser, displayName, photoURL }));
    } catch (error) {
      console.error("Update User Error:", error.message);
      throw error;
    }
  }, []);

  // Sign in with email and password
  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Sign In Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out user
  const logOut = useCallback(async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign in with Facebook
  const signInWithFacebook = useCallback(async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, facebookProvider);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error("Facebook Sign-In Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  // Provide auth info to the rest of the app
  const authInfo = {
    user,
    loading,
    createUser,
    logOut,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

// ✅ Add PropTypes for type checking
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
