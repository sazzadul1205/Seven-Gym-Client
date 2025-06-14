import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Suggested tags (can be dynamic in the future)
const suggestedTags = [
  "Fitness",
  "Health",
  "Training",
  "Diet",
  "Motivation",
  "Workout",
  "Yoga",
  "Nutrition",
  "Weight Loss",
  "Strength",
  "Cardio",
  "Wellness",
  "Mental Health",
  "Exercise",
  "Hydration",
  "Flexibility",
  "Mobility",
  "Endurance",
  "Gym Tips",
  "Calisthenics",
  "Cross Fit",
  "Power Lifting",
  "Bodybuilding",
  "Aesthetics",
  "Hiit",
  "Lifestyle",
  "Recovery",
  "Sleep",
  "Stretching",
  "Self Care",
  "Discipline",
  "Consistency",
  "Home Workout",
  "Supplements",
  "Mindset",
  "Transformation",
  "Goals",
  "Coaching",
  "Gym Motivation",
  "Personal Training",
  "Group Training",
  "Injury Prevention",
  "Balance",
  "Core",
  "Strength Training",
  "Fat Burn",
];

const EditCommunityPostModal = ({ selectedPost, CommunityPostsRefetch }) => {
  const axiosPublic = useAxiosPublic();

  // State Management
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load post data into form and tags when a post is selected
  useEffect(() => {
    if (selectedPost) {
      reset({
        postTitle: selectedPost.postTitle,
        postContent: selectedPost.postContent,
      });
      setTags(selectedPost.tags || []);
    }
  }, [selectedPost, reset]);

  // Add a new tag if it's not a duplicate and limit is not reached
  const addTag = (newTag) => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (
      trimmedTag.length > 0 &&
      !tags.includes(trimmedTag) &&
      tags.length < 20
    ) {
      setTags((prev) => [...prev, trimmedTag]);
    }
    setTagInput(""); // Clear input after adding
  };

  // Remove a tag from the list
  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Handle tag input key events (Enter or comma to add tag)
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Submit updated post data to the server
  const onSubmit = async (formData) => {
    setIsSubmitting(true); // Start loading state

    const updatedPost = {
      ...selectedPost,
      postTitle: formData.postTitle.trim(),
      postContent: formData.postContent.trim(),
      tags,
    };

    try {
      // Send PATCH request to update the post
      await axiosPublic.patch(
        `/CommunityPosts/${selectedPost._id}`,
        updatedPost
      );
      setLocalError("");
      CommunityPostsRefetch();
      document.getElementById("Edit_Community_Post_Modal")?.close();
    } catch (err) {
      console.error("Error updating post:", err);
      setLocalError(`Error updating post: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-box max-w-3xl p-0 bg-gradient-to-b from-white to-gray-200 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Edit Community Post</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Edit_Community_Post_Modal")?.close()
          }
        />
      </div>

      {/* Display Local Error */}
      {localError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative m-4">
          <strong className="font-bold">Error:</strong>{" "}
          <span>{localError}</span>
        </div>
      )}

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

        {/* Tags */}
        <div>
          <label className="font-semibold">Tags</label>
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

        {/* Submit */}
        <div className="flex justify-end">
          <CommonButton
            type="submit"
            text="Update Post"
            textColor="text-white"
            bgColor="green"
            px="px-10"
            py="py-3"
            borderRadius="rounded-md"
            fontWeight="font-semibold"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            loadingText="Updating..."
          />
        </div>
      </form>
    </div>
  );
};

EditCommunityPostModal.propTypes = {
  selectedPost: PropTypes.object,
  CommunityPostsRefetch: PropTypes.func.isRequired,
};

export default EditCommunityPostModal;
