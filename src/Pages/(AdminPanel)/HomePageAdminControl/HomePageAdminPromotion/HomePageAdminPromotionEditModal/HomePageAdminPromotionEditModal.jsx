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

// Image upload requirements
const REQUIRED_WIDTH = 500;
const REQUIRED_HEIGHT = 300;
const TOLERANCE = 0.05;

// Environment variables for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const HomePageAdminPromotionEditModal = ({
  setSelectedPromo,
  selectedPromo,
  Refetch,
}) => {
  const fileInputRef = useRef();
  const axiosPublic = useAxiosPublic();

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

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
      console.log(error);
      setModalError("Image upload failed.");
      return null;
    }
  };

  // Populate form when selectedPromo changes
  useEffect(() => {
    if (selectedPromo) {
      const values = {
        title: selectedPromo.title || "",
        description: selectedPromo.description || "",
        link: selectedPromo.link || "",
        image: selectedPromo.image || "",
        promoDuration: selectedPromo.promoDuration || "",
        offerDetails: selectedPromo.offerDetails || "",
        discountPercentage: selectedPromo.discountPercentage || "",
        promoCode: selectedPromo.promoCode || "",
      };

      setValue("title", values.title);
      setValue("description", values.description);
      setValue("link", values.link);
      setValue("promoDuration", values.promoDuration);
      setValue("offerDetails", values.offerDetails);
      setValue("discountPercentage", values.discountPercentage);
      setValue("promoCode", values.promoCode);

      setModalError("");
      setImageFile(null);
      setPreview(values.image);
      setInitialValues(values);
    }
  }, [selectedPromo, setValue]);

  // Open file selector
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Validate image dimensions and preview
  const validateAndPreviewImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file?.type?.startsWith("image/")) {
        reject(new Error("File is not an image."));
        return;
      }

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
            resolve(reader.result);
          } else {
            reject(
              new Error(
                `Invalid banner dimensions: ${width}x${height}. Required approx ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}`
              )
            );
          }
        };
        img.onerror = () =>
          reject(new Error("Failed to load image for validation."));
        img.src = reader.result;
      };

      reader.onerror = () =>
        reject(new Error("Failed to read the image file."));
      reader.readAsDataURL(file);
    });
  };

  // Handle selected or dropped image file
  const handleImageFile = async (file) => {
    if (!file) return;

    setModalError("");
    try {
      const previewDataUrl = await validateAndPreviewImage(file);
      setPreview(previewDataUrl);
      setImageFile(file);
    } catch (err) {
      setModalError(err.message);
      setImageFile(null);
      setPreview(selectedPromo?.image || "");
    }
  };

  // Handle file input change
  const handleImageChange = (e) => {
    handleImageFile(e.target.files[0]);
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // Watch form fields to detect changes
  const watchedValues = watch([
    "title",
    "description",
    "link",
    "promoDuration",
    "offerDetails",
    "discountPercentage",
    "promoCode",
  ]);

  // Check if form or image changed compared to initial values
  const hasChanges = () => {
    if (!selectedPromo) return false;

    if (
      watchedValues[0] !== initialValues.title ||
      watchedValues[1] !== initialValues.description ||
      watchedValues[2] !== initialValues.link ||
      watchedValues[3] !== initialValues.promoDuration ||
      watchedValues[4] !== initialValues.offerDetails ||
      watchedValues[5] !== initialValues.discountPercentage ||
      watchedValues[6] !== initialValues.promoCode
    )
      return true;

    if (imageFile) return true;

    if (preview !== initialValues.image) return true;

    return false;
  };

  // Submit handler
  const onSubmit = async (data) => {
    setModalError("");
    try {
      setLoading(true);

      let imageUrl = selectedPromo.image;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) throw new Error("Image upload failed");
        imageUrl = uploadedUrl;
      }

      const payload = {
        ...data,
        image: imageUrl,
      };

      await axiosPublic.put(`/Promotions/${selectedPromo._id}`, payload);

      setSelectedPromo("");
      Refetch("");
      document.getElementById("Edit_Promotion_Modal")?.close();
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
          Edit Promotion: {selectedPromo?.title}
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => {
            setSelectedPromo("");
            document.getElementById("Edit_Promotion_Modal").close();
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
                    Recommended: 500x300 px
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center text-gray-600 z-10 pointer-events-none">
              <div className="text-5xl transition-transform group-hover:scale-110 border-2 border-gray-700 rounded-full p-5 mb-2">
                <RiImageAddFill />
              </div>
              <p className="text-sm font-semibold">Recommended: 500x300 px</p>
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
          <label className="font-semibold mb-1 block" htmlFor="title">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter promotion title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold mb-1 block" htmlFor="description">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            {...register("description", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter detailed description"
            rows={4}
          />
        </div>

        {/* Link */}
        <div>
          <label className="font-semibold mb-1 block" htmlFor="link">
            Link (URL)
          </label>
          <input
            id="link"
            type="text"
            {...register("link")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="/Promotion/Membership-Discount"
          />
        </div>

        {/* Promo Duration */}
        <div>
          <label className="font-semibold mb-1 block" htmlFor="promoDuration">
            Promotion Duration
          </label>
          <input
            id="promoDuration"
            type="date"
            {...register("promoDuration")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Offer valid till December 31st, 2024"
          />
        </div>

        {/* Offer Details */}
        <div>
          <label className="font-semibold mb-1 block" htmlFor="offerDetails">
            Offer Details
          </label>
          <textarea
            id="offerDetails"
            {...register("offerDetails")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Details about the offer"
            rows={3}
          />
        </div>

        {/* Discount Percentage */}
        <div>
          <label
            className="font-semibold mb-1 block"
            htmlFor="discountPercentage"
          >
            Discount Percentage (%)
          </label>
          <input
            id="discountPercentage"
            type="number"
            {...register("discountPercentage", { min: 0, max: 100 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="25"
          />
        </div>

        {/* Promo Code */}
        <div>
          <label className="font-semibold mb-1 block" htmlFor="promoCode">
            Promo Code
          </label>
          <input
            id="promoCode"
            type="text"
            {...register("promoCode")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="PROMO-6759D6EB"
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
            disabled={!hasChanges() || loading}
          />
        </div>
      </form>
    </div>
  );
};

export default HomePageAdminPromotionEditModal;
