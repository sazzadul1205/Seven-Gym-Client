import { useEffect, useState, useCallback } from "react";

// import Packages
import PropTypes from "prop-types";

// Import Firebase Auth
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

// Import Firebase Config
import auth from "../Firebase/firebase.config";

// Import Context
import { AuthContext } from "./AuthContext";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Request server-side JWT and store with expiry
// Fetch server-side JWT and store with expiry in localStorage
const fetchServerToken = async (user, axiosPublic) => {
  try {
    const payload = {
      id: user?.uid,
      email: user?.email,
      role: user?.role || "user", // fallback, optional
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

const AuthProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clears localStorage + resets auth state
  const resetUserState = useCallback(() => {
    localStorage.removeItem("authData");
    setUser(null);
    setLoading(false);
  }, []);

  // Register user with email/password
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
        // exchange for server JWT
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

  // Update Firebase user profile
  const updateUser = useCallback(async (displayName, photoURL) => {
    try {
      if (!auth.currentUser) throw new Error("No current user found");
      await updateProfile(auth.currentUser, { displayName, photoURL });
      setUser((prev) => ({ ...prev, displayName, photoURL }));
    } catch (error) {
      console.error("Update User Error:", error.message);
      throw error;
    }
  }, []);

  // Sign in with email/password
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

  // Sign out user and clear token
  const logOut = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
      resetUserState();
    } catch (error) {
      console.error("Logout Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [resetUserState]);

  // Social sign-ins
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

  // On load, check auth state and token expiry
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

  // Auto-logout when server token expires
  useEffect(() => {
    const interval = setInterval(() => {
      const authData = JSON.parse(localStorage.getItem("authData"));
      if (authData && authData.expiry <= Date.now()) {
        logOut();
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [logOut]);

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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
