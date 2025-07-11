import { useState } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Hooks
import useAuth from "../../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

// Import Input  Field
import InputField from "../../../../../../Shared/InputField/InputField";

// import Common Button
import CommonButton from "../../../../../../Shared/Buttons/CommonButton";

const AddPriorityModal = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // State management
  const [tags, setTags] = useState([]);

  // Submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UseForm Utility
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  // Watch the "Very Important" checkbox value to apply dynamic styling
  const isVeryImportant = watch("isImportant", false);

  // Function to add a tag to the list
  const handleAddTag = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      setTags((prevTags) => [...prevTags, newTag]);
    }
  };

  // Function to remove a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  // Generate a unique ID for the new priority
  const generateUniqueId = (userEmail) => {
    if (!userEmail) return `pri-unknown-${Date.now()}`; // Handle missing email
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");

    // Get formatted time (HH:MM)
    const formattedTime = date.toTimeString().split(" ")[0].slice(0, 5); // HH:MM format

    // Generate a random 3-digit number (between 100 and 999)
    const randomNumber = Math.floor(Math.random() * 900) + 100;

    // Construct the ID
    return `priority-${userEmail}-${formattedDate}-${formattedTime}-${randomNumber}`;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true); // Set loading to true

    const uniqueId = generateUniqueId(user?.email);
    const newPriority = {
      email: user?.email,
      newPriority: { id: uniqueId, ...data, tags },
    };

    try {
      await axiosPublic.put("/User_Schedule/AddPriority", newPriority);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Priority added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      reset();
      refetch();
      setTags([]);
      document.getElementById("Add_Priority_Modal")?.close();
    } catch (error) {
      console.error("Error updating priority:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Add New Priority</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Add_Priority_Modal")?.close()}
        />
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <InputField
          label="Title"
          id="title"
          type="text"
          placeholder="Enter title"
          register={register}
          errors={errors}
          validation={{ required: "Title is required" }}
        />
        <InputField
          label="Content"
          id="content"
          type="textarea"
          placeholder="Enter content"
          register={register}
          errors={errors}
          validation={{ required: "Content is required" }}
        />

        <InputField
          label="Reminder"
          id="reminder"
          type="datetime-local"
          register={register}
          errors={errors}
          validation={{ required: "Reminder time is required" }}
        />

        {/* Very Important Checkbox */}
        <div className="flex items-center space-x-2 bg-yellow-200 rounded-xl px-2 py-2 gap-3">
          <input
            {...register("isImportant")}
            type="checkbox"
            id="isImportant"
            className="checkbox checkbox-error"
          />
          <label
            htmlFor="isImportant"
            className={`font-semibold px-3 py-1 text-xs md:text-md rounded-lg transition-all ${
              isVeryImportant
                ? "bg-red-500 text-white animate-pulse shadow-lg"
                : "bg-gray-200"
            }`}
          >
            Very Important? Check here!
          </label>
        </div>

        {/* Tags Input Section */}
        <div>
          <label className="block text-md font-semibold pb-1">Tags</label>
          <div className="flex items-center space-x-2">
            <input
              id="tags"
              type="text"
              className="input input-bordered w-full bg-white border-gray-600 py-3"
              placeholder="Enter tag"
              onBlur={(e) => {
                handleAddTag(e.target.value);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className="font-semibold text-md bg-linear-to-bl hover:bg-linear-to-tr from-emerald-300 to-emerald-600 shadow-lg py-2 px-8 cursor-pointer"
              onClick={() => {
                const tagInput = document.getElementById("tags");
                handleAddTag(tagInput.value);
                tagInput.value = "";
              }}
            >
              Add
            </button>
          </div>

          {/* Displaying added tags */}
          <div className="mt-2 flex flex-wrap gap-2 border border-gray-300 rounded-xl bg-white min-h-[50px] p-2 ">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex justify-between items-center gap-3 py-2 px-3 rounded-2xl"
                style={{
                  backgroundColor: `hsl(${index * 45}, 80%, 70%)`, // Different bright colors
                }}
              >
                <span className="font-semibold">{tag}</span>
                <ImCross
                  className="text-xs text-gray-700 cursor-pointer hover:text-gray-900"
                  onClick={() => handleRemoveTag(tag)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <CommonButton
            clickEvent={handleSubmit(onSubmit)}
            text="Save Changes"
            bgColor="green"
            isLoading={isSubmitting}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};

// PropTypes validation
AddPriorityModal.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AddPriorityModal;
