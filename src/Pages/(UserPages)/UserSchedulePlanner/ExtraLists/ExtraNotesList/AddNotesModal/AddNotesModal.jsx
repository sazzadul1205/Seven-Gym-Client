import { useState } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Utility
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../../Hooks/useAuth";

const AddNotesModal = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // State management
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Generate a unique ID
  const generateUniqueId = (userEmail) => {
    if (!userEmail) return `pri-unknown-${Date.now()}`; // Handle missing email
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");

    // Get formatted time (HH:MM)
    const formattedTime = date.toTimeString().split(" ")[0].slice(0, 5); // HH:MM format

    // Generate a random 3-digit number (between 100 and 999)
    const randomNumber = Math.floor(Math.random() * 900) + 100;

    // Construct the ID
    return `note-${userEmail}-${formattedDate}-${formattedTime}-${randomNumber}`;
  };

  const onSubmit = async (data) => {
    setLoading(true); // Set loading to true

    const uniqueId = generateUniqueId(user?.email);
    const newNote = {
      email: user?.email,
      newNote: { id: uniqueId, ...data, tags },
    };

    try {
      await axiosPublic.put("/User_Schedule/AddNotes", newNote);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Note added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      reset();
      refetch();
      setTags([]);
      document.getElementById("Add_Note_Modal").close();
    } catch (error) {
      console.error("Error adding note:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Add New Note</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Add_Note_Modal")?.close()}
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
          <button
            type="submit"
            className="font-semibold bg-linear-to-br hover:bg-linear-to-tl from-green-300 to-green-600 rounded-xl shadow-xl text-white px-10 py-3 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Note"}
          </button>
        </div>
      </form>
    </div>
  );
};

// PropTypes validation
AddNotesModal.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AddNotesModal;

// Reusable input field component
const InputField = ({
  label,
  id,
  type,
  placeholder,
  register,
  errors,
  validation = {},
  options = [],
}) => (
  <div>
    <label htmlFor={id} className="block font-bold ml-1 mb-2">
      {label}
    </label>

    {type === "textarea" ? (
      <textarea
        className="textarea textarea-bordered w-full rounded-lg bg-white border-gray-600"
        {...register(id, validation)}
        placeholder={placeholder}
        id={id}
      />
    ) : type === "select" ? (
      <select
        className="select select-bordered w-full rounded-lg bg-white border-gray-600"
        {...register(id, validation)}
        id={id}
      >
        {Array.isArray(options) ? (
          options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))
        ) : (
          <option value="">Invalid options</option>
        )}
      </select>
    ) : (
      <input
        className="input input-bordered w-full rounded-lg bg-white border-gray-600"
        {...register(id, validation)}
        placeholder={placeholder}
        type={type}
        id={id}
      />
    )}

    {errors[id] && (
      <p className="text-red-500 text-sm">{errors[id]?.message}</p>
    )}
  </div>
);

// PropTypes validation
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    "text",
    "email",
    "password",
    "number",
    "date",
    "datetime-local",
    "textarea",
    "select",
  ]).isRequired,
  placeholder: PropTypes.string,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  validation: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.string),
};
