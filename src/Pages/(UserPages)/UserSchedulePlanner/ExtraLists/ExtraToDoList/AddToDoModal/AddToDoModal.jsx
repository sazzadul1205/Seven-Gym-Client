import { useState } from "react";
import { useParams } from "react-router";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Utility
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

// Categories Options
const predefinedCategories = [
  "Work",
  "Personal",
  "Shopping",
  "Health",
  "Finance",
  "Education",
  "Travel",
  "Fitness",
  "Hobbies",
  "Entertainment",
  "Self-Improvement",
  "Social",
  "Family",
  "Home",
  "Spirituality",
  "Technology",
  "Projects",
  "Events",
  "Volunteering",
  "Other",
];

const AddToDoModal = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { email } = useParams();

  // State management
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // UseForm Utility
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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

  // Generate a unique To-Do ID
  const generateUniqueId = (userEmail) => {
    if (!userEmail) return `todo-unknown-${Date.now()}`;
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");

    // Get formatted time (HH:MM)
    const formattedTime = date.toTimeString().split(" ")[0].slice(0, 5); // HH:MM

    // Generate a random 3-digit number (between 100 and 999)

    const randomNumber = Math.floor(Math.random() * 900) + 100;

    // Construct the ID
    return `todo-${userEmail}-${formattedDate}-${formattedTime}-${randomNumber}`;
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true); // Start loading state

    const uniqueId = generateUniqueId(email);
    const newToDo = {
      email,
      newTodo: { id: uniqueId, ...data, category, tags },
    };

    try {
      await axiosPublic.put("/Schedule/AddToDo", newToDo);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "To-Do added successfully.",
      });

      reset();
      refetch();
      setTags([]);
      setCategory("");
      document.getElementById("Add_To-Do_Modal").close();
    } catch (error) {
      console.error("Error adding To-Do:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Add New To-Do</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Add_To-Do_Modal")?.close()}
        />
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <InputField
          label="Task Name"
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
          type="textarea"
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

        {/* Category Selection */}
        <div>
          <label className="block text-md font-semibold pb-1">Category</label>
          <input
            list="category-options"
            className="input input-bordered rounded-lg w-full bg-white border-gray-600"
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
              className="input input-bordered w-full bg-white border-gray-600 py-3"
              placeholder="Enter tag"
              onBlur={(e) => {
                handleAddTag(e.target.value);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className="font-semibold text-2xl bg-linear-to-bl hover:bg-linear-to-tr from-emerald-300 to-emerald-600 shadow-lg py-2 px-8 cursor-pointer"
              onClick={() => {
                const tagInput = document.getElementById("tags");
                handleAddTag(tagInput.value);
                tagInput.value = "";
              }}
            >
              Add
            </button>
          </div>

          {/* Display added tags */}
          <div className="mt-2 flex flex-wrap gap-2 border border-gray-300 rounded-xl bg-white min-h-[50px] p-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-3 py-2 px-3 rounded-2xl"
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
            className="font-semibold bg-linear-to-br hover:bg-linear-to-tl from-green-300 to-green-600 rounded-xl shadow-xl text-white px-10 py-3 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add To-Do"}
          </button>
        </div>
      </form>
    </div>
  );
};

// PropTypes validation
AddToDoModal.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AddToDoModal;

// Reusable input field component
const InputField = ({
  label,
  id,
  type,
  placeholder,
  register,
  errors,
  options = [],
}) => (
  <div>
    <label htmlFor={id} className="block font-bold ml-1 mb-2">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        {...register(id)}
        id={id}
        className="textarea textarea-bordered w-full rounded-lg bg-white border-gray-600"
        placeholder={placeholder}
      />
    ) : type === "select" ? (
      <select
        {...register(id)}
        id={id}
        className="select select-bordered w-full rounded-lg bg-white border-gray-600"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input
        {...register(id)}
        type={type}
        id={id}
        className="input input-bordered w-full rounded-lg bg-white border-gray-600"
        placeholder={placeholder}
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
    "textarea",
    "select",
  ]).isRequired,
  placeholder: PropTypes.string,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.string), // Only applies if type is "select"
};
