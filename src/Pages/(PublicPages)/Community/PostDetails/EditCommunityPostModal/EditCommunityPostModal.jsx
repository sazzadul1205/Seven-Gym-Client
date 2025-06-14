import { ImCross } from "react-icons/im";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import { useForm } from "react-hook-form";

const EditCommunityPostModal = ({ selectedPost, CommunityPostsRefetch }) => {
  console.log(selectedPost);

  // Hook Form Control
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Add a new tag to the tag list if it's valid and not a duplicate
  const addTag = (newTag) => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (
      trimmedTag.length > 0 &&
      !tags.includes(trimmedTag) &&
      tags.length < 20 // Max 20 tags allowed
    ) {
      setTags((prev) => [...prev, trimmedTag]);
    }
    setTagInput(""); // Clear the input field
  };

  // Remove a tag from the tag list
  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Handle "Enter" or comma key to add tag from input
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Handle form submission for posting a new community post
  const onSubmit = async (formData) => {
    console.log(formData);
  };

  return (
    <div className="modal-box max-w-3xl p-0 bg-gradient-to-b from-white to-gray-200 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit Community Post : {selectedPost?.postTitle}
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Edit_Community_Post_Modal")?.close()
          }
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
        {/* Post Title */}
        <div>
          <label className="font-semibold">Post Title</label>
          <input
            type="text"
            {...register("postTitle", { required: "Title is required" })}
            placeholder="Enter post title"
            className="input input-bordered rounded-lg w-full bg-white border-gray-600"
          />
          {errors.postTitle && (
            <p className="text-red-500 text-sm">{errors.postTitle.message}</p>
          )}
        </div>

        {/* Post Content */}
        <div>
          <label className="font-semibold">Post Content</label>
          <textarea
            {...register("postContent", { required: "Content is required" })}
            placeholder="Write your post..."
            className="textarea textarea-bordered rounded-lg w-full bg-white border-gray-600 h-40 mt-1"
          />
          {errors.postContent && (
            <p className="text-red-500 text-sm">{errors.postContent.message}</p>
          )}
        </div>

        {/* Tags Input with Preview */}
        <div>
          {/* Label */}
          <label className="font-semibold">Tags</label>

          {/* Tag input */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag and press Enter"
              className="input input-bordered rounded-lg w-full bg-white border-gray-600"
            />
            <button
              type="button"
              onClick={() => addTag(tagInput)}
              className="btn bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Tag
            </button>
          </div>

          {/* Tag Preview */}
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                #{tag}
                <ImCross
                  className="cursor-pointer text-xs"
                  onClick={() => removeTag(tag)}
                />
              </span>
            ))}
          </div>

          {/* Suggestions */}
          <div className="mt-4">
            <p className="font-medium text-sm mb-1">Suggestions:</p>

            <div
              className={`flex flex-wrap gap-2 overflow-hidden ${
                showAllSuggestions ? "" : "max-h-[4.5rem]" /* ~3 lines height */
              }`}
              style={{ transition: "max-height 0.3s ease" }}
            >
              {suggestedTags
                .filter((s) => !tags.includes(s))
                .map((suggestion, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => addTag(suggestion)}
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded-full"
                  >
                    {suggestion}
                  </button>
                ))}
            </div>

            {/* Show more/less button */}
            {suggestedTags.filter((s) => !tags.includes(s)).length > 15 && (
              <button
                type="button"
                onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                className="mt-1 text-blue-600 hover:underline text-sm"
              >
                {showAllSuggestions ? "Show Less ▲" : "Show More ..."}
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <CommonButton
            type="submit"
            text="Submit Post"
            textColor="text-white"
            bgColor="green"
            px="px-10"
            py="py-3"
            borderRadius="rounded-md"
            fontWeight="font-semibold"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            loadingText="Posting..."
          />
        </div>
      </form>
    </div>
  );
};

export default EditCommunityPostModal;
