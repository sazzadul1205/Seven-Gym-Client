import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import {
  FaRegTrashAlt,
  FaThumbsDown,
  FaThumbsUp,
  FaTimes,
} from "react-icons/fa";

// Import Shared
import FetchingError from "../../../../Shared/Component/FetchingError";
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import Loading from "../../../../Shared/Loading/Loading";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";

// Import Detailed Comment Component
import PostDetailsComment from "./PostDetailsComment/PostDetailsComment";

// Import User/Trainer Data
import { useUserOrTrainerData } from "./useUserOrTrainerData";

// import Fetch Author Image
import usePostAuthorImage from "../fetchPostAuthorImage";

// Import Css
import "./PostDetails.css";

// Utility function to format date to a human-readable string
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const PostDetails = ({
  selectedPost,
  setSelectedPost,
  CommunityPostsRefetch,
}) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Local component state
  const [deleting, setDeleting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [animateClass, setAnimateClass] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get author image for post
  const authorImage = usePostAuthorImage(selectedPost);

  // Fetch logged-in user's full data and role (trainer/member)
  const { data, isLoading, error, role } = useUserOrTrainerData(user?.email);

  // Update selected post state with new values (likes/comments)
  const updatePostLikes = (updatedPost) => {
    setSelectedPost({ ...selectedPost, ...updatedPost });
  };

  // Function to handle toggling 'like' on a post
  const toggleLike = async () => {
    // If user not logged in, show warning and exit
    if (!user?.email) {
      setLocalError("Login Required", "Please log in to like.", "warning");
      return;
    }

    // Get current liked and disliked arrays from the post
    const liked = selectedPost.liked || [];
    const disliked = selectedPost.disliked || [];

    // Check if the user already liked or disliked this post
    const alreadyLiked = liked.includes(user.email);
    const alreadyDisliked = disliked.includes(user.email);

    // Update liked list: remove if already liked, add otherwise
    const newLiked = alreadyLiked
      ? liked.filter((e) => e !== user.email)
      : [...liked, user.email];

    // Update disliked list: remove if user had disliked before
    const newDisliked = alreadyDisliked
      ? disliked.filter((e) => e !== user.email)
      : disliked;

    // Optimistically update the post state in UI
    updatePostLikes({ liked: newLiked, disliked: newDisliked });

    try {
      if (alreadyLiked) {
        // If user already liked, send request to remove like
        await axiosPublic.patch(
          `/CommunityPosts/Post/Like/${selectedPost._id}`,
          { email: user.email }
        );
      } else {
        if (alreadyDisliked) {
          // If user had previously disliked, remove dislike first
          await axiosPublic.patch(
            `/CommunityPosts/Post/Dislike/${selectedPost._id}`,
            { email: user.email }
          );
        }

        // Then add the like
        await axiosPublic.patch(
          `/CommunityPosts/Post/Like/${selectedPost._id}`,
          { email: user.email }
        );
      }

      // Refetch all posts to ensure fresh server data
      CommunityPostsRefetch();
    } catch (err) {
      // If error occurs, show appropriate error message
      setLocalError("Error", "Failed to update like.", "error", err);
    }
  };

  // Function to handle toggling 'dislike' on a post
  const toggleDislike = async () => {
    // If user not logged in, show warning and exit
    if (!user?.email) {
      setLocalError("Login Required", "Please log in to like.", "warning");
      return;
    }

    // Get current liked and disliked arrays from the post
    const liked = selectedPost.liked || [];
    const disliked = selectedPost.disliked || [];

    // Check if the user already liked or disliked this post
    const alreadyLiked = liked.includes(user.email);
    const alreadyDisliked = disliked.includes(user.email);

    // Update disliked list: remove if already disliked, add otherwise
    const newDisliked = alreadyDisliked
      ? disliked.filter((e) => e !== user.email)
      : [...disliked, user.email];

    // Update liked list: remove like if it exists
    const newLiked = alreadyLiked
      ? liked.filter((e) => e !== user.email)
      : liked;

    // Optimistically update the post state in UI
    updatePostLikes({ liked: newLiked, disliked: newDisliked });

    try {
      if (alreadyDisliked) {
        // If user already disliked, send request to remove dislike
        await axiosPublic.patch(
          `/CommunityPosts/Post/Dislike/${selectedPost._id}`,
          { email: user.email }
        );
      } else {
        if (alreadyLiked) {
          // If user had liked before, remove like first
          await axiosPublic.patch(
            `/CommunityPosts/Post/Like/${selectedPost._id}`,
            { email: user.email }
          );
        }

        // Then add the dislike
        await axiosPublic.patch(
          `/CommunityPosts/Post/Dislike/${selectedPost._id}`,
          { email: user.email }
        );
      }

      // Refetch all posts to sync UI with latest server data
      CommunityPostsRefetch();
    } catch (err) {
      // If error occurs, show appropriate error message
      setLocalError("Error", "Failed to update like.", "error", err);
    }
  };

  // Function to add a new comment to the selected post
  const handleAddComment = async () => {
    // If user is not logged in, show alert and exit
    if (!user) {
      setLocalError(`Please log In to Comment`);
    }

    // Prevent adding empty or whitespace-only comments
    if (!newComment.trim()) return;

    // Prepare the payload
    const commentPayload = {
      user: data?.fullName || data?.name || "Anonymous",
      email: data?.email,
      userImg:
        data?.profileImage ||
        data?.imageUrl ||
        "https://via.placeholder.com/48",
      role: role || "Member",
      content: newComment,
      time: new Date().toISOString(),
    };

    // Optimistically update UI
    const updatedComments = [...(selectedPost.comments || []), commentPayload];
    updatePostLikes({ comments: updatedComments });

    try {
      // Send to backend
      await axiosPublic.post(
        `/CommunityPosts/Post/Comment/${selectedPost._id}`,
        commentPayload
      );

      setNewComment("");
      CommunityPostsRefetch();
      setShowCommentBox(false);
    } catch (err) {
      console.log(err);
      setLocalError(`Failed to add comment.: ${err}`);
    }
  };

  // Function to toggle the visibility of the comment input box
  const toggleCommentBox = () => {
    // If user is not logged in, show an error and exit
    if (!user) {
      setLocalError("You must be logged in to comment.");
      return;
    }

    // Check if the current user has already commented
    const alreadyCommented = (selectedPost?.comments || []).some(
      (comment) => comment.email === user?.email
    );

    // If user already commented, show an error and exit
    if (alreadyCommented) {
      setLocalError("You've already commented on this post.");
      return;
    }

    // Toggle comment box visibility with animation
    if (showCommentBox) {
      setAnimateClass("comment-box-exit");
      setTimeout(() => {
        setShowCommentBox(false);
      }, 400);
    } else {
      setShowCommentBox(true);
      setAnimateClass("comment-box-enter");
    }
  };

  // Function to delete the selected post from the community
  const handleDeletePost = async () => {
    try {
      setDeleting(true);
      setLocalError(null);

      // Send DELETE request to backend API to delete the post by ID
      const res = await axiosPublic.delete(
        `/CommunityPosts/${selectedPost._id}`
      );

      // Check response message for success confirmation
      if (res.data?.message === "Comment deleted successfully") {
        setLocalError("Comment deleted successfully.");

        document.getElementById("Post_Details_Modal").close();
        setDeleting(true);
      } else {
        // Show error message if deletion was unsuccessful or message missing
        setLocalError(res.data?.message || "Could not delete comment.");
      }
    } catch (error) {
      console.error(error);
      setLocalError("Failed to delete comment.");
    } finally {
      setDeleting(false);
      CommunityPostsRefetch();
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  return (
    <div className="modal-box min-w-3xl p-0 bg-gradient-to-b from-white to-gray-200 text-black">
      {/* Close Modal Button */}
      <button
        onClick={() => {
          setLocalError("");
          setSelectedPost("");
          document.getElementById("Post_Details_Modal")?.close();
        }}
        className="absolute top-2 right-2 text-white bg-red-400 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-50 cursor-pointer"
      >
        <FaTimes className="text-sm" />
      </button>

      {/* Delete Button - Only visible to post author */}
      {user?.email === selectedPost?.authorEmail && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-red-500 bg-red-200 hover:bg-red-300 p-2 rounded-full border border-red-500 mt-1 cursor-pointer absolute top-1 right-14"
          title="Delete Post"
        >
          <FaRegTrashAlt />
        </button>
      )}

      {/* Display Local Error */}
      {localError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative m-4">
          <strong className="font-bold">Error:</strong>{" "}
          <span>{localError}</span>
        </div>
      )}

      {/* Post Header: Author Info and Post Date */}
      <div className="flex items-center justify-between p-6 border-b">
        {/* Post information */}
        <div className="flex items-center gap-4">
          {/* Author Avatar */}
          <img
            src={authorImage}
            alt={selectedPost?.authorName}
            className="w-16 h-16 rounded-full"
          />

          {/* Author Info */}
          <div>
            {/* Author Name */}
            <h4 className="text-lg font-semibold text-gray-800">
              {selectedPost?.authorName}
            </h4>

            {/* Author Role */}
            <p className="text-sm text-gray-500">{selectedPost?.authorRole}</p>
          </div>
        </div>

        {/* Posting Time */}
        <span className="text-sm text-gray-400">
          {formatDate(selectedPost?.createdAt)}
        </span>
      </div>

      {/* Delete Confirmation Prompt */}
      {showDeleteConfirm && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative m-4 flex items-center justify-between">
          {/* Message */}
          <div>
            <strong className="font-bold">Are you sure?</strong>{" "}
            <span>This action will permanently delete the post.</span>
          </div>

          {/* Confirm/Cancel Buttons */}
          <div className="flex gap-2">
            {/* Confirm Button */}
            <CommonButton
              clickEvent={handleDeletePost}
              text={deleting ? "Deleting..." : "Yes"}
              isLoading={deleting}
              bgColor="DarkRed"
              width="[100px]"
              py="py-1"
              textColor="text-white"
              borderRadius="rounded"
              cursorStyle="cursor-pointer"
            />

            {/* Cancel Button */}
            <CommonButton
              clickEvent={() => setShowDeleteConfirm(false)}
              text="Cancel"
              bgColor="gray"
              width="[100px]"
              py="py-1"
              textColor="text-white"
              borderRadius="rounded"
              cursorStyle="cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Main Post Content */}
      <div className="p-6 flex-1">
        {/* Post Title */}
        <h5 className="text-2xl font-bold text-gray-900 mb-3">
          {selectedPost?.postTitle}
        </h5>

        {/* Post Content */}
        <p className="text-gray-700 leading-relaxed mb-4">
          {selectedPost?.postContent}
        </p>

        {/* Display Post Tags */}
        {selectedPost?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedPost?.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons: Add Comment, Like, Dislike */}
        <div className="flex items-center justify-between">
          {/* Comment Button */}
          <CommonButton
            text={showCommentBox ? "Hide Comment Box" : "Add Comment"}
            clickEvent={() => {
              if (!user?.email) {
                setLocalError("Please log in to Comment.");
              }
              toggleCommentBox();
            }}
            bgColor="blue"
            textColor="text-white"
            py="py-2"
            width="[200px]"
            iconPosition="before"
          />

          {/* Like/Dislike Buttons */}
          <div className="flex items-center justify-end gap-6">
            {/* Like Button */}
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 border p-3 rounded-full transition cursor-pointer ${
                selectedPost?.liked?.includes(user?.email)
                  ? "text-green-600 border-green-600"
                  : "text-gray-600 border-gray-400 hover:text-green-600 hover:border-green-600"
              }`}
            >
              <FaThumbsUp className="text-lg" />
            </button>

            {/* Like Count */}
            <span className="font-medium text-black">
              {selectedPost?.liked?.length || 0}
            </span>

            {/* Dislike Button */}
            <button
              onClick={toggleDislike}
              className={`flex items-center gap-2 border p-3 rounded-full transition cursor-pointer ${
                selectedPost?.disliked?.includes(user?.email)
                  ? "text-red-600 border-red-500"
                  : "text-gray-600 border-gray-400 hover:text-red-600 hover:border-red-500"
              }`}
            >
              <FaThumbsDown className="text-lg" />
            </button>

            {/* Dislike Count */}
            <span className="font-medium text-black">
              {selectedPost?.disliked?.length || 0}
            </span>
          </div>
        </div>

        {/* Comment Input Box */}
        {showCommentBox && (
          <div className={`pt-4 ${animateClass}`}>
            {/* Text input */}
            <textarea
              rows="3"
              placeholder="Write your comment..."
              className="w-full p-3 bg-white border border-gray-300 rounded shadow-sm resize-none focus:outline-none focus:ring focus:ring-blue-200"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>

            {/* Input Button */}
            <div className="flex justify-end">
              <CommonButton
                clickEvent={handleAddComment}
                text="Submit"
                bgColor="green"
                px="px-16"
                py="py-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white pb-5">
        {/* Cement Header */}
        <h3 className="text-lg font-bold p-2">
          Comments:
          {/* Cement Count  */}
          <span className="font-bold ml-3">
            ( {selectedPost?.comments?.length || 0} )
          </span>
        </h3>

        {/* Render Each Comment */}
        <div className="pl-12 pr-5 space-y-3 cursor-default">
          {selectedPost?.comments?.map((comment, index) => (
            <PostDetailsComment
              key={index}
              comment={comment}
              id={selectedPost._id}
              CommunityPostsRefetch={CommunityPostsRefetch}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Prop Validation
PostDetails.propTypes = {
  selectedPost: PropTypes.shape({
    _id: PropTypes.string,
    authorName: PropTypes.string,
    authorEmail: PropTypes.string,
    authorRole: PropTypes.string,
    authorId: PropTypes.string,
    postTitle: PropTypes.string,
    postContent: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
    liked: PropTypes.arrayOf(PropTypes.string),
    disliked: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.string,
        role: PropTypes.string,
        userImg: PropTypes.string,
        time: PropTypes.string,
        content: PropTypes.string,
        liked: PropTypes.arrayOf(PropTypes.string),
        disliked: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }),
  setSelectedPost: PropTypes.func,
  CommunityPostsRefetch: PropTypes.func.isRequired,
};

export default PostDetails;
