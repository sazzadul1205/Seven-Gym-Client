import { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Background Image
import LoginBack from "../../../assets/Background-Auth/LoginBack.jpeg";

import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import SocialLinks from "../../../Shared/SocialLinks/SocialLinks";

const Login = () => {
  // Hooks for authentication, navigation, and API calls
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  const [loading, setLoading] = useState(false);

  // Determine the navigation path after login
  const from = location.state?.from?.pathname || "/";

  // Form handling with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Function to handle login alerts
  const showAlert = (type, message) => {
    Swal.fire({
      icon: type,
      title: type === "success" ? "Login Successful" : "Login Failed",
      text: message,
    });
  };

  // Function to handle form submission (optimized with useCallback)
  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const res = await signIn(data.email, data.password);
        const user = res.user;

        // Fetch user role from the database
        const response = await axiosPublic.get(`/Users?email=${user.email}`);
        const userData = response.data;

        // Redirect based on user role
        if (userData.role === "Admin" || userData.role === "Manager") {
          navigate("/Dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
          // Instead of reloading, update the user state if needed
        }

        showAlert("success", "Welcome back!");
      } catch (error) {
        console.error("Login Error:", error);
        showAlert("error", error.message || "An error occurred during login.");
      } finally {
        setLoading(false);
      }
    },
    [signIn, axiosPublic, navigate, from]
  );

  return (
    // Background styling for login page
    <div
      className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${LoginBack})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Login card container */}
      <div className="w-full max-w-md shadow-md rounded-tl-[50px] rounded-br-[50px] p-10 bg-white bg-opacity-80">
        {/* Heading section */}
        <div className="pb-5">
          <h4 className="text-3xl font-bold text-center text-[#F72C5B]">
            Welcome Back
          </h4>
          <p className="text-lg italic text-center font-semibold">
            Please Login
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email input field */}
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="name@mail.com"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#f72c5bbd] ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F72C5B] hover:bg-[#f72c5bbd] text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                <span>Logging in...</span>
              </div>
            ) : (
              "Log In"
            )}
          </button>

          {/* Sign-up link */}
          <p className="font-semibold">
            Don&apos;t have an Account? Please{" "}
            <Link to="/SignUp" className="text-[#F72C5B] hover:underline">
              Sign Up
            </Link>
          </p>
        </form>

        {/* Divider for social login options */}
        <div className="flex w-full flex-col border-opacity-50">
          <div className="divider font-bold">OR</div>
        </div>

        {/* Social login component */}
        <SocialLinks />
      </div>
    </div>
  );
};

export default Login;
