import { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Background Image
import LoginBack from "../../../assets/Background-Auth/LoginBack.jpeg";

import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import SocialLinks from "../../../Shared/SocialLinks/SocialLinks";
import CommonButton from "../../../Shared/Buttons/CommonButton";

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
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // Function to handle form submission (optimized with useCallback)
  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        // Attempt sign-in
        const res = await signIn(data.email, data.password);
        const user = res?.user;

        if (!user) {
          showAlert("error", "No user found with this email.");
          return;
        }

        // Fetch user role **in parallel** to reduce load time
        const response = axiosPublic.get(`/Users?email=${user.email}`);

        // Wait for the response
        const userData = await response;

        if (!userData?.data?.role) {
          showAlert("error", "User data not found. Please contact support.");
          return;
        }

        // Navigate based on user role
        if (
          userData.data.role === "Admin" ||
          userData.data.role === "Manager"
        ) {
          navigate("/Dashboard", { replace: true });
        } else if (userData.data.role === "Trainer") {
          navigate("/Trainer", { replace: true });
        } else {
          navigate(from, { replace: true });
        }

        showAlert("success", "You have successfully logged in!");
      } catch (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Invalid email or password."
        );
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
      <div className="w-full max-w-lg shadow-md rounded-tl-[50px] rounded-br-[50px] px-3 py-10 md:px-10 md:py-10 bg-linear-to-bl from-gray-100 to-gray-400">
        {/* Heading section */}
        <div className="pb-5">
          <h4 className="text-3xl font-bold text-center text-[#F72C5B]">
            Welcome Back
          </h4>

          {/* Please Login */}
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
              className="input w-full text-black bg-white rounded-xl shadow-lg hover:shadow-xl focus:shadow-xl"
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
              className="input w-full text-black bg-white rounded-xl shadow-lg hover:shadow-xl focus:shadow-xl"
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
          <CommonButton
            type="submit"
            text="Log In"
            isLoading={loading}
            loadingText="Logging In..."
            textColor="text-white"
            bgColor="OriginalRed"
            borderRadius="rounded-xl"
            width="full"
            px="px-5"
            py="py-3"
            disabled={loading}
          />

          {/* Sign-up link */}
          <p className="font-semibold text-black pt-2">
            Don&apos;t have an Account? Please{" "}
            <Link
              to="/SignUp"
              className="text-[#F72C5B] font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>

        {/* Divider for social login options */}
        <div className="divider divider-neutral text-black font-semibold">
          OR
        </div>

        {/* Social login component */}
        <SocialLinks />
      </div>
    </div>
  );
};

export default Login;
