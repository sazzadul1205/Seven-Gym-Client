import { useState, useCallback, useRef } from "react";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import Cropper from "react-easy-crop";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Buttons
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Hooks
import axios from "axios";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Define your image hosting API endpoint
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

// Helper function to create a cropped image
const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = "cropped.jpeg";
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, "image/jpeg");
    };
    image.onerror = () => {
      reject(new Error("Image load error"));
    };
  });
};

// Function to upload image to imgBB
const uploadImage = async (file) => {
  if (!file) {
    console.error("No file provided for upload.");
    return null;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(Image_Hosting_API, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const imageUrl = res?.data?.data?.display_url;
    if (!imageUrl) {
      throw new Error("Image hosting failed. No URL returned.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

const TrainerProfileHeaderUpdateModal = ({ TrainerDetails, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State for image handling
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    TrainerDetails?.imageUrl || "https://via.placeholder.com/300"
  );

  // Cropping states
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [showCropModal, setShowCropModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      specialization: TrainerDetails?.specialization || "",
    },
  });

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // Helper to reset the modal state
  const resetModalState = () => {
    setSelectedFile(null);
    setPreviewImage(
      TrainerDetails?.imageUrl || "https://via.placeholder.com/300"
    );
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setShowCropModal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Close modal handler
  const handleClose = () => {
    resetModalState();
    document.getElementById("Trainer_Profile_Header_Update_Modal")?.close();
  };

  // Handle Drag-and-Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  // Handle Image Selection
  const handleImageSelect = (file) => {
    if (file) {
      // Reset file input value to allow re-selection of the same file later
      if (fileInputRef.current) fileInputRef.current.value = "";
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewImage(imageUrl);
      setShowCropModal(true);
    }
  };

  // Cropping Handler
  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const saveCroppedImage = async () => {
    try {
      const croppedBlobUrl = await getCroppedImg(
        previewImage,
        croppedAreaPixels
      );

      // Convert blob URL to a file object
      const response = await fetch(croppedBlobUrl);
      const blob = await response.blob();
      const croppedFile = new File([blob], "cropped-image.jpg", {
        type: "image/jpeg",
      });

      // Update state with the new cropped file
      setSelectedFile(croppedFile);
      setPreviewImage(croppedBlobUrl);
      setShowCropModal(false);
    } catch (error) {
      console.error("Crop failed:", error);
    }
  };

  // Save form submission and submit data to the API endpoint
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let finalImageUrl = previewImage;
      // If a new file is selected, upload it
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      // Prepare the payload
      const payload = {
        specialization: data.specialization,
        imageUrl: finalImageUrl,
      };

      // Submit the data to /Trainers/UpdateTrainerHeaderInfo/:id
      await axiosPublic.put(
        `/Trainers/UpdateTrainerHeaderInfo/${TrainerDetails._id}`,
        payload
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Trainer profile updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      resetModalState();
      refetch();
      setIsSubmitting(false);
      document.getElementById("Trainer_Profile_Header_Update_Modal")?.close();
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while updating the profile.",
      });
    }
  };

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Update Trainer Profile Header</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={handleClose}
        />
      </div>

      {/* Content Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        {/* Drag-and-Drop Image Area */}
        <div
          className={`mx-auto border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 rounded-full h-[300px] w-[300px] ${
            isDragging
              ? "border-blue-500 bg-blue-100"
              : "border-gray-500 hover:border-gray-800"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            // Clicking the preview image triggers re-selection of a new image
            <img
              src={previewImage}
              alt="Preview"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-[300px] mx-auto rounded-full object-cover cursor-pointer"
            />
          ) : (
            <>
              <p className="text-gray-500 text-center py-2">
                Drag and drop an image here or click below to select one.
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="fileInput"
                ref={fileInputRef}
                onChange={(e) => handleImageSelect(e.target.files[0])}
              />

              {/* Select images */}
              <CommonButton
                clickEvent={() => fileInputRef.current?.click()}
                text="Select Image"
                bgColor="blue"
                type="button"
              />
            </>
          )}
        </div>

        {/* Specialization Input */}
        <div className="mb-4">
          <label htmlFor="specialization" className="block font-bold ml-1 mb-2">
            Specialization
          </label>
          <input
            id="specialization"
            type="text"
            placeholder="Enter your specialization"
            className="input input-bordered w-full rounded-lg bg-white border-gray-600"
            {...register("specialization", {
              required: "Specialization is required",
            })}
          />
          {errors.specialization && (
            <p className="text-red-500 text-sm">
              {errors.specialization.message}
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <CommonButton
            clickEvent={handleSubmit(onSubmit)}
            text="Save Changes"
            bgColor="green"
            isLoading={isSubmitting}
            loadingText="Saving..."
          />
        </div>
      </form>

      {/* Cropper Modal */}
      {showCropModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-5 rounded-lg shadow-lg relative w-[90%] max-w-[500px]">
            {/* Title */}
            <h3 className="font-bold text-lg mb-4">Crop Your Image</h3>

            {/* Cropper Part */}
            <div className="relative w-full h-[300px]">
              <Cropper
                image={previewImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              {/* Cancel Button */}
              <CommonButton
                clickEvent={resetModalState}
                text="Cancel"
                bgColor="red"
                type="button"
              />

              {/* Save Crop Button */}
              <CommonButton
                clickEvent={saveCroppedImage}
                text="Save Crop"
                bgColor="green"
                type="button"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Prop Validation
TrainerProfileHeaderUpdateModal.propTypes = {
  TrainerDetails: PropTypes.shape({
    _id: PropTypes.string,
    imageUrl: PropTypes.string,
    specialization: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default TrainerProfileHeaderUpdateModal;
