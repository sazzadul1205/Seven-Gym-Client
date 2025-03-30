import { useNavigate, useLocation } from "react-router";

import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";

import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";

const SocialLinks = () => {
  const axiosPublic = useAxiosPublic();
  const { signInWithGoogle, signInWithFacebook } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Default redirect path
  const from = location.state?.from?.pathname || "/";

  // Function to check if the user already exists based on their email
  const checkUserExists = async (email) => {
    try {
      const response = await axiosPublic.get(
        `/Users/check-email?email=${email}`
      );
      return response.data.exists; // Returns true if the user exists
    } catch (error) {
      console.error("Error checking user existence:", error);
      // Show error message in case of failure
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to check user existence. Please try again.",
        confirmButtonColor: "#d33",
        timer: 3000,
      });
      return false; // Return false if there was an error
    }
  };

  // Handler for Google login
  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      const email = res.user.email; // Extract the email from the Google response
      const userExists = await checkUserExists(email);

      if (userExists) {
        // Redirect to previous page if the user exists
        navigate(from, { replace: true });
      } else {
        // Redirect to the SignUp/Details page if the user doesn't exist
        navigate("/SignUp/Details", { replace: true });
      }
    } catch (error) {
      console.error("Google login error:", error);
      // Show error message if Google login fails
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: `Google login failed: ${error.message}`,
        confirmButtonColor: "#d33",
        timer: 3000,
      });
    }
  };

  // Handler for Facebook login
  const handleFacebookLogin = async () => {
    try {
      const res = await signInWithFacebook();
      const email = res.user.email; // Extract the email from the Facebook response
      const userExists = await checkUserExists(email);

      if (userExists) {
        // Redirect to previous page if the user exists
        navigate(from, { replace: true });
      } else {
        // Redirect to the SignUp/Details page if the user doesn't exist
        navigate("/SignUp/Details", { replace: true });
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      // Show error message if Facebook login fails
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: `Facebook login failed: ${error.message}`,
        confirmButtonColor: "#d33",
        timer: 3000,
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Login Button */}
      <div>
        <button
          onClick={handleGoogleLogin}
          className="flex bg-linear-to-bl hover:bg-linear-to-tr from-[#b8264a] to-[#fc003f] text-white rounded-xl w-full py-3 justify-center gap-5 cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          <span className="font-semibold">Sign Up With Google</span>
        </button>
      </div>

      {/* Facebook Login Button */}
      <div>
        <button
          onClick={handleFacebookLogin}
          className="flex bg-linear-to-bl hover:bg-linear-to-tr from-[#b8264a] to-[#fc003f] text-white rounded-xl w-full py-3 justify-center gap-5 cursor-pointer"
        >
          <FaFacebookSquare className="text-xl text-[#1877F2]" />
          <span className="font-semibold">Sign Up With Facebook</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLinks;
