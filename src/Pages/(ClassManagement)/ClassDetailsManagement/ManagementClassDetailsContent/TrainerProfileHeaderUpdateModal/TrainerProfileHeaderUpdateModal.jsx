import React, { useRef, useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Image Hosting Setup
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const TrainerProfileHeaderUpdateModal = ({ selectedClass, Refetch }) => {
  const fileInputRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  // Local State
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Submit logic
  const onSubmit = async (data) => {
    setModalError("");
    setLoading(true); // Start loading

    let uploadedImageURL = preview;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImageURL = res?.data?.data?.display_url || null;
      } catch (error) {
        console.log(error);

        setModalError("Image upload failed");
        setLoading(false); // Stop loading
        return;
      }
    }

    const updatedData = {
      ...data,
      icon: uploadedImageURL,
    };
    console.log(uploadedImageURL);
    

    try {
      console.log("Submitted Class Update:", updatedData);
      // TODO: await axiosPublic.patch(...) here for actual update
      Refetch?.(); // Trigger refetch
      // Optional: show a toast or success message
      // e.g., toast.success("Class updated successfully!");
    } catch (error) {
      console.log(error);

      setModalError("Update failed.");
    }

    setLoading(false); // End loading
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

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 gap-6 px-6 py-6"
      >
        {/* Module */}
        <div>
          <label className="label font-bold text-black pb-1">Module</label>
          <input
            type="text"
            {...register("module", { required: "Module is required" })}
            className="input input-bordered w-full bg-white"
          />
          {errors.module && (
            <p className="text-red-500 text-sm">{errors.module.message}</p>
          )}
        </div>

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
          <label className="label font-bold text-black pb-1">Description</label>
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

        {/* Image Upload */}
        <div className="md:col-span-2 flex flex-col items-center gap-3">
          <div
            className={`w-[200px] h-[200px] border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden cursor-pointer ${
              isDragging
                ? "border-blue-500 bg-blue-100"
                : "border-gray-400 hover:border-black"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full bg-white h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm text-center px-4">
                Drag, drop, or click to select an image
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (preview) URL.revokeObjectURL(preview);
                  setImageFile(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </div>

        {/* Error */}
        {modalError && (
          <p className="text-red-600 text-center md:col-span-2">{modalError}</p>
        )}

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

TrainerProfileHeaderUpdateModal.propTypes = {
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

export default TrainerProfileHeaderUpdateModal;
