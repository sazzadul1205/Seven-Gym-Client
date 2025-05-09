// React core
import { useEffect, useState, useCallback } from "react";

// PropTypes for validating props
import PropTypes from "prop-types";

// Firebase Auth SDK
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

// Firebase configuration (custom setup)
import auth from "../Firebase/firebase.config";

// Context for sharing auth across app
import { AuthContext } from "./AuthContext";

// Custom hook for Axios instance (public)
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Initialize Google and Facebook Auth Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/**
 * Fetch server-side JWT after Firebase login and store it in localStorage.
 * Token includes a 10-day expiry timestamp.
 */
const fetchServerToken = async (user, axiosPublic) => {
  try {
    const payload = {
      id: user?.uid,
      email: user?.email,
      role: user?.role || "user", // fallback role
    };

    const response = await axiosPublic.post("/jwt", { user: payload });
    const token = response?.data?.token;

    if (!token) throw new Error("Token missing in response.");

    const expiry = Date.now() + 10 * 24 * 60 * 60 * 1000; // 10 days
    localStorage.setItem("authData", JSON.stringify({ token, expiry }));
  } catch (error) {
    console.error("Error fetching server JWT:", error.message);
    throw error;
  }
};

/**
 * AuthProvider component - wraps around app to provide auth state and methods
 */
const AuthProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Clears local auth state and localStorage token
   */
  const resetUserState = useCallback(() => {
    localStorage.removeItem("authData");
    setUser(null);
    setLoading(false);
  }, []);

  /**
   * Register user using Firebase Email/Password
   */
  const createUser = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(userCredential.user);
        await fetchServerToken(userCredential.user, axiosPublic);
        return userCredential;
      } catch (error) {
        console.error("Create User Error:", error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [axiosPublic]
  );

  /**
   * Update Firebase profile (name, photo)
   */
  const updateUser = useCallback(async (displayName, photoURL) => {
    try {
      if (!auth.currentUser) throw new Error("No current user found");
      await updateProfile(auth.currentUser, { displayName, photoURL });

      // Also update state manually to reflect changes
      setUser((prev) => ({ ...prev, displayName, photoURL }));
    } catch (error) {
      console.error("Update User Error:", error.message);
      throw error;
    }
  }, []);

  /**
   * Log in using Email/Password
   */
  const signIn = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(userCredential.user);
        await fetchServerToken(userCredential.user, axiosPublic);
        return userCredential;
      } catch (error) {
        console.error("Sign In Error:", error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [axiosPublic]
  );

  /**
   * Sign in with Google
   */
  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      await fetchServerToken(result.user, axiosPublic);
      return result;
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [axiosPublic]);

  /**
   * Sign in with Facebook
   */
  const signInWithFacebook = useCallback(async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      setUser(result.user);
      await fetchServerToken(result.user, axiosPublic);
      return result;
    } catch (error) {
      console.error("Facebook Sign-In Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [axiosPublic]);

  /**
   * Logout user and reset auth state
   */
  const logOut = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
      resetUserState();
      return { success: true, message: "Logout successful" };
    } catch (error) {
      console.error("Logout Error:", error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [resetUserState]);

  /**
   * Check Firebase auth + local token on mount
   */
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const now = Date.now();

      if (authData && authData.expiry > now && currentUser) {
        setUser(currentUser);
      } else {
        resetUserState();
      }

      setLoading(false);
    });

    return () => unSubscribe();
  }, [resetUserState]);

  /**
   * Auto-logout when token expires (check every 1 min)
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const authData = JSON.parse(localStorage.getItem("authData"));
      if (authData && authData.expiry <= Date.now()) {
        logOut();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [logOut]);

  /**
   * Exported context value
   */
  const authInfo = {
    user,
    logOut,
    signIn,
    loading,
    updateUser,
    createUser,
    signInWithGoogle,
    signInWithFacebook,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

// Validate prop types
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
