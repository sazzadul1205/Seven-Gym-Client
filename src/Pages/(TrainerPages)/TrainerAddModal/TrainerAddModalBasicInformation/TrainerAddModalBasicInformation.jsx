import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import ImageCropper from "../../../(Auth)/SignUpDetails/ImageCropper/ImageCropper";
import Swal from "sweetalert2";

import CommonButton from "../../../../Shared/Buttons/CommonButton";
import { FaArrowRight } from "react-icons/fa";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const TrainerAddModalBasicInformation = () => {
  const axiosPublic = useAxiosPublic();
  const [profileImage, setProfileImage] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageSet, setImageSet] = useState(false);

  const storedData = JSON.parse(
    localStorage.getItem("trainerBasicInfo") || "{}"
  );

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

  // Effect to load image from storage
  useEffect(() => {
    if (storedData?.imageUrl) {
      setProfileImage(storedData.imageUrl);
      setImageSet(true); // ensure it's marked set on reload
    }
  }, []);

  // If user changes the image again, reset the state
  const handleImageChange = (newImage) => {
    setProfileImage(newImage);
    setImageSet(false); // reset the state
  };

  const handleSetImage = async () => {
    // Ensure we're working with a Blob (or File) object
    if (!profileImage || !(profileImage instanceof Blob)) {
      console.error("Invalid image format"); // Log to see the type of the image
      return;
    }

    setIsImageUploading(true);
    const formData = new FormData();
    formData.append("image", profileImage, "profile-image.jpg");

    try {
      const res = await axiosPublic.post(Image_Hosting_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = res.data.data.display_url;
      setProfileImage(uploadedUrl);
      setValue("imageUrl", uploadedUrl);
      setImageSet(true);

      const existing = JSON.parse(
        localStorage.getItem("trainerBasicInfo") || "{}"
      );
      const updated = { ...existing, imageUrl: uploadedUrl };
      localStorage.setItem("trainerBasicInfo", JSON.stringify(updated));

      Swal.fire({
        icon: "success",
        title: "Image Set Successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Upload Error:", error); // Log the full error
      Swal.fire({
        icon: "error",
        title: "Failed to Upload Image",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Please try again.",
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  const onSubmit = async (data) => {
    const uploadedImageUrl =
      typeof profileImage === "string" ? profileImage : "";

    const fullTrainerData = {
      ...data,
      imageUrl: uploadedImageUrl,
    };

    localStorage.setItem("trainerBasicInfo", JSON.stringify(fullTrainerData));
  };

  const isNextDisabled =
    !isValid || typeof profileImage !== "string" || isImageUploading;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-center text-gray-800">
        Basic Information
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10 items-center px-5">
          {/* Profile Image Section */}
          <div className="flex items-center justify-center h-full w-full">
            <div>
              <h3 className="text-xl font-semibold text-center py-2">
                Trainer Profile Image
              </h3>

              <ImageCropper
                onImageCropped={handleImageChange}
                defaultImageUrl={storedData?.imageUrl}
                register={register}
                errors={errors}
              />

              {/* SET IMAGE BUTTON */}
              {profileImage && typeof profileImage !== "string" && (
                <div className="flex justify-center mt-3">
                  <CommonButton
                    text={
                      isImageUploading
                        ? "Uploading..."
                        : imageSet
                        ? "Image Set"
                        : "Set Image"
                    }
                    onClick={handleSetImage}
                    bgColor="green"
                    py="py-2"
                    px="px-6"
                    textColor="text-white"
                    borderRadius="rounded"
                    disabled={isImageUploading}
                    className="transition-all duration-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold text-xl pb-2">
                Trainer Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="input w-full text-black bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
                {...register("name", { required: "Trainer Name is required" })}
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
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
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
              <label className="block text-gray-700">Years of Experience</label>
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

        {/* NEXT BUTTON */}
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
  );
};

export default TrainerAddModalBasicInformation;
