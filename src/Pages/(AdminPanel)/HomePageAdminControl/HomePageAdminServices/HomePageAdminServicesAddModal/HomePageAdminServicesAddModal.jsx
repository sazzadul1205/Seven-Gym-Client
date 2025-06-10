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

// Environment variables for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const HomePageAdminServicesAddModal = ({ Refetch }) => {
  const axiosPublic = useAxiosPublic();
  const fileInputRef = useRef(null);

  // Local state variables
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
      setModalError("Upload failed:", error);
      return null;
    }
  };

  // Ensures the link input always starts with "/"
  const handleLinkChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("/")) value = "/" + value;
    if (value === "") value = "/";
    setValue("link", value);
  };

  // Trigger file input click on image area clicks
  const handleImageClick = () => fileInputRef.current.click();

  // Handle file selection from input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    previewImage(file);
  };

  // Handle image drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      previewImage(e.dataTransfer.files[0]);
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

  const previewImage = (file) => {
    if (!file?.type?.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!imageFile) {
      setModalError("Please upload a valid banner image.");
      return;
    }

    setLoading(true);

    // Upload image
    const uploadedImageUrl = await uploadImage(imageFile);

    if (!uploadedImageUrl) {
      setLoading(false);
      setModalError("Image upload failed. Please try again.");
      return;
    }

    // Construct payload with form data and image URL
    const payload = {
      ...data,
      icon: uploadedImageUrl,
    };

    try {
      await axiosPublic.post(`/Home_Services_Section`, payload);

      // Reset form and state
      reset();
      Refetch();
      setPreview(null);
      setLoading(false);
      setModalError("");
      setImageFile(null);

      // Close modal
      document.getElementById("Add_Service_Modal").close();

      Swal.fire({
        icon: "success",
        title: "Services Added Successfully",
        text: "Your new Services has been successfully Saved.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Submission failed:", error);
      setModalError("Something went wrong while saving the data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-3xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Add New Services</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Add_Service_Modal").close()}
        />
      </div>

      {/* Error messages */}
      {(Object.keys(errors).length > 0 || modalError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md space-y-1 text-sm m-5">
          {errors.title && <div>Title is required.</div>}
          {errors.description && <div>Description is required.</div>}
          {errors.videoUrl && <div>Video URL is required.</div>}
          {modalError && <div>{modalError}</div>}
        </div>
      )}

      {/* Modal Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
        {/* Image Upload Area */}
        <div className="flex flex-col items-center">
          <label className="block font-medium mb-1">Icon</label>
          <div
            onClick={handleImageClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`w-[120px] h-[120px] rounded-full border-2 border-dashed ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-500"
            } flex items-center justify-center group cursor-pointer relative overflow-hidden transition-all duration-200 mx-auto`}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-contain p-10"
                />
                <div className="absolute inset-0 bg-white/80 hidden group-hover:flex items-center justify-center transition-all z-10">
                  <div className="flex flex-col items-center text-center text-gray-600 z-10 pointer-events-none">
                    <div className="text-5xl transition-transform group-hover:scale-110 border-2 border-gray-700 rounded-full p-5">
                      <RiImageAddFill />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center text-gray-600 z-10 pointer-events-none">
                <div className="text-5xl transition-transform group-hover:scale-110 border-2 border-gray-700 rounded-full p-5">
                  <RiImageAddFill />
                </div>
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
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter service title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Enter service description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium mb-1">Link</label>
            <input
              type="text"
              value={watch("link")}
              onChange={handleLinkChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Target Link (e.g., /Gallery)"
            />
          </div>
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
HomePageAdminServicesAddModal.propTypes = {
  Refetch: PropTypes.func.isRequired,
};

export default HomePageAdminServicesAddModal;
