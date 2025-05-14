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

  const [imageSet, setImageSet] = useState(false);
  const [tempImageBlob, setTempImageBlob] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);

  const storedData = JSON.parse(
    localStorage.getItem("trainerBasicInfo") || "{}"
  );

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

  useEffect(() => {
    if (storedData?.imageUrl) {
      setProfileImageUrl(storedData.imageUrl);
      setImageSet(true);
    }
  }, [storedData.imageUrl]);

  const handleImageChange = (newImageBlob) => {
    setTempImageBlob(newImageBlob);
    setSuccessMessage("");
    setImageSet(false);
  };

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

  const onSubmit = async (data) => {
    let finalImageUrl = profileImageUrl;

    if (tempImageBlob) {
      const uploadedUrl = await uploadImageAndGetUrl(tempImageBlob);
      if (!uploadedUrl) return; // If upload failed, stop submission
      finalImageUrl = uploadedUrl;
      setProfileImageUrl(uploadedUrl);
    }

    const updatedValues = {
      ...data,
      imageUrl: finalImageUrl,
    };

    const existing = JSON.parse(
      localStorage.getItem("trainerBasicInfo") || "{}"
    );
    const mergedData = { ...existing, ...updatedValues };
    localStorage.setItem("trainerBasicInfo", JSON.stringify(mergedData));

    onNextStep();
  };

  const isNextDisabled = !isValid || isImageUploading;

  return (
    <div>
      {successMessage && (
        <div className="text-center text-green-500 font-semibold p-3 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="py-5">
        <h3 className="text-2xl font-semibold text-center text-gray-800">
          Basic Information
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10 items-center px-5">
            <div className="items-center justify-center h-full w-full">
              <h3 className="text-xl font-semibold text-center py-2">
                Trainer Profile Image
                <hr className="bg-black p-[1px] w-1/2 mx-auto" />
              </h3>

              <ImageCropper
                onImageCropped={handleImageChange}
                defaultImageUrl={profileImageUrl}
                register={register}
                errors={errors}
              />

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

            <div className="space-y-4">
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

TrainerAddModalInputBasicInformation.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};

export default TrainerAddModalInputBasicInformation;
