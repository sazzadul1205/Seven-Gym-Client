import { useForm } from "react-hook-form";
import LoginBack from "../../../assets/LoginBack.jpeg";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import SocialLinks from "../../../Shared/SocialLinks/SocialLinks";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Normal login
  const onSubmit = (data) => {
    setLoading(true);
    signIn(data.email, data.password)
      .then((res) => {
        const user = res.user;
        // Fetch user role from the database
        return axiosPublic.get(`/Users?email=${user.email}`);
      })
      .then((response) => {
        const userData = response.data;
        if (userData.role === "Admin" || userData.role === "Manager") {
          navigate("/Dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
          window.location.reload(); // Reload the page after navigation
        }
        // showSuccessLogInAlert();
      })
      .catch((error) => {
        console.error("Error during login:", error);
        showFailedLogInAlert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${LoginBack})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full max-w-md shadow-md rounded-tl-[50px] rounded-br-[50px] p-10"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <div className="pb-5">
          <h4 className="text-3xl font-bold text-center text-[#F72C5B]">
            Welcome Back
          </h4>
          <p className="text-lg italic text-center font-semibold">
            Please Login
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#f72c5bbd] ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F72C5B] hover:bg-[#f72c5bbd] text-white"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="font-semibold">
            Don&apos;t have an Account? Please{" "}
            <Link to="/SignUp" className="text-[#F72C5B] hover:underline">
              Sign Up
            </Link>
          </p>
        </form>

        <div className="flex w-full flex-col border-opacity-50">
          <div className="divider font-bold">OR</div>
        </div>

        <SocialLinks></SocialLinks>
      </div>
    </div>
  );
};

export default Login;

// const showSuccessLogInAlert = () => {
//   Swal.fire({
//     icon: "success",
//     title: "Login Successful!",
//     text: "You are now logged in.",
//   });
// };

const showFailedLogInAlert = (errorMessage) => {
  Swal.fire({
    icon: "error",
    title: "Login Failed",
    text: errorMessage,
  });
};
