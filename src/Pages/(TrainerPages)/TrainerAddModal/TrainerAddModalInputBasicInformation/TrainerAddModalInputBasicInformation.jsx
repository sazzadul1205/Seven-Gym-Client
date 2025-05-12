import { useEffect, useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { FaArrowRight } from "react-icons/fa";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Component
import ImageCropper from "../../../(Auth)/SignUpDetails/ImageCropper/ImageCropper";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import useAuth from "../../../../Hooks/useAuth";

// Image hosting API key and URL from environment variables
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const TrainerAddModalInputBasicInformation = ({ onNextStep }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [imageSet, setImageSet] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Load stored trainer data from localStorage
  const storedData = JSON.parse(
    localStorage.getItem("trainerBasicInfo") || "{}"
  );

  // React Hook Form setup for form validation and handling form submission
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: storedData?.name || "",
      gender: storedData?.gender || "",
      age: storedData?.age || "",
      experience: storedData?.experience || "",
      imageUrl: storedData?.imageUrl || "",
    },
  });

  // Load stored image from localStorage and set it as the profile image if exists
  useEffect(() => {
    if (storedData?.imageUrl) {
      setProfileImage(storedData.imageUrl);

      // Mark the image as set on reload
      setImageSet(true);
    }
  }, [storedData.imageUrl]);

  // Handler for updating the profile image when a new one is cropped
  const handleImageChange = (newImage) => {
    setProfileImage(newImage);
    setSuccessMessage("");
    setImageSet(false);
  };

  // Function to upload the cropped image to the image hosting service
  const handleSetImage = async () => {
    // If IOmage is invalid
    if (!profileImage || !(profileImage instanceof Blob)) {
      console.error("Invalid image format");
      return;
    }

    // Set uploading state to true during the image upload
    setIsImageUploading(true);
    const formData = new FormData();
    formData.append("image", profileImage, `${user?.email}-profile-image.jpg`);

    try {
      // Make API request to upload image
      const res = await axiosPublic.post(Image_Hosting_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the profile image with the uploaded URL
      const uploadedUrl = res.data.data.display_url;
      setProfileImage(uploadedUrl);

      // Update form field with the image URL
      setValue("imageUrl", uploadedUrl);

      // Mark the image as set
      setImageSet(true);

      // Store the new image URL in localStorage without deleting other data
      const existing = JSON.parse(
        localStorage.getItem("trainerBasicInfo") || "{}"
      );
      const updated = { ...existing, imageUrl: uploadedUrl };
      localStorage.setItem("trainerBasicInfo", JSON.stringify(updated));

      // Display success message
      setSuccessMessage("Image Set Successfully!");
    } catch (error) {
      console.error("Upload Error:", error);

      // Show error message if upload fails
      setSuccessMessage("Failed to Upload Image. Please try again.");
    } finally {
      // Reset uploading state after request
      setIsImageUploading(false);
    }
  };

  // Function to handle form submission and store form data in localStorage
  const onSubmit = async (data) => {
    // Prepare the updated values (ensure profileImage is a string URL)
    const uploadedImageUrl =
      typeof profileImage === "string" ? profileImage : "";

    const updatedValues = {
      ...data,
      imageUrl: uploadedImageUrl,
    };

    // Get existing data from localStorage
    const existing = JSON.parse(
      localStorage.getItem("trainerBasicInfo") || "{}"
    );

    // Merge the existing data with the new basic info (overwrite only specific fields)
    const mergedData = {
      ...existing,
      ...updatedValues,
    };

    // Store merged data in localStorage
    localStorage.setItem("trainerBasicInfo", JSON.stringify(mergedData));

    onNextStep();
  };

  // Check if the "Next Step" button should be disabled (e.g., form not valid, image not set)
  const isNextDisabled =
    !isValid || typeof profileImage !== "string" || isImageUploading;

  return (
    <div>
      {/* Success Message displayed at the top */}
      {successMessage && (
        <div className="text-center text-green-500 font-semibold p-3 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Page Content */}
      <div className="py-5">
        {/* Title */}
        <h3 className="text-2xl font-semibold text-center text-gray-800">
          Basic Information
        </h3>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10 items-center px-5">
            {/* Profile Image Section */}
            <div className="items-center justify-center h-full w-full">
              {/* Trainer Image Title */}
              <h3 className="text-xl font-semibold text-center py-2">
                Trainer Profile Image
                <hr className="bg-black p-[1px] w-1/2 mx-auto" />
              </h3>

              {/* Image Cropper component to upload and crop image */}
              <ImageCropper
                onImageCropped={handleImageChange}
                defaultImageUrl={storedData?.imageUrl}
                register={register}
                errors={errors}
              />

              {/* Save Image Button */}
              <div className="flex justify-center mt-3">
                <CommonButton
                  clickEvent={handleSetImage}
                  isLoading={isImageUploading}
                  loadingText="Uploading..."
                  text={imageSet ? "Image Set" : "Set Image"}
                  bgColor="green"
                  py="py-2"
                  px="px-6"
                  textColor="text-white"
                  borderRadius="rounded"
                  disabled={isImageUploading || imageSet}
                  className={`transition-all duration-300 ${
                    imageSet ? "bg-gray-400 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Trainer Name */}
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

              {/* Gender */}
              <div>
                <label className="block text-gray-700">Gender</label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className="input w-full bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Age */}
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

              {/* Years of Experience */}
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

          {/* Next Step Button */}
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
              isLoading={false}
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

// Prop validation
TrainerAddModalInputBasicInformation.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};

export default TrainerAddModalInputBasicInformation;
