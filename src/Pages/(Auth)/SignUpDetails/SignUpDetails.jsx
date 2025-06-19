import { useState } from "react";
import { useNavigate } from "react-router";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// import Hooks
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

// import Cropper
import ImageCropper from "./ImageCropper/ImageCropper";

// Import Selector
import FitnessGoalsSelector from "./FitnessGoalsSelector/FitnessGoalsSelector";

// Import Background
import LoginBack from "../../../assets/Background-Auth/LoginBack.jpeg";

// Import Button
import CommonButton from "../../../Shared/Buttons/CommonButton";

// import Phone
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
  const [phoneNumber, setPhoneNumber] = useState("");
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
    // Set loading to true when submission starts
    setLoading(true);

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
        setLoading(false); // Stop loading on error
        Swal.fire({
          icon: "error",
          title: "Image Upload Failed",
          text: `Failed to upload the image. ${
            error?.response?.data?.message ||
            error.message ||
            "Please try again."
          }`,
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
      phone: phoneNumber,
      ...data,
      profileImage: uploadedImageUrl,
      selectedGoals,
      creationTime,
      role: "Member",
      tier: "Bronze",
      description: "No description provided.",
      backgroundImage: "https://via.placeholder.com/1920x1080",
      socialLinks: {},
      badges: [],
      attendingTrainer: [],
      attendingClasses: [],
      awards: [],
      recentWorkouts: [],
    };

    // Post the data to the server
    try {
      await axiosPublic.post("/Users", formDataWithImage);
      setLoading(false);
      navigate("/", { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to create the account:", error);
      setLoading(false);
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
    return <FetchingError />;
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
      <div className="w-full max-w-7xl shadow-md rounded-tl-[50px] rounded-br-[50px] px-3 py-10 md:px-10 md:py-10 bg-linear-to-bl from-gray-100 to-gray-400 mt-20 md:mt-0">
        {/* Header */}
        <div className="py-3">
          <h4 className="text-3xl font-bold text-center text-[#F72C5B]">
            Trainer Details
          </h4>
        </div>

        {/* Forms */}
        <form onSubmit={handleSubmit(confirmAndSubmit)}>
          {/* Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10 items-center">
            {/* Left Side Data */}
            <div className="space-y-4">
              <div className="bg-white py-2 px-1 bg-linear-to-bl from-gray-100 to-gray-400">
                {/* Title */}
                <h3 className="text-black font-semibold text-xl">
                  Trainer Profile
                </h3>

                {/* Cropper Component */}
                <ImageCropper
                  onImageCropped={setProfileImage}
                  register={register}
                  errors={errors}
                />
              </div>
              <InputField
                label="Full Name"
                placeholder="John Doe"
                register={register}
                errors={errors}
                name="fullName"
                type="text"
              />
            </div>

            {/* Right Side Data */}
            <div className="space-y-4">
              <PhoneInput
                country={"bd"}
                value={phoneNumber}
                onChange={setPhoneNumber}
                inputClass="!w-full !bg-white !text-black !rounded-lg !shadow-lg "
                inputStyle={{ width: "100%", height: "40px" }}
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
            <CommonButton
              type="none"
              text="Create Account"
              isLoading={loading}
              loadingText="Submitting..."
              textColor="text-white"
              bgColor="OriginalRed"
              width="[300px]"
              px="px-5"
              py="py-3"
              borderRadius="rounded-xl"
              cursorStyle="cursor-pointer"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Field Component
export const InputField = ({
  label,
  placeholder,
  register,
  errors,
  name,
  type,
}) => (
  <div>
    <label className="block text-gray-700 font-semibold text-xl pb-2">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="input w-full text-black bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
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
export const GenderSelectField = ({ register, errors }) => (
  <div>
    <label className="block text-black font-semibold text-xl pb-2">
      Gender
    </label>
    <select
      className="input w-full text-black bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
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

export default SignUpDetails;
