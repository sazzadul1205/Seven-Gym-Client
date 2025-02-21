import { ImCross } from "react-icons/im";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams } from "react-router";

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
    <label htmlFor={id} className="block text-md font-semibold pb-1">
      {label}
    </label>
    {type === "select" ? (
      <select
        {...register(id, options)}
        id={id}
        className="input input-bordered rounded-xl w-full"
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <input
        {...register(id, options)}
        type={type}
        id={id}
        className={`input input-bordered rounded-xl w-full`}
        placeholder={placeholder}
      />
    )}
    {errors[id] && (
      <p className="text-red-500 text-sm">{errors[id]?.message}</p>
    )}
  </div>
);

const AddPriorityModal = () => {
  const { email } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm(); // React Hook Form for form handling
  const [tags, setTags] = useState([]); // State for storing tags

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
    return `pri-${email}-${formattedDate}-${formattedTime}-${randomNumber}`;
  };

  // Form submission handler
  const onSubmit = (data) => {
    const uniqueId = generateUniqueId(email); // Generate unique ID
    console.log("Form submitted: ", { id: uniqueId, ...data, tags });
    document.getElementById("Add_Priority_Modal").close(); // Close modal after submission
  };

  return (
    <div className="modal-box p-0">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center border-b border-gray-300 p-4 pb-2">
        <h3 className="font-bold text-lg">Add New Priority</h3>
        <ImCross
          className="hover:text-[#F72C5B] cursor-pointer transition duration-200"
          onClick={() => document.getElementById("Add_Priority_Modal").close()}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <InputField
          label="Title"
          id="title"
          type="text"
          placeholder="Enter title"
          register={register}
          errors={errors}
          options={{ required: "Title is required" }}
        />
        <InputField
          label="Content"
          id="content"
          type="textarea"
          placeholder="Enter content"
          register={register}
          errors={errors}
          options={{ required: "Content is required" }}
        />
        <InputField
          label="Reminder"
          id="reminder"
          type="datetime-local"
          register={register}
          errors={errors}
          options={{ required: "Reminder time is required" }}
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
                e.target.value = ""; // Clear input after adding
              }}
            />
            <button
              type="button"
              className="font-semibold bg-green-400 hover:bg-green-500 shadow-lg py-2 px-8"
              onClick={() => {
                const tagInput = document.getElementById("tags");
                handleAddTag(tagInput.value);
                tagInput.value = ""; // Clear input after adding
              }}
            >
              Add
            </button>
          </div>

          {/* Displaying added tags */}
          <div className="mt-2 flex flex-wrap gap-2 border border-gray-300 rounded-xl p-2 ">
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
            className="font-semibold bg-gradient-to-br hover:bg-gradient-to-tl from-green-400 to-green-500 rounded-xl shadow-xl px-10 py-3"
          >
            Add Priority
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPriorityModal;
