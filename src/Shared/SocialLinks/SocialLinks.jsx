import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useNavigate, useLocation } from "react-router";

const SocialLinks = () => {
  const { signInWithGoogle, signInWithFacebook } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const checkUserExists = async (email) => {
    try {
      const response = await axiosPublic.get(
        `/Users/check-email?email=${email}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking user existence:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to check user existence. Please try again.",
        confirmButtonColor: "#d33",
        timer: 3000,
      });
      return null;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      const email = res.user.email;
      const userExists = await checkUserExists(email);

      if (userExists) {
        // Redirect to previous page if user exists
        navigate(from, { replace: true });
      } else {
        // Redirect to SignUp/Details page if user does not exist
        navigate("/SignUp/Details", { replace: true });
      }
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: `Google login failed: ${error.message}`,
        confirmButtonColor: "#d33",
        timer: 3000,
      });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const res = await signInWithFacebook();
      const email = res.user.email;
      const userExists = await checkUserExists(email);

      if (userExists) {
        // Redirect to previous page if user exists
        navigate(from, { replace: true });
      } else {
        // Redirect to SignUp/Details page if user does not exist
        navigate("/SignUp/Details", { replace: true });
      }
    } catch (error) {
      console.error("Facebook login error:", error);
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
    <div className="space-y-2">
      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="flex border-2 border-[#F72C5B] bg-white hover:bg-[#F72C5B] hover:text-white rounded-xl w-full py-3 justify-center gap-5"
      >
        <FcGoogle className="text-xl" />
        <span className="font-semibold">Sign Up With Google</span>
      </button>

      {/* Facebook Login */}
      <button
        onClick={handleFacebookLogin}
        className="flex border-2 border-[#F72C5B] bg-white hover:bg-[#F72C5B] hover:text-white rounded-xl w-full py-3 justify-center gap-5"
      >
        <FaFacebookSquare className="text-xl text-[#1877F2]" />
        <span className="font-semibold">Sign Up With Facebook</span>
      </button>
    </div>
  );
};

export default SocialLinks;
