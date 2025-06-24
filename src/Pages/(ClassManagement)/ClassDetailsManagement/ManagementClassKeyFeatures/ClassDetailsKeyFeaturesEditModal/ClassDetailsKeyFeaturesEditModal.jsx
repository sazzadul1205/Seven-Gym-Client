import { useState, useEffect } from "react";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Packages
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// import Shred
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// import Modal
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const tagColors = [
  "#F72C5B",
  "#FFD700",
  "#4CAF50",
  "#1E90FF",
  "#FF4500",
  "#8A2BE2",
  "#FF69B4",
];

const getContrastColor = (hexColor) => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? "black" : "white";
};

const ClassDetailsKeyFeaturesEditModal = ({ selectedClass, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Local state for tags
  const [tags, setTags] = useState(selectedClass?.tags || []);
  // Loading state for save operation
  const [loading, setLoading] = useState(false);
  // Error message state
  const [modalError, setModalError] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Update local tags when selectedClass changes (e.g., modal open)
  useEffect(() => {
    setTags(selectedClass?.tags || []);
    setModalError(null);
    reset();
  }, [selectedClass, reset]);

  // Add a new tag from input
  const onSubmitAddTag = (data) => {
    const newTag = data.tag?.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    reset();
  };

  // Remove tag on click
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Save updated tags to backend
  const handleSaveChanges = async () => {
    setLoading(true);
    setModalError(null);
    try {
      // Prepare updated data payload with new tags
      // eslint-disable-next-line no-unused-vars
      const { _id, ...rest } = selectedClass; // separate _id from rest
      const updatedData = {
        ...rest,
        tags,
      };

      // Send PUT request
      await axiosPublic.put(
        `/Class_Details/${selectedClass?._id}`,
        updatedData
      );

      // Close modal on success
      document.getElementById("Class_Details_Key_Features_Edit_Modal")?.close();
      Refetch?.();

      // You can add success notification here if you want
    } catch (error) {
      // Show error message if save fails
      setModalError(
        error?.response?.data?.message || "Failed to save changes. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="Class_Details_Key_Features_Edit_Modal"
      className="modal-box max-w-xl p-0 bg-gradient-to-b from-white to-gray-300 text-black"
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit : {selectedClass?.module} Class Key Features
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => {
            setTags([]); // Clear tags state on modal close
            setModalError(null);
            reset();
            document
              .getElementById("Class_Details_Key_Features_Edit_Modal")
              ?.close();
          }}
        />
      </div>

      {/* Show errors if any */}
      {(Object.keys(errors).length > 0 || modalError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md space-y-1 text-sm m-5">
          {errors.tag && <div>Tag is required.</div>}
          {modalError && <div>{modalError}</div>}
        </div>
      )}

      {/* Add new tag input form */}
      <form
        onSubmit={handleSubmit(onSubmitAddTag)}
        className="px-6 pt-6 flex flex-col gap-4"
      >
        <label className="font-semibold">Add New Tag</label>
        <div className="flex gap-2">
          <input
            type="text"
            {...register("tag", { required: true })}
            placeholder="Enter a tag..."
            className="input input-bordered w-full bg-white"
            disabled={loading}
          />
          <CommonButton
            type="submit"
            text="Add Tag"
            px="px-2"
            py="py-2"
            width="[200px]"
            bgColor="green"
            className="self-start text-md"
            disabled={loading}
          />
        </div>
      </form>

      {/* Display current tags */}
      <div className="px-6 py-6">
        <h4 className="font-semibold mb-2">Current Tags:</h4>
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag, index) => {
              const bgColor = tagColors[index % tagColors.length];
              const textColor = getContrastColor(bgColor);
              return (
                <span
                  key={index}
                  onClick={() => !loading && handleRemoveTag(tag)}
                  className={`font-semibold px-4 py-2 rounded-xl text-center text-sm sm:text-base cursor-pointer hover:opacity-75 transition ${
                    loading ? "pointer-events-none opacity-50" : ""
                  }`}
                  style={{ backgroundColor: bgColor, color: textColor }}
                  title="Click to remove"
                >
                  {tag}
                </span>
              );
            })
          ) : (
            <p className="text-gray-600">No tags available.</p>
          )}
        </div>
      </div>

      {/* Save Changes button */}
      <div className="md:col-span-2 flex justify-end px-6 pb-6">
        <CommonButton
          clickEvent={handleSaveChanges}
          text="Save Changes"
          bgColor="green"
          isLoading={loading}
          loadingText="Saving..."
          disabled={loading}
        />
      </div>
    </div>
  );
};

ClassDetailsKeyFeaturesEditModal.propTypes = {
  selectedClass: PropTypes.shape({
    _id: PropTypes.string,
    module: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  Refetch: PropTypes.func,
};

export default ClassDetailsKeyFeaturesEditModal;
