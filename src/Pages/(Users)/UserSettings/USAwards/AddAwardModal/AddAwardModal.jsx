import React from "react";
import { useForm } from "react-hook-form";

const AddAwardModal = ({ setAddAwardData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const closeModal = () => {
    document.getElementById("Add_Award_Modal").close();
    reset(); // Reset form after closing the modal
  };

  const handleFormSubmit = (data) => {
    setAddAwardData(data); // Pass form data to parent or handle directly
    closeModal();
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
      {/* Icon URL */}
      <div>
        <label className="block text-sm font-medium">Icon URL</label>
        <input
          type="url"
          {...register("icon", { required: "Icon URL is required" })}
          className="input input-bordered w-full"
        />
        {errors.icon && (
          <span className="text-red-500 text-sm">{errors.icon.message}</span>
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
