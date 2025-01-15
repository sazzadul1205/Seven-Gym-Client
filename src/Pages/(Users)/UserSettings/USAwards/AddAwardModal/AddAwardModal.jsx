/* eslint-disable react/prop-types */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcAddImage } from "react-icons/fc";

const AddAwardModal = ({ setAddAwardData }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const closeModal = () => {
    document.getElementById("Add_Award_Modal").close();
    reset(); // Reset form after closing the modal
    setPreviewImage(null); // Clear the preview image
  };

  const handleFormSubmit = (data) => {
    setAddAwardData(data); // Pass form data to parent or handle directly
    closeModal();
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result); // Set the image preview
      setValue("icon", reader.result); // Update the form state
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Icon URL */}
      <div className="border-y border-gray-300 my-2 py-3">
        <label className="block text-lg font-medium text-center pb-2">
          Icon URL
        </label>
        <div
          className="mx-auto w-[200px] h-[200px] border border-dashed border-black p-5 rounded-full cursor-pointer flex items-center justify-center overflow-hidden relative"
          onClick={() => document.getElementById("iconUploadInput").click()}
          onDragOver={(e) => e.preventDefault()} // Allow drag-over event
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
              handleImageUpload(file);
            }
          }}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <FcAddImage className="w-[100px] h-[100px] hover:w-[120px] hover:h-[120px]" />
          )}
        </div>
        <input
          type="file"
          id="iconUploadInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleImageUpload(file);
            }
          }}
        />
        <input
          type="hidden"
          {...register("icon", {
            required: "Icon is required",
          })}
        />
        {errors.icon && (
          <span className="text-red-500 text-sm">{errors.icon.message}</span>
        )}
      </div>

      {/* Class Name */}
      <div>
        <label className="block text-sm font-medium">Class Name</label>
        <input
          type="text"
          {...register("className", {
            required: "Class Name is required",
          })}
          className="input input-bordered w-full"
        />
        {errors.className && (
          <span className="text-red-500 text-sm">
            {errors.className.message}
          </span>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register("description", {
            required: "Description is required",
          })}
          className="textarea textarea-bordered w-full"
        ></textarea>
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Date Awarded */}
      <div>
        <label className="block text-sm font-medium">Date Awarded</label>
        <input
          type="date"
          {...register("dateAwarded", {
            required: "Date Awarded is required",
          })}
          className="input input-bordered w-full"
        />
        {errors.dateAwarded && (
          <span className="text-red-500 text-sm">
            {errors.dateAwarded.message}
          </span>
        )}
      </div>

      {/* Instructor */}
      <div>
        <label className="block text-sm font-medium">Instructor</label>
        <input
          type="text"
          {...register("instructor", {
            required: "Instructor is required",
          })}
          className="input input-bordered w-full"
        />
        {errors.instructor && (
          <span className="text-red-500 text-sm">
            {errors.instructor.message}
          </span>
        )}
      </div>

      {/* Level */}
      <div>
        <label className="block text-sm font-medium">Level</label>
        <select
          {...register("level", { required: "Level is required" })}
          className="select select-bordered w-full"
        >
          <option value="">Select Level</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
        </select>
        {errors.level && (
          <span className="text-red-500 text-sm">{errors.level.message}</span>
        )}
      </div>

      {/* Submit and Close Buttons */}
      <div className="modal-action">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="button" className="btn" onClick={closeModal}>
          Close
        </button>
      </div>
    </form>
  );
};

export default AddAwardModal;
