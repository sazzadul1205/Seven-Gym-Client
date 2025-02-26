import { useState } from "react";
import { Link, useNavigate } from "react-router";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

import useAuth from "../../../Hooks/useAuth";
import SocialLinks from "../../../Shared/SocialLinks/SocialLinks";

// Background Image
import LoginBack from "../../../assets/Background-Auth/LoginBack.jpeg";

const SignUp = () => {
  // Custom authentication hook
  const { createUser } = useAuth();
  const navigate = useNavigate();

  // Loading state for form submission
  const [loading, setLoading] = useState(false);

  // Form validation & state handling using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Watch password input to validate confirm password
  const password = watch("password");

  // Function to handle form submission
  const onSubmit = (data) => {
    const { email, password } = data;
    setLoading(true); // Start loading

    // Create user account
    createUser(email, password)
      .then(() => {
        setLoading(false); // Stop loading
        navigate("/SignUp/Details"); // Redirect to details page after successful signup

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User created successfully.",
          confirmButtonColor: "#F72C5B",
        });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        setLoading(false); // Stop loading

        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.message,
          confirmButtonColor: "#F72C5B",
        });
      });
  };

  return (
    <div>
      {/* Background image and layout styling */}
      <div
        className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${LoginBack})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Sign-up card container */}
        <div
          className="w-full max-w-lg shadow-md rounded-tl-[50px] rounded-br-[50px] p-10"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        >
          {/* Form title */}
          <div className="pb-5">
            <h4 className="text-3xl font-bold text-center text-[#F72C5B]">
              Sign Up Form
            </h4>
          </div>

          {/* Sign-up form */}
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

            {/* Confirm password field */}
            <div>
              <label className="block text-gray-700 font-semibold text-xl pb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className={`w-full ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#F72C5B] hover:bg-[#f72c5bbd]"
              } text-white py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#f72c5bbd]`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            {/* Login link for existing users */}
            <p className="font-semibold">
              Already have an Account?{" "}
              <Link to={"/Login"} className="text-[#F72C5B] hover:underline">
                Login
              </Link>
            </p>
          </form>

          {/* Divider for social sign-up options */}
          <div className="flex w-full flex-col border-opacity-50">
            <div className="divider font-bold">OR</div>
          </div>

          {/* Social login component */}
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
