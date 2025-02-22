/* eslint-disable react/prop-types */
import { useState } from "react";

import { useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import { useParams } from "react-router";
import Swal from "sweetalert2";

import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const predefinedCategories = [
  "Work",
  "Personal",
  "Shopping",
  "Health",
  "Finance",
  "Education",
  "Travel",
  "Other",
];

const AddToDoModal = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { email } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");

  const handleAddTag = (value) => {
    if (value.trim() && !tags.includes(value)) {
      setTags([...tags, value]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
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
    return `todo-${email}-${formattedDate}-${formattedTime}-${randomNumber}`;
  };

  const onSubmit = async (data) => {
    const uniqueId = generateUniqueId(email);
    const newToDo = {
      email: email,
      newTodo: { id: uniqueId, ...data, category, tags },
    };

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axiosPublic.put("/Schedule/AddToDo", newToDo);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Priority updated successfully.",
      });

      reset();
      refetch();
      setTags([]);
      setCategory("");
      document.getElementById("Add_To-Do_Modal").close();
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
        <h3 className="font-bold text-lg">Add New To-Do</h3>
        <ImCross
          className="hover:text-[#F72C5B] cursor-pointer transition duration-200"
          onClick={() => document.getElementById("Add_To-Do_Modal").close()}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <InputField
          label="Task"
          id="task"
          type="text"
          placeholder="Enter task name"
          register={register}
          errors={errors}
          options={{ required: "Task is required" }}
        />

        <InputField
          label="Description"
          id="description"
          type="text"
          placeholder="Enter task description"
          register={register}
          errors={errors}
          options={{ required: "Description is required" }}
        />

        <InputField
          label="Due Date"
          id="dueDate"
          type="date"
          register={register}
          errors={errors}
          options={{ required: "Due date is required" }}
        />

        <InputField
          label="Priority"
          id="priority"
          type="select"
          options={["High", "Medium", "Low"]}
          register={register}
          errors={errors}
        />

        {/* Combined Category Input */}
        <div>
          <label className="block text-md font-semibold pb-1">Category</label>
          <input
            list="category-options"
            className="input input-bordered rounded-xl w-full"
            placeholder="Select or enter a category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="category-options">
            {predefinedCategories.map((cat, idx) => (
              <option key={idx} value={cat} />
            ))}
          </datalist>
        </div>

        <InputField
          label="Estimated Time"
          id="estimatedTime"
          type="text"
          placeholder="e.g. 2 hours"
          register={register}
          errors={errors}
          options={{ required: "Estimated time is required" }}
        />

        {/* Tags Input Section */}
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
            Add To-Do
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable input field component
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
    {type === "select" ? (
      <select
        {...register(id)}
        id={id}
        className="input input-bordered rounded-xl w-full"
      >
        <option value="">Select {label}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <input
        {...register(id)}
        type={type}
        id={id}
        className="input input-bordered rounded-xl w-full"
        placeholder={placeholder}
      />
    )}
    {errors[id] && (
      <p className="text-red-500 text-sm">{errors[id]?.message}</p>
    )}
  </div>
);

export default AddToDoModal;
