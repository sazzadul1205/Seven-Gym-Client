import { useEffect, useRef, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import { ImCross } from "react-icons/im";
import { RiImageAddFill } from "react-icons/ri";

import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Image requirements
const REQUIRED_WIDTH = 1920;
const REQUIRED_HEIGHT = 500;
const TOLERANCE = 0.05;

// Image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

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
    console.error("Upload failed:", error);
    return null;
  }
};

const HomePageAdminBannerEditModal = ({
  setSelectedBanner,
  selectedBanner,
  Refetch,
}) => {
  const fileInputRef = useRef();
  const axiosPublic = useAxiosPublic();

  // Local state variables
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  // Form handling using react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Populate form when selectedBanner changes
  useEffect(() => {
    if (selectedBanner) {
      const values = {
        title: selectedBanner.title || "",
        description: selectedBanner.description || "",
        buttonName: selectedBanner.buttonName || "",
        link: selectedBanner.link || "",
        image: selectedBanner.image || "",
      };
      setValue("link", values.link);
      setValue("title", values.title);
      setValue("description", values.description);
      setValue("buttonName", values.buttonName);

      setModalError("");
      setImageFile(null);
      setPreview(values.image);
      setInitialValues(values);
    }
  }, [selectedBanner, setValue]);

  // Validate image size
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const validWidth =
          Math.abs(img.width - REQUIRED_WIDTH) <= REQUIRED_WIDTH * TOLERANCE;
        const validHeight =
          Math.abs(img.height - REQUIRED_HEIGHT) <= REQUIRED_HEIGHT * TOLERANCE;
        validWidth && validHeight
          ? resolve(true)
          : reject(
              new Error(
                `Image must be approx ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px.`
              )
            );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  // Open file selector
  const handleImageClick = () => fileInputRef.current?.click();

  // Handle selected or dropped image file
  const handleImageFile = async (file) => {
    if (!file) return;
    setModalError(""); // Clear previous error
    try {
      await validateImageDimensions(file);
      setImageFile(file);

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } catch (err) {
      setModalError(err.message);
      setImageFile(null);
      setPreview(selectedBanner?.image || "");
    }
  };

  // Handle file input change
  const handleImageChange = (e) => handleImageFile(e.target.files[0]);

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  // Show drag effect
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Remove drag effect
  const handleDragLeave = () => setIsDragging(false);

  const watchedValues = watch(["title", "description", "buttonName", "link"]);

  // Check if form or image changed compared to initial values
  const hasChanges = () => {
    if (!selectedBanner) return false;

    if (
      watchedValues[0] !== initialValues.title ||
      watchedValues[1] !== initialValues.description ||
      watchedValues[2] !== initialValues.buttonName ||
      watchedValues[3] !== initialValues.link
    )
      return true;

    // If a new image file is selected, it's a change
    if (imageFile) return true;

    // If preview differs from initial image url, consider changed
    if (preview !== initialValues.image) return true;

    return false;
  };

  // Submit handler
  const onSubmit = async (data) => {
    setModalError(""); // Reset error
    try {
      setLoading(true);

      let imageUrl = selectedBanner.image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const payload = {
        ...data,
        image: imageUrl,
      };

      await axiosPublic.put(
        `/Home_Banner_Section/${selectedBanner._id}`,
        payload
      );

      setSelectedBanner("");
      Refetch("");
      document.getElementById("Edit_Banner_Modal").close();

      // Optionally add a success notification here if needed
    } catch (error) {
      console.error(error);
      setModalError(error.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit Banner: {selectedBanner?.title}
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => {
            setSelectedBanner("");
            document.getElementById("Edit_Banner_Modal").close();
          }}
        />
      </div>

      {/* Show validation errors and modal errors at top */}
      {(Object.keys(errors).length > 0 || modalError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md space-y-1 text-sm m-5">
          {errors.title && <div>Title is required.</div>}
          {errors.description && <div>Description is required.</div>}
          {errors.buttonName && <div>Button name is required.</div>}
          {errors.link && <div>Link is required.</div>}
          {modalError && <div>{modalError}</div>}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
        {/* Image upload area */}
        <div
          onClick={handleImageClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full h-[300px] border-2 border-dashed ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-500"
          } flex items-center justify-center group cursor-pointer relative overflow-hidden transition-all duration-200`}
        >
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

        {/* Title */}
        <div>
          <label htmlFor="title" className="font-semibold mb-1 block">
            Title
          </label>
          <input
            type="text"
            {...register("title", { required: true })}
            id="title"
            placeholder="Banner title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="font-semibold mb-1 block">
            Description
          </label>
          <textarea
            {...register("description", { required: true })}
            id="description"
            placeholder="Banner description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        {/* Button Name */}
        <div>
          <label htmlFor="buttonName" className="font-semibold mb-1 block">
            Button Name
          </label>
          <input
            type="text"
            {...register("buttonName", { required: true })}
            id="buttonName"
            placeholder="Text on the button"
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
        <div className="flex justify-end mt-3">
          <CommonButton
            clickEvent={handleSubmit(onSubmit)}
            text="Save Changes"
            bgColor="green"
            isLoading={loading}
            loadingText="Saving..."
            disabled={!hasChanges()}
          />
        </div>
      </form>
    </div>
  );
};

HomePageAdminBannerEditModal.propTypes = {
  setSelectedBanner: PropTypes.func.isRequired,
  Refetch: PropTypes.func.isRequired,
  selectedBanner: PropTypes.object,
};

export default HomePageAdminBannerEditModal;
