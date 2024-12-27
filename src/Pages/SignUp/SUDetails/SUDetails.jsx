import { useForm } from "react-hook-form";
import LoginBack from "../../../assets/LoginBack.jpeg";
import { useContext, useState } from "react";
import ImageCropper from "./ImageCropper/ImageCropper";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FitnessGoalsSelector from "./FitnessGoalsSelector/FitnessGoalsSelector";
import { AuthContext } from "../../../Providers/AuthProviders";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";

const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const SUDetails = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for the button

  // Fetching data for Users
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true); // Set loading to true when submission starts

    let uploadedImageUrl = null;

    if (profileImage) {
      const formData = new FormData();
      formData.append("image", profileImage);

      try {
        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedImageUrl = res.data.data.display_url;
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
    } else {
      console.warn("No profile image selected.");
    }

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
    };

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
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
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
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <div className="text-center text-2xl font-bold text-red-500 mb-6">
          You already have an account.
        </div>
        <div className="text-center mb-6">
          <p className="text-lg text-gray-700">
            To modify your information, go to your profile update page.
          </p>
        </div>
        <button
          onClick={() => navigate("/profileupdate")} // Redirect to profile update page
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
        <div className="pb-5">
          <h4 className="text-3xl font-bold text-center text-[#F72C5B]">
            Data Form
          </h4>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-10 pb-10">
            {/* Left Side Data */}
            <div className="w-1/2 space-y-4">
              {/* Image Cropper Section */}
              <div>
                <label className="block text-gray-700 font-semibold text-xl pb-2">
                  Profile Image
                </label>
                <ImageCropper onImageCropped={setProfileImage} />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-semibold text-xl pb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Side Data */}
            <div className="w-1/2 space-y-4">
              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-semibold text-xl pb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+8801234567890"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F72C5B]"
                  {...register("phone", {
                    required: "Phone number is required",
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
                  {...register("dob", {
                    required: "Date of birth is required",
                  })}
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dob.message}
                  </p>
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

              {/* Fitness Goals */}
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
              className={`w-1/3 bg-[#F72C5B] hover:bg-[#f72c5bbd] text-white py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#f72c5bbd] ${
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

export default SUDetails;
