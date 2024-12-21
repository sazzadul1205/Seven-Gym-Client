import { useForm } from "react-hook-form";
import LoginBack from "../../../assets/LoginBack.jpeg";

const SUDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
      <div className="bg-[#F72C5B] py-11"></div>
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
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+8801234567890"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\+880[0-9]{9}$/,
                  message: "Phone number must start with +880 and be 13 digits",
                },
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
              {...register("dob", { required: "Date of birth is required" })}
            />
            {errors.dob && (
              <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
              Gender
            </label>
            <select
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
              {...register("gender", { required: "Gender is required" })}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
              Address
            </label>
            <input
              type="text"
              placeholder="Street, City, ZIP"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Fitness Goals */}
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
              Fitness Goals
            </label>
            <select
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
              {...register("fitnessGoals")}
            >
              <option value="weightLoss">Weight Loss</option>
              <option value="muscleGain">Muscle Gain</option>
              <option value="endurance">Endurance</option>
              <option value="generalFitness">General Fitness</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#F72C5B] hover:bg-[#f72c5bbd] text-white py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#f72c5bbd]"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SUDetails;
