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
      <div className="w-full max-w-lg shadow-md rounded-tl-[50px] rounded-br-[50px] p-10 bg-white/80 ">
        {/* Heading section */}
        <div className="pb-5">
          <h4 className="text-3xl font-bold text-center text-[#F72C5B]">
            Welcome Back
          </h4>
          <p className="text-lg text-black italic text-center font-semibold">
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
              placeholder="Example@gmail.com"
              className="input w-full text-black bg-white rounded-2xl shadow-lg hover:shadow-xl focus:shadow-xl"
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
              className="input w-full text-black bg-white rounded-2xl shadow-lg hover:shadow-xl focus:shadow-xl"
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
            className={`w-full text-4xl font-bold rounded-xl py-3 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-linear-to-bl hover:bg-linear-to-tr from-[#b8264a] to-[#fc003f] text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                <span>Logging In ...</span>
              </div>
            ) : (
              "Log In"
            )}
          </button>

          {/* Sign-up link */}
          <p className="font-semibold text-black pt-2">
            Don&apos;t have an Account? Please{" "}
            <Link
              to="/SignUp"
              className="text-[#F72C5B] font-semibold hover:font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>

        {/* Divider for social login options */}
        <div className="divider divider-neutral text-black font-semibold">OR</div>

        {/* Social login component */}
        <SocialLinks />
      </div>
    </div>
  );
};

export default Login;
