import { useForm } from "react-hook-form";
import LoginBack from "../../../assets/LoginBack.jpeg";
import { useContext, useState } from "react";
import ImageCropper from "./ImageCropper/ImageCropper";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FitnessGoalsSelector from "./FitnessGoalsSelector/FitnessGoalsSelector";
import { AuthContext } from "../../../Providers/AuthProviders";

const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const SUDetails = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  console.log(user.email);
  

  const [selectedGoals, setSelectedGoals] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let uploadedImageUrl = null;

      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage); // Append the Blob directly

        console.log("Uploading image...");
        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedImageUrl = res.data.data.display_url;
        console.log("Image uploaded successfully:", uploadedImageUrl);
      } else {
        console.warn("No profile image selected.");
      }

      const formDataWithImage = {
        email: user.email,
        ...data,
        profileImage: uploadedImageUrl,
      };

      console.log("Form data:", formDataWithImage);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Failed to upload the image. Please try again.");
    }
  };

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
              className="w-1/3 bg-[#F72C5B] hover:bg-[#f72c5bbd] text-white py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#f72c5bbd]"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SUDetails;
