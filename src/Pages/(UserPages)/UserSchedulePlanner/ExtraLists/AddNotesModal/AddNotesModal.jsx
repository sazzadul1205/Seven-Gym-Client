/* eslint-disable react/prop-types */
import { useState } from "react";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { useParams } from "react-router";

const AddNotesModal = ({ refetch }) => {
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();

  const [tags, setTags] = useState([]);

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

  // Function to remove a tag from the list
  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  // Function to generate unique ID
  const generateUniqueId = (email) => {
    const date = new Date();

    // Get formatted date (DD-MM-YYYY)
    const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");

    // Get formatted time (HH:MM)
    const formattedTime = date.toTimeString().split(" ")[0].slice(0, 5); // HH:MM format

    // Generate a random 3-digit number (between 100 and 999)
    const randomNumber = Math.floor(Math.random() * 900) + 100;

    // Construct the ID
    return `note-${email}-${formattedDate}-${formattedTime}-${randomNumber}`;
  };

  // Form submission handler
  const onSubmit = async (data) => {
    const uniqueId = generateUniqueId(email); // Generate unique ID
    const newNote = {
      email: email,
      newNote: { id: uniqueId, ...data, tags },
    };

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axiosPublic.put("/Schedule/AddNotes", newNote);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Priority updated successfully.",
      });

      reset();
      refetch();
      setTags([]);
      document.getElementById("Add_Priority_Modal").close();
    } catch (error) {
      console.error("Error updating priority:", error);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
    }
  };

  return (
    <div className="modal-box p-0">
      <div className="flex justify-between items-center border-b border-gray-300 p-4 pb-2">
        <h3 className="font-bold text-lg">Add New Note</h3>
        <ImCross
          className="hover:text-[#F72C5B] cursor-pointer transition duration-200"
          onClick={() => document.getElementById("Add_Notes_Modal").close()}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <InputField
          label="Title"
          id="title"
          type="text"
          placeholder="Enter note title"
          register={register}
          errors={errors}
          options={{ required: "Title is required" }}
        />

        <InputField
          label="Content"
          id="content"
          type="text"
          placeholder="Enter note content"
          register={register}
          errors={errors}
          options={{ required: "Content is required" }}
        />

        {/* Reminder Date */}
        <InputField
          label="Reminder"
          id="reminder"
          type="datetime-local"
          register={register}
          errors={errors}
        />

        {/* Very Important Checkbox with Glowing Effect */}
        <div className="flex items-center space-x-2 bg-yellow-200 p-1">
          <input
            {...register("isImportant")}
            type="checkbox"
            id="isImportant"
            className="checkbox border-black"
          />
          <label
            htmlFor="isImportant"
            className={`font-semibold px-3 py-1 rounded-lg transition-all ${
              isVeryImportant
                ? "bg-red-500 text-white animate-pulse shadow-lg"
                : "bg-gray-200"
            }`}
          >
            Very Important? Check here!
          </label>
        </div>

        {/* Tags Input */}
        <div>
          <label className="block text-md font-semibold pb-1">Tags</label>
          <div className="flex items-center space-x-2">
            <input
              id="tags"
              type="text"
              className="input input-bordered rounded-xl w-full"
              placeholder="Enter tag"
              onBlur={(e) => {
                handleAddTag(e.target.value);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className="font-semibold bg-green-400 hover:bg-green-500 shadow-lg py-2 px-4 rounded-xl"
              onClick={() => {
                const tagInput = document.getElementById("tags");
                handleAddTag(tagInput.value);
                tagInput.value = "";
              }}
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 border border-gray-300 rounded-xl p-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex justify-between items-center gap-2 py-1 px-3 rounded-2xl"
                style={{ backgroundColor: `hsl(${index * 45}, 80%, 70%)` }}
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
            className="font-semibold bg-gradient-to-br hover:bg-gradient-to-tl from-green-400 to-green-500 rounded-xl shadow-xl px-10 py-3"
          >
            Add Note
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable Input Component
const InputField = ({
  label,
  id,
  type,
  placeholder,
  register,
  errors,
  options,
}) => (
  <div>
    <label htmlFor={id} className="block text-md font-semibold pb-1">
      {label}
    </label>
    <input
      {...register(id, options)}
      type={type}
      id={id}
      className="input input-bordered rounded-xl w-full"
      placeholder={placeholder}
    />
    {errors[id] && (
      <p className="text-red-500 text-sm">{errors[id]?.message}</p>
    )}
  </div>
);

export default AddNotesModal;
