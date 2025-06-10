import { useRef, useState } from "react";

// Import Packages
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";
import { RiImageAddFill } from "react-icons/ri";

// Import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Image upload requirements
const REQUIRED_WIDTH = 1920;
const REQUIRED_HEIGHT = 500;
const TOLERANCE = 0.05;

// Environment variables for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

// Function to upload image to imgbb
const uploadImage = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(Image_Hosting_API, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res?.data?.data?.display_url || null;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};

const HomePageAdminBannerAddModal = ({ Refetch }) => {
  const axiosPublic = useAxiosPublic();
  const fileInputRef = useRef(null);

  // Local state variables
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form handling using react-hook-form
  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      link: "/",
    },
  });

  // Ensures the link input always starts with "/"
  const handleLinkChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("/")) value = "/" + value;
    if (value === "") value = "/";
    setValue("link", value);
  };

  // Trigger file input click on image area click
  const handleImageClick = () => fileInputRef.current.click();

  // Handle file selection from input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    validateAndPreviewImage(file);
  };

  // Handle image drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      validateAndPreviewImage(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  // Show drag effect
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Remove drag effect
  const handleDragLeave = () => setIsDragging(false);

  // Validate image dimensions and preview
  const validateAndPreviewImage = (file) => {
    if (!file?.type?.startsWith("image/")) return;

    const reader = new FileReader();
    const img = new Image();

    reader.onloadend = () => {
      img.onload = () => {
        const { width, height } = img;
        const widthValid =
          Math.abs(width - REQUIRED_WIDTH) <= REQUIRED_WIDTH * TOLERANCE;
        const heightValid =
          Math.abs(height - REQUIRED_HEIGHT) <= REQUIRED_HEIGHT * TOLERANCE;

        if (widthValid && heightValid) {
          setPreview(reader.result);
          setImageFile(file);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Invalid Banner Dimensions",
            html: `
              <div style="text-align:left;">
                <p><strong>Required:</strong> 1920x500 px</p>
                <p><strong>Your Image:</strong> ${width}x${height} px</p>
              </div>`,
            confirmButtonColor: "#F72C5B",
          });
        }
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!imageFile) {
      Swal.fire({
        icon: "error",
        title: "Image Required",
        text: "Please upload a valid banner image.",
        confirmButtonColor: "#F72C5B",
      });
      return;
    }

    setLoading(true);

    // Upload image
    const uploadedImageUrl = await uploadImage(imageFile);

    if (!uploadedImageUrl) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload the image. Try again.",
        confirmButtonColor: "#F72C5B",
      });
      return;
    }

    // Construct payload with form data and image URL
    const payload = {
      ...data,
      image: uploadedImageUrl,
    };

    try {
      await axiosPublic.post(`/Home_Banner_Section`, payload);

      // Reset form and state
      reset();
      Refetch();
      setPreview(null);
      setImageFile(null);
      setLoading(false);

      // Close modal
      document.getElementById("Add_Banner_Modal").close();

      Swal.fire({
        icon: "success",
        title: "Banner Added",
        text: "Your new banner has been successfully saved.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong while saving the banner.",
        confirmButtonColor: "#F72C5B",
      });
    }
  };

  return (
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Add New Banner</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Add_Banner_Modal").close()}
        />
      </div>

      {/* Modal Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
        {/* Image Upload Area */}
        <div
          onClick={handleImageClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full h-[300px] border-2 border-dashed ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-500"
          } flex items-center justify-center group cursor-pointer relative overflow-hidden transition-all duration-200`}
        >
          {/* Preview or Upload Icon */}
          {preview ? (
            <>
              <img
                src={preview}
                alt="Banner Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-white/80 hidden group-hover:flex items-center justify-center transition-all z-10">
                <div className="flex flex-col items-center text-center text-gray-600 z-10 pointer-events-none">
                  <div className="text-5xl transition-transform group-hover:scale-110 border-2 border-gray-700 rounded-full p-5 mb-2">
                    <RiImageAddFill />
                  </div>
                  <p className="text-sm font-semibold">
                    Recommended: 1920x500 px
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center text-gray-600 z-10 pointer-events-none">
              <div className="text-5xl transition-transform group-hover:scale-110 border-2 border-gray-700 rounded-full p-5 mb-2">
                <RiImageAddFill />
              </div>
              <p className="text-sm font-semibold">Recommended: 1920x500 px</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Banner Title"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">Title is required.</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Banner Description"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              Description is required.
            </p>
          )}
        </div>

        {/* Button Name Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Button Name</label>
          <input
            type="text"
            {...register("buttonName", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Button Text (e.g., View Gallery)"
          />
          {errors.buttonName && (
            <p className="text-red-500 text-xs mt-1">
              Button name is required.
            </p>
          )}
        </div>

        {/* Link Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Button Link</label>
          <input
            type="text"
            value={watch("link")}
            onChange={handleLinkChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Target Link (e.g., /Gallery)"
          />
          {errors.link && (
            <p className="text-red-500 text-xs mt-1">Link is required.</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <CommonButton
            clickEvent={handleSubmit(onSubmit)}
            text="Save Changes"
            bgColor="green"
            isLoading={loading}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};

// Prop Validation
HomePageAdminBannerAddModal.propTypes = {
  Refetch: PropTypes.func.isRequired,
};

export default HomePageAdminBannerAddModal;
