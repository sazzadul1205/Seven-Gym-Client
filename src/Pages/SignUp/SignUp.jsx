import { useForm } from "react-hook-form";
import LoginBack from "../../assets/LoginBack.jpeg";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import SocialLinks from "../../Shared/SocialLinks/SocialLinks";

const SignUp = () => {
  const { createUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    const { email, password } = data;

    // Create User
    createUser(email, password)
      .then((res) => {
        const user = res.user;
        console.log("User created successfully:", user);
        navigate("/SignUp/Details");

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
      <div className="bg-[#F72C5B] py-11"></div>
      <div
        className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${LoginBack})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* SignUp Card */}
        <div
          className="w-full max-w-lg shadow-md rounded-tl-[50px] rounded-br-[50px] p-10"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Transparent background
          }}
        >
          {/* Welcome Part */}
          <div className="pb-5">
            <h4 className="text-3xl font-bold text-center text-[#F72C5B]">
              Sign Up Form
            </h4>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Confirm Password Field */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#F72C5B] hover:bg-[#f72c5bbd] text-white py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#f72c5bbd]"
            >
              Sign Up
            </button>

            {/* Sign Up link */}
            <p className="font-semibold">
              Already have an Account, Please{" "}
              <Link to={"/Login"} className="text-[#F72C5B] hover:underline">
                Login
              </Link>
            </p>
          </form>

          <div className="flex w-full flex-col border-opacity-50">
            <div className="divider font-bold">OR</div>
          </div>

          <SocialLinks></SocialLinks>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
