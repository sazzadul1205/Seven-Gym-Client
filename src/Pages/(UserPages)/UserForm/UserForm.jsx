import { useNavigate } from "react-router";

// Import Background Image
import Classes_Background from "../../../assets/Classes-Background/Classes_Background.jpg";

// Import PAckages
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Import Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Shared
import Loading from "../../../Shared/Loading/Loading";
import CommonButton from "../../../Shared/Buttons/CommonButton";
import FetchingError from "../../../Shared/Component/FetchingError";

const UserForm = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch user data
  const {
    data: UsersData,
    isLoading: UsersIsLoading,
    error: UsersError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user?.email}`).then((res) => res.data),
  });

  // Loading state
  if (UsersIsLoading) return <Loading />;

  // Error state
  if (UsersError) {
    return <FetchingError />;
  }

  const onSubmit = async (formData) => {
    try {
      // Ensure we have the logged-in user's info
      if (!user?.email || !UsersData?._id) {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "Unable to find your user information. Please try again.",
        });
        return;
      }

      // Build payload
      const payload = {
        ...formData,
        email: user.email,
        userId: UsersData._id,
        submittedAt: new Date(),
      };

      // POST to backend
      await axiosPublic.post("/User_Form", payload);

      // Success alert + redirect
      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Thank you! Redirecting you to the home page...",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        reset();
        navigate("/");
      });
    } catch (error) {
      console.error("Error submitting employment form:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Classes_Background})`,
      }}
    >
      <div className="bg-linear-b from-gray-200/90 to-gray-400">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl bg-white bg-opacity-90 rounded-lg shadow-lg p-6 space-y-4 text-black mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Employment Application
          </h2>

          {/* Full Name */}
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-gray-300 p-2 rounded"
              readOnly
              value={user.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              {...register("phone", { required: "Phone number is required" })}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Date of Birth & Gender */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                {...register("dob", { required: "Date of birth is required" })}
                className="w-full border border-gray-300 p-2 rounded"
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Post Applying For */}
          <div>
            <label className="block font-semibold mb-1">
              Post Applying For
            </label>
            <select
              {...register("position", {
                required: "Please select a position",
              })}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Select Position</option>
              <option value="Class Manager">Class Manager</option>
              <option value="Trainer">Trainer</option>
            </select>
            {errors.position && (
              <p className="text-red-500 text-sm">{errors.position.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold mb-1">Address</label>
            <textarea
              {...register("address", { required: "Address is required" })}
              rows={3}
              className="w-full border border-gray-300 p-2 rounded"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block font-semibold mb-1">Experience</label>
            <textarea
              {...register("experience")}
              rows={3}
              placeholder="Mention your past work experience, certifications, etc."
              className="w-full border border-gray-300 p-2 rounded"
            ></textarea>
          </div>

          {/* Skills */}
          <div>
            <label className="block font-semibold mb-1">Skills</label>
            <input
              type="text"
              {...register("skills")}
              placeholder="e.g., Yoga, Weightlifting, Time Management"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block font-semibold mb-1">
              Upload Resume (Optional)
            </label>
            <input
              type="file"
              {...register("resume")}
              className="w-full border border-gray-300 p-2 rounded bg-white"
            />
          </div>

          {/* Submit Button */}
          <CommonButton
            type="submit"
            text="Submit Application"
            bgColor="blue"
            width="full"
            px="px-4"
            py="py-2"
            borderRadius="rounded"
            className="mt-2"
          />
        </form>
      </div>
    </div>
  );
};

// Prop Validation
UserForm.propTypes = {};

export default UserForm;
