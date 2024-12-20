import { useForm } from "react-hook-form";
import LoginBack from "../../assets/LoginBack.jpeg";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { Link } from "react-router";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    alert("Login successful!");
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
      {/* Login Card */}
      <div
        className="w-full max-w-md shadow-md rounded-tl-[50px] rounded-br-[50px] p-10"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Transparent background
        }}
      >
        {/* Welcome Part */}
        <div className="pb-5">
          <h4 className="text-3xl font-bold text-center text-[#F72C5B]">
            Welcome Back
          </h4>
          <p className="text-lg italic text-center font-semibold">
            Please Login
          </p>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#F72C5B] hover:bg-[#f72c5bbd] text-white py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#f72c5bbd]"
          >
            Log In
          </button>

          {/* Sign Up */}
          <p className="font-semibold">
            Don&apos;t have an Account , Please{" "}
            <Link to={"/SignUp"} className="text-[#F72C5B] hover:underline">
              SignUp
            </Link>
          </p>
        </form>

        <div className="flex w-full flex-col border-opacity-50">
          <div className="divider font-bold">OR</div>
        </div>

        {/* Outside Login L9ink */}
        <div className="space-y-2">
          {/* Google Login */}
          <button className="flex border-2 border-[#F72C5B] bg-white hover:bg-[#F72C5B] hover:text-white rounded-xl w-full py-3 justify-center gap-5">
            <FcGoogle className="text-xl" />
            <span className="font-semibold">Log In With Google</span>
          </button>
          {/* Facebook Login */}
          <button className="flex border-2 border-[#F72C5B] bg-white hover:bg-[#F72C5B] hover:text-white rounded-xl w-full py-3 justify-center gap-5">
            <FaFacebookSquare className="text-xl text-[#1877F2]" />
            <span className="font-semibold">Log In With Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
