import { useRef, useState, useEffect } from "react";

// Import Packages
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Import Icons
import { ImCross } from "react-icons/im";
import { RiImageAddFill } from "react-icons/ri";

// import Shared
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Image Hosting Setup
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const ClassDetailsContentEditModal = ({ selectedClass, Refetch }) => {
  const fileInputRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  // Local State
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Set default values when modal opens
  useEffect(() => {
    if (selectedClass) {
      setValue("module", selectedClass.module || "");
      setValue("description", selectedClass.description || "");
      setValue("additionalInfo", selectedClass.additionalInfo || "");
      setValue("difficultyLevel", selectedClass.difficultyLevel || "");
      setValue("prerequisites", selectedClass.prerequisites || "");
      setPreview(selectedClass.icon || null);
    }
  }, [selectedClass, setValue]);

  // Open file selector
  const handleImageClick = () => fileInputRef.current?.click();

  // Handle image drop
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

  // Submit logic
  const onSubmit = async (data) => {
    setModalError("");
    setLoading(true);

    let uploadedImageURL = preview;

    // Upload new image if changed
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImageURL = res?.data?.data?.display_url || null;
      } catch (error) {
        console.error("Image upload error:", error);
        setModalError("Image upload failed");
        setLoading(false);
        return;
      }
    }

    const updatedData = {
      ...data,
      icon: uploadedImageURL,
    };

    try {
      // Actual PUT request using selectedClass._id
      await axiosPublic.put(
        `/Class_Details/${selectedClass?._id}`,
        updatedData
      );
      document.getElementById("Class_Detail_Content_Edit_Modal")?.close();

      Refetch?.();
    } catch (error) {
      console.error("PUT request failed:", error);
      setModalError(`Failed to update class details : ${error}`);
    }

    setLoading(false);
  };

  // UI
  return (
    <div className="modal-box max-w-4xl p-0 bg-gradient-to-b from-white to-gray-300 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit: {selectedClass?.module} Class Details
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Class_Detail_Content_Edit_Modal")?.close()
          }
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
      <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-3">
        <div className="flex gap-5 ">
          <div className="w-3/4 space-y-2">
            {/* Difficulty Level */}
            <div>
              <label className="label font-bold text-black pb-1">
                Difficulty Level
              </label>
              <input
                type="text"
                {...register("difficultyLevel")}
                className="input input-bordered w-full bg-white"
              />
            </div>

            {/* Prerequisites */}
            <div className="md:col-span-2">
              <label className="label font-bold text-black pb-1">
                Prerequisites
              </label>
              <textarea
                rows={2}
                {...register("prerequisites")}
                className="textarea textarea-bordered w-full bg-white"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="label font-bold text-black pb-1">
                Description
              </label>
              <textarea
                rows={3}
                {...register("description")}
                className="textarea textarea-bordered w-full bg-white"
              />
            </div>

            {/* Additional Info */}
            <div className="md:col-span-2">
              <label className="label font-bold text-black pb-1">
                Additional Info
              </label>
              <textarea
                rows={3}
                {...register("additionalInfo")}
                className="textarea textarea-bordered w-full bg-white"
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="md:col-span-2">
            <div className="flex flex-col items-center justify-center min-h-[250px] text-center">
              <label className="block font-bold mb-4 text-lg">Icon</label>

              <div
                onClick={handleImageClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`w-[120px] h-[120px] rounded-full border-2 border-dashed ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-500"
                } flex items-center justify-center group cursor-pointer relative overflow-hidden transition-all duration-200`}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-contain p-2"
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
          </div>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <CommonButton
            clickEvent={handleSubmit(onSubmit)}
            text="Save Changes"
            bgColor="green"
            isLoading={loading}
            loadingText="Saving..."
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

// Prop Validation
ClassDetailsContentEditModal.propTypes = {
  selectedClass: PropTypes.shape({
    _id: PropTypes.string,
    module: PropTypes.string,
    description: PropTypes.string,
    additionalInfo: PropTypes.string,
    difficultyLevel: PropTypes.string,
    prerequisites: PropTypes.string,
    icon: PropTypes.string,
  }),
  Refetch: PropTypes.func,
};

export default ClassDetailsContentEditModal;
