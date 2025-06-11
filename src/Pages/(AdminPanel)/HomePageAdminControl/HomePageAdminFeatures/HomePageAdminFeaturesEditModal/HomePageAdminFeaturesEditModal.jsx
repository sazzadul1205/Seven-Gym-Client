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

// Image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const HomePageAdminFeaturesEditModal = ({
  setSelectedFeatures,
  selectedFeatures,
  Refetch,
}) => {
  const fileInputRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (selectedFeatures) {
      setValue("title", selectedFeatures.title || "");
      setValue("description", selectedFeatures.description || "");
      setPreview(selectedFeatures.icon || null);
      setModalError("");
      setImageFile(null);
    }
  }, [selectedFeatures, setValue]);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const hasChanges = () => {
    if (!selectedFeatures) return false;
    return (
      watchedValues.title !== selectedFeatures.title ||
      watchedValues.description !== selectedFeatures.description ||
      !!imageFile
    );
  };

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

  const onSubmit = async (data) => {
    setModalError("");
    try {
      setLoading(true);

      let imageUrl = selectedFeatures.icon;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) throw new Error("Image upload failed.");
      }

      const payload = {
        title: data.title,
        description: data.description,
        icon: imageUrl,
      };

      await axiosPublic.put(`/Gym_Features/${selectedFeatures._id}`, payload);

      setSelectedFeatures(null);
      Refetch();
      document.getElementById("Edit_Features_Modal").close();
    } catch (error) {
      console.error(error);
      setModalError(error.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit Feature : {selectedFeatures?.title}
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => {
            setSelectedFeatures(null);
            document.getElementById("Edit_Features_Modal").close();
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
      </form>
    </div>
  );
};

// Prop
HomePageAdminFeaturesEditModal.propTypes = {
  setSelectedFeatures: PropTypes.func.isRequired,
  selectedFeatures: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
  }),
  Refetch: PropTypes.func.isRequired,
};

export default HomePageAdminFeaturesEditModal;
