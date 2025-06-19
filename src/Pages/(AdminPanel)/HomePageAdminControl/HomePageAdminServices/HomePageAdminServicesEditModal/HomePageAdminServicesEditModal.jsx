import { useEffect, useRef, useState } from "react";

// Import Packages
import axios from "axios";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";
import { RiImageAddFill } from "react-icons/ri";

// import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

// Image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const HomePageAdminServicesEditModal = ({
  setSelectedServices,
  selectedServices,
  Refetch,
}) => {
  const fileInputRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  // Local State Management
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Form handling using react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Upload image to hosting service
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

  // Populate form when selectedServices changes
  useEffect(() => {
    if (selectedServices) {
      setValue("title", selectedServices.title || "");
      setValue("description", selectedServices.description || "");
      setValue("link", selectedServices.link || "");
      setPreview(selectedServices.icon || null);
      setModalError("");
      setImageFile(null);
    }
  }, [selectedServices, setValue]);

  // Open file selector
  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke previous URL if exists
      if (preview) URL.revokeObjectURL(preview);
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      // Revoke previous URL if exists
      if (preview) URL.revokeObjectURL(preview);
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const watchedValues = watch();

  // Check if form or image changed compared to initial values
  const hasChanges = () => {
    if (!selectedServices) return false;

    // Check form values
    if (
      watchedValues.title !== selectedServices.title ||
      watchedValues.description !== selectedServices.description ||
      watchedValues.link !== selectedServices.link
    ) {
      return true;
    }

    // Check if image was changed
    return !!imageFile;
  };

  const onSubmit = async (data) => {
    setModalError("");
    try {
      setLoading(true);
      let imageUrl = selectedServices.icon;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) throw new Error("Image upload failed.");
      }

      const payload = {
        ...data,
        icon: imageUrl,
      };

      await axiosPublic.put(
        `/Home_Services_Section/${selectedServices._id}`,
        payload
      );

      Refetch();
      setSelectedServices(null);

      document.getElementById("Edit_Service_Modal").close();

      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        text: "Mission and Vision section updated.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error(error);
      setModalError(error.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-3xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit Service: {selectedServices?.title}
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => {
            setSelectedServices(null);
            document.getElementById("Edit_Service_Modal").close();
          }}
        />
      </div>

      {/* Show validation errors and modal errors at top */}
      {(Object.keys(errors).length > 0 || modalError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md space-y-1 text-sm m-5">
          {errors.title && <div>Title is required.</div>}
          {errors.description && <div>Description is required.</div>}
          {modalError && <div>{modalError}</div>}
        </div>
      )}

      {/* Form */}
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
          </div>

          {/* Link */}
          <div>
            <label htmlFor="link" className="font-semibold mb-1 block">
              Link (URL)
            </label>
            <input
              type="url"
              {...register("link", { required: true })}
              id="link"
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <CommonButton
              clickEvent={handleSubmit(onSubmit)}
              text="Save Changes"
              bgColor="green"
              isLoading={loading}
              loadingText="Saving..."
              disabled={!hasChanges() || loading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

// Prop Validation
HomePageAdminServicesEditModal.propTypes = {
  setSelectedServices: PropTypes.func.isRequired,
  selectedServices: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    link: PropTypes.string,
    icon: PropTypes.string,
  }),
  Refetch: PropTypes.func.isRequired,
};

export default HomePageAdminServicesEditModal;
