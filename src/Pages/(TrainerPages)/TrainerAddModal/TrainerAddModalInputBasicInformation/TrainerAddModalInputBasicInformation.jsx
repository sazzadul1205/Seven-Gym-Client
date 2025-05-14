import { useEffect, useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { FaArrowRight } from "react-icons/fa";

// Import Custom Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";

// Import Components
import ImageCropper from "../../../(Auth)/SignUpDetails/ImageCropper/ImageCropper";
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Image hosting service configuration (imgbb)
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

// Main Component
const TrainerAddModalInputBasicInformation = ({ onNextStep }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Indicates if image was successfully uploaded/set
  const [imageSet, setImageSet] = useState(false);

  // Cropped image blob for upload
  const [tempImageBlob, setTempImageBlob] = useState(null);

  // Uploaded image URL
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // Message shown after upload success/failure
  const [successMessage, setSuccessMessage] = useState("");

  // Indicates image is uploading
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Load existing data from localStorage (used for prefill)
  const storedData = JSON.parse(
    localStorage.getItem("trainerBasicInfo") || "{}"
  );

  // React Hook Form setup with default values
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: storedData?.name || "",
      gender: storedData?.gender || "",
      age: storedData?.age || "",
      experience: storedData?.experience || "",
    },
  });

  // Prefill profile image if previously set
  useEffect(() => {
    if (storedData?.imageUrl) {
      setProfileImageUrl(storedData.imageUrl);
      setImageSet(true);
    }
  }, [storedData.imageUrl]);

  // Handler for cropped image blob
  const handleImageChange = (newImageBlob) => {
    setTempImageBlob(newImageBlob);
    setSuccessMessage("");
    setImageSet(false);
  };

  // Upload image to hosting service and return image URL
  const uploadImageAndGetUrl = async (imageBlob) => {
    if (!imageBlob || !(imageBlob instanceof Blob)) {
      console.error("Invalid image format");
      return null;
    }

    setIsImageUploading(true);
    const formData = new FormData();
    formData.append("image", imageBlob, `${user?.email}-profile-image.jpg`);

    try {
      const res = await axiosPublic.post(Image_Hosting_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = res.data.data.display_url;
      setSuccessMessage("Image Set Successfully!");
      setImageSet(true);
      return uploadedUrl;
    } catch (error) {
      console.error("Upload Error:", error);
      setSuccessMessage("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsImageUploading(false);
    }
  };

  // Final form submit handler
  const onSubmit = async (data) => {
    let finalImageUrl = profileImageUrl;

    // Upload image if cropped but not yet uploaded
    if (tempImageBlob) {
      const uploadedUrl = await uploadImageAndGetUrl(tempImageBlob);
      if (!uploadedUrl) return;
      finalImageUrl = uploadedUrl;
      setProfileImageUrl(uploadedUrl);
    }

    // Merge new form values with existing localStorage data
    const updatedValues = {
      ...data,
      imageUrl: finalImageUrl,
    };

    const existing = JSON.parse(
      localStorage.getItem("trainerBasicInfo") || "{}"
    );
    const mergedData = { ...existing, ...updatedValues };

    // Save updated data to localStorage
    localStorage.setItem("trainerBasicInfo", JSON.stringify(mergedData));

    // Proceed to next step
    onNextStep();
  };

  // Disable next button if form is invalid or image is uploading
  const isNextDisabled = !isValid || isImageUploading;

  return (
    <div>
      {/* Success message after image upload */}
      {successMessage && (
        <div className="text-center text-green-500 font-semibold p-3 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Main Form */}
      <div className="py-5">
        {/* Main Title */}
        <h3 className="text-2xl font-semibold text-center text-gray-800">
          Basic Information
        </h3>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10 items-center px-5">
            {/* Profile Image Crop & Upload */}
            <div className="items-center justify-center h-full w-full">
              {/* Title */}
              <h3 className="text-xl font-semibold text-center py-2">
                Trainer Profile Image
                <hr className="bg-black p-[1px] w-1/2 mx-auto" />
              </h3>

              {/* Cropping Component */}
              <ImageCropper
                onImageCropped={handleImageChange}
                defaultImageUrl={profileImageUrl}
                register={register}
                errors={errors}
              />

              {/* Upload Button Status */}
              <div className="flex justify-center mt-3">
                <CommonButton
                  clickEvent={() => {}}
                  isLoading={false}
                  loadingText="Uploading..."
                  text={imageSet ? "Image Set" : "Image Ready"}
                  bgColor={imageSet ? "gray" : "yellow"}
                  py="py-2"
                  px="px-6"
                  textColor="text-white"
                  borderRadius="rounded"
                  disabled
                  className="cursor-default"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 font-semibold text-xl pb-2">
                  Trainer Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="input w-full text-black bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
                  {...register("name", {
                    required: "Trainer Name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Gender Field */}
              <div>
                <label className="block text-gray-700">Gender</label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className="input w-full bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Age Field */}
              <div>
                <label className="block text-gray-700">Age</label>
                <input
                  type="number"
                  placeholder="Enter age"
                  {...register("age", { required: "Age is required", min: 18 })}
                  className="input w-full bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age.message}</p>
                )}
              </div>

              {/* Experience Field */}
              <div>
                <label className="block text-gray-700">
                  Years of Experience
                </label>
                <select
                  {...register("experience", {
                    required: "Experience is required",
                  })}
                  className="input w-full bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
                >
                  <option value="">Select Experience</option>
                  {[...Array(30).keys()].map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1} {index + 1 === 1 ? "Year" : "Years"}
                    </option>
                  ))}
                </select>
                {errors.experience && (
                  <p className="text-red-500 text-sm">
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center w-full">
            <CommonButton
              type="submit"
              text="Next Step"
              icon={<FaArrowRight />}
              iconSize="text-lg"
              bgColor="blue"
              px="px-10"
              py="py-3"
              borderRadius="rounded-lg"
              width="auto"
              isLoading={isImageUploading}
              disabled={isNextDisabled}
              textColor="text-white"
              className={`hover:transform hover:translate-x-2 transition-transform duration-300 ${
                isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              iconPosition="after"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

// Type checking for props
TrainerAddModalInputBasicInformation.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};

export default TrainerAddModalInputBasicInformation;
