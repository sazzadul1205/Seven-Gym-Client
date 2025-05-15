import { useEffect, useState } from "react";

// Import necessary packages
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import icons
import { FaArrowRight } from "react-icons/fa";

// Import custom hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";

// Import components
import ImageCropper from "../../../(Auth)/SignUpDetails/ImageCropper/ImageCropper";
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Set up image hosting key and API endpoint
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

// Main component
const TrainerAddModalInputBasicInformation = ({ onNextStep }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Whether image was uploaded/set
  const [imageSet, setImageSet] = useState(false);

  // Temporary cropped image blob
  const [tempImageBlob, setTempImageBlob] = useState(null);

  // Final uploaded image URL
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // Message after upload attempt
  const [successMessage, setSuccessMessage] = useState("");

  // Image upload loader flag
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Load any stored trainer basic info from localStorage
  const storedData = JSON.parse(
    localStorage.getItem("trainerBasicInfo") || "{}"
  );

  // Set up react-hook-form with default values from localStorage
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

  // On mount, set existing profile image if previously uploaded
  useEffect(() => {
    if (storedData?.imageUrl) {
      setProfileImageUrl(storedData.imageUrl);
      setImageSet(true);
    }
  }, [storedData.imageUrl]);

  // Handle cropped image blob change
  const handleImageChange = (newImageBlob) => {
    setTempImageBlob(newImageBlob);
    setSuccessMessage("");
    setImageSet(false);
  };

  // Function to upload a cropped image blob to imgbb and get back the image URL
  const uploadImageAndGetUrl = async (imageBlob) => {
    // Validate input: check if imageBlob exists and is a valid Blob instance
    if (!imageBlob || !(imageBlob instanceof Blob)) {
      // Log error for debugging
      console.error("Invalid image format");

      // Stop execution and return null
      return null;
    }

    // Trigger loading state (e.g., disable buttons/spinner)
    setIsImageUploading(true);

    // Prepare FormData object for the POST request
    const formData = new FormData();

    // Append image with a filename
    formData.append("image", imageBlob, `${user?.email}-profile-image.jpg`);

    try {
      // Send POST request to image hosting API (imgbb in this case)
      const res = await axiosPublic.post(Image_Hosting_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Extract uploaded image URL from response
      const uploadedUrl = res.data.data.display_url;

      // Notify user upload succeeded and update state
      setSuccessMessage("Image Set Successfully!");

      // Flag indicating image is successfully uploaded
      setImageSet(true);

      // Return the image URL
      return uploadedUrl;
    } catch (error) {
      // Log error details and show failure message to user
      console.error("Upload Error:", error);

      setSuccessMessage("Failed to upload image. Please try again.");

      // Return null indicating failure
      return null;
    } finally {
      // End loading state, regardless of success/failure
      setIsImageUploading(false);
    }
  };

  // Handle form submission logic
  const onSubmit = async (data) => {
    // Start with existing image URL (if already uploaded)
    let finalImageUrl = profileImageUrl;

    // If there's a cropped image blob that hasn't been uploaded yet
    if (tempImageBlob) {
      // Upload it
      const uploadedUrl = await uploadImageAndGetUrl(tempImageBlob);

      // Stop if upload failed
      if (!uploadedUrl) return;

      // Use new uploaded URL
      finalImageUrl = uploadedUrl;

      // Update image URL in state
      setProfileImageUrl(uploadedUrl);
    }

    // Combine form data with the final image URL
    const updatedValues = {
      ...data,
      imageUrl: finalImageUrl,
    };

    // Retrieve any existing trainer data from localStorage
    const existing = JSON.parse(
      localStorage.getItem("trainerBasicInfo") || "{}"
    );

    // Merge new form values into existing data
    const mergedData = { ...existing, ...updatedValues };

    // Save the updated trainer info back to localStorage
    localStorage.setItem("trainerBasicInfo", JSON.stringify(mergedData));

    // Proceed to the next step in the form/modal flow
    onNextStep();
  };

  // Disable submit if form is invalid or image is uploading
  const isNextDisabled = !isValid || isImageUploading;

  return (
    <div>
      {/* Show success message after image upload */}
      {successMessage && (
        <div className="text-center text-green-500 font-semibold p-3 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Form section */}
      <div>
        {/* Form Title */}
        <h3 className="text-2xl font-semibold text-center text-gray-800 bg-white py-2 border border-b-black">
          Basic Information
        </h3>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-2" >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10 items-start">
            {/* Image Cropper & Upload Area */}
            <div className="w-full">
              <h3 className="text-xl font-semibold text-center py-2">
                Trainer Profile Image
                <hr className="bg-black p-[1px] w-1/2 mx-auto" />
              </h3>

              {/* Cropper component */}
              <ImageCropper
                onImageCropped={handleImageChange}
                defaultImageUrl={profileImageUrl}
                register={register}
                errors={errors}
              />

              {/* Button showing upload status */}
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

            {/* Input Fields Section */}
            <div className="space-y-4">
              {/* Name Input */}
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

              {/* Gender Input */}
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

              {/* Age Input */}
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

              {/* Experience Input */}
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

          {/* Submit/Next Step Button */}
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

// Define expected prop types
TrainerAddModalInputBasicInformation.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};

export default TrainerAddModalInputBasicInformation;
