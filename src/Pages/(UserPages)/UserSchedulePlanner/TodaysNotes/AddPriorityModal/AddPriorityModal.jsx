import { ImCross } from "react-icons/im";
import { useForm } from "react-hook-form"; // Importing react-hook-form
import { useState } from "react"; // Import useState for tag management

const InputField = ({
  label,
  id,
  type,
  placeholder,
  register,
  errors,
  options = [],
  value,
  handleAddTag,
  handleRemoveTag,
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
    ) : type === "checkbox" ? (
      <input {...register(id)} type={type} id={id} className="checkbox" />
    ) : (
      <input
        {...register(id, options)}
        type={type}
        id={id}
        className="input input-bordered rounded-xl w-full"
        placeholder={placeholder}
        value={value} // Controlled input for tags
        onChange={(e) => handleAddTag(e.target.value)} // Handle adding tags
      />
    )}
    {errors[id] && <p className="text-red-500 text-sm">{errors[id].message}</p>}
  </div>
);

const AddPriorityModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [tags, setTags] = useState([]); // State to manage tags

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form submitted: ", { ...data, tags });
    document.getElementById("Add_Priority_Modal").close();
  };

  // Add tag to the state
  const handleAddTag = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      setTags((prevTags) => [...prevTags, newTag]);
    }
  };

  // Remove tag from the state
  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="modal-box p-0">
      <div className="flex justify-between items-center border-b border-gray-300 p-4 pb-2">
        <h3 className="font-bold text-lg">Add New Priority</h3>
        <ImCross
          className="hover:text-[#F72C5B] cursor-pointer transition duration-200"
          onClick={() => document.getElementById("Add_Priority_Modal").close()}
        />
      </div>

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
          label="Created By"
          id="createdBy"
          type="email"
          placeholder="Enter creator's email"
          register={register}
          errors={errors}
          options={{ required: "Creator is required" }}
        />
        <InputField
          label="Assigned To"
          id="assignedTo"
          type="email"
          placeholder="Enter assignee's email"
          register={register}
          errors={errors}
          options={{ required: "Assignee is required" }}
        />
        <InputField
          label="Reminder"
          id="reminder"
          type="datetime-local"
          register={register}
          errors={errors}
          options={{ required: "Reminder time is required" }}
        />
        <InputField
          label="Is Important"
          id="isImportant"
          type="checkbox"
          register={register}
          errors={errors}
        />
        <InputField
          label="Status"
          id="status"
          type="select"
          register={register}
          errors={errors}
          options={{ required: "Status is required" }}
          options={["not started", "in progress", "completed"]}
        />

        {/* Tags Input Section */}
        <div>
          <label htmlFor="tags" className="block text-md font-semibold pb-1">
            Tags (comma separated)
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="tags"
              type="text"
              className="input input-bordered rounded-xl w-full"
              placeholder="Enter tag"
              onBlur={(e) => handleAddTag(e.target.value)} // Add tag on blur
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                handleAddTag(document.getElementById("tags").value)
              } // Add tag on button click
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex justify-between items-center gap-3 bg-red-300 py-2 px-2 rounded-lg"
              >
                {tag}
                <ImCross
                  className="ml-2 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)} // Remove tag on cross click
                />
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Add Priority
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPriorityModal;
