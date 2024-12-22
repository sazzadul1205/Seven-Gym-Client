import { useForm } from "react-hook-form";
import LoginBack from "../../../assets/LoginBack.jpeg";
import { useState } from "react";
import ImageCropper from "./ImageCropper/ImageCropper";

const SUDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [profileImage, setProfileImage] = useState(null);

  const onSubmit = (data) => {
    console.log({ ...data, profileImage });
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
      <div
        className="w-full max-w-lg shadow-md rounded-tl-[50px] rounded-br-[50px] p-10"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="pb-5">
          <h4 className="text-3xl font-bold text-center text-[#F72C5B]">
            Sign Up Form
          </h4>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
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
        </form>
      </div>
    </div>
  );
};

export default SUDetails;
