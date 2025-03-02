import { useState } from "react";
import { useNavigate } from "react-router";

import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import ImageCropper from "./ImageCropper/ImageCropper";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FitnessGoalsSelector from "./FitnessGoalsSelector/FitnessGoalsSelector";

// Background Image
import LoginBack from "../../../assets/Background-Auth/LoginBack.jpeg";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const SignUpDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // State hooks for form data and image
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Query to check if the user already exists
  const {
    data: UserExists,
    isLoading: UserExistsIsLoading,
    error: UserExistsError,
  } = useQuery({
    queryKey: ["UserExists"],
    queryFn: () =>
      axiosPublic
        .get(`/Users/check-email?email=${user?.email}`)
        .then((res) => res.data),
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Confirm before creating the account
  const confirmAndSubmit = async (data) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create your account with the provided details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create my account",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) {
      return; // If the user cancels, stop the process
    }

    // Proceed with account creation if confirmed
    onSubmit(data);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true); // Set loading to true when submission starts
    let uploadedImageUrl = null;

    // Image upload logic
    if (profileImage) {
      const formData = new FormData();
      formData.append("image", profileImage);
      try {
        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedImageUrl = res.data.data.display_url; // Get image URL
      } catch (error) {
        console.error("Failed to upload image:", error);
        setLoading(false); // Stop loading on error
        Swal.fire({
          icon: "error",
          title: "Image Upload Failed",
          text: "Failed to upload the image. Please try again.",
        });
        return;
      }
    }

    // Prepare form data for submission
    const creationTime = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const formDataWithImage = {
      email: user.email,
      ...data,
      profileImage: uploadedImageUrl,
      selectedGoals,
      creationTime,
      role: "Member",
      tier: "Bronze",
      description: "No description provided.",
      backgroundImage: "https://via.placeholder.com/1920x1080",
      socialLinks: {
        facebook: "",
        instagram: "",
        twitter: "",
        telegram: "",
      },
      badges: [],
      attendingTrainer: [],
      attendingClasses: [],
      awards: [],
      recentWorkouts: [],
    };

    // Post the data to the server
    try {
      await axiosPublic.post("/Users", formDataWithImage);
      setLoading(false); // Stop loading on success
      navigate("/"); // Redirect to the home page
      window.location.reload(); // Reload the page after navigation
    } catch (error) {
      console.error("Failed to create the account:", error);
      setLoading(false); // Stop loading on error
      Swal.fire({
        icon: "error",
        title: "Account Creation Failed",
        text:
          error.response?.data?.message ||
          "Failed to create the account. Please try again.",
      });
    }
  };

  // Handle loading and error states
  if (UserExistsIsLoading) {
    return <Loading />;
  }

  if (UserExistsError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // If user already exists
  if (UserExists?.exists) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-300 to-white">
        <div className="text-center text-2xl font-bold text-red-500 mb-6">
          You already have an account.
        </div>
        <div className="text-center mb-6">
          <p className="text-lg text-gray-700">
            To modify your information, go to your profile update page.
          </p>
        </div>
        <button
          onClick={() => navigate("/User/UserSettings?tab=Settings_Info")}
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
        >
          Go to Profile Update
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${LoginBack})`,
      }}
    >
      <div className="w-full max-w-7xl shadow-md rounded-tl-[50px] rounded-br-[50px] p-10 bg-white bg-opacity-90">
        {/* Forms */}
        <form onSubmit={handleSubmit(confirmAndSubmit)}>
          {/* Content */}
          <div className="flex gap-10 pb-10">
            {/* Left Side Data */}
            <div className="w-1/2 space-y-4">
              <ImageCropper
                onImageCropped={setProfileImage}
                register={register}
                errors={errors}
              />
              <InputField
                label="Full Name"
                placeholder="John Doe"
                register={register}
                errors={errors}
                name="fullName"
              />
            </div>

            {/* Right Side Data */}
            <div className="w-1/2 space-y-4">
              <InputField
                label="Phone Number"
                placeholder="+8801234567890"
                register={register}
                errors={errors}
                name="phone"
              />
              <InputField
                label="Date of Birth"
                placeholder=""
                register={register}
                errors={errors}
                name="dob"
                type="date"
              />
              <GenderSelectField register={register} errors={errors} />
              <FitnessGoalsSelector
                selectedGoals={selectedGoals}
                setSelectedGoals={setSelectedGoals}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading} // Disable the button when loading
              className={`w-1/3 bg-[#F72C5B] hover:bg-[#f72c5bbd] text-white py-3 rounded-lg font-medium focus:outline-hidden focus:ring-2 focus:ring-[#f72c5bbd] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({
  label,
  placeholder,
  register,
  errors,
  name,
  type = "text",
}) => (
  <div>
    <label className="block text-gray-700 font-semibold text-xl pb-2">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#F72C5B]"
      {...register(name, { required: `${label} is required` })}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

// Add PropTypes for InputField
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
};

// Reusable Gender Select Field Component
const GenderSelectField = ({ register, errors }) => (
  <div>
    <label className="block text-gray-700 font-semibold text-xl pb-2">
      Gender
    </label>
    <select
      className="w-full px-4 py-3 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#F72C5B]"
      {...register("gender", { required: "Gender is required" })}
    >
      <option value="">Select</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
    {errors.gender && (
      <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
    )}
  </div>
);

// Add PropTypes for GenderSelectField
GenderSelectField.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export { InputField, GenderSelectField };

export default SignUpDetails;
