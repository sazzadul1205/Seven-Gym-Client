import { useState } from "react";

// import Packages
import PropTypes from "prop-types";

// import Icons
import { FaRegTrashAlt } from "react-icons/fa";

// import Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// import Shared
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

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

const PostDetailsComment = ({
  id,
  comment,
  refetch,
  CommunityPostsRefetch,
}) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Local Component State Management
  const [message, setMessage] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [messageType, setMessageType] = useState(null);

  // Handle comment deletion
  const handleDelete = async () => {
    try {
      setDeleting(true);
      setMessage(null);

      // API call to delete the comment
      const res = await axiosPublic.delete(
        `/CommunityPosts/Post/Comments/${id}`,
        {
          data: { email: user.email },
        }
      );

      // Handle success response
      if (res.data?.message === "Comment deleted successfully") {
        setMessage("Comment deleted successfully.");

        // Hide the comment after deletion
        setMessageType("success");
        setIsDeleted(true);

        // Optional comment list refetch
        if (refetch) refetch();
      } else {
        setMessage(res.data?.message || "Could not delete comment.");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete comment.");
      setMessageType("error");
    } finally {
      setDeleting(false);
      setConfirming(false);
      CommunityPostsRefetch();
    }
  };

  // Don't render deleted comment
  if (isDeleted) return null;

  return (
    <div className="relative">
      {/* Feedback message display */}
      {message && (
        <div
          className={`mb-2 px-4 py-2 rounded text-sm font-medium ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Inline confirmation UI before deleting a comment */}
      {confirming && (
        <div className="mb-2 px-4 py-3 bg-yellow-100 text-yellow-800 rounded text-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Message */}
          <span className="flex-1">
            Are you sure you want to delete this comment?
          </span>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <CommonButton
              clickEvent={handleDelete}
              text={deleting ? "Deleting..." : "Yes"}
              isLoading={deleting}
              bgColor="DarkRed"
              width="full sm:[100px]"
              py="py-1"
              textColor="text-white"
              borderRadius="rounded"
              cursorStyle="cursor-pointer"
            />

            <CommonButton
              clickEvent={() => setConfirming(false)}
              text="Cancel"
              bgColor="gray"
              width="full sm:[100px]"
              py="py-1"
              textColor="text-white"
              borderRadius="rounded"
              cursorStyle="cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Main comment block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b">
        {/* Commenter profile section */}
        <div className="flex items-center gap-4">
          {/* Commenter Image */}
          <img
            src={comment?.userImg || "https://via.placeholder.com/48"}
            alt={comment?.user}
            className="w-12 h-12 rounded-full"
          />

          {/* Commenter Info */}
          <div>
            {/* Commenter Name */}
            <h4 className="text-lg font-semibold text-gray-800">
              {comment?.user}
            </h4>

            {/* Commenter Role */}
            <p className="text-sm text-gray-500">{comment?.role}</p>
          </div>
        </div>

        {/* Comment meta and delete button */}
        <div className="text-right flex flex-col items-end">
          {/* Commenting Time */}
          <span className="text-sm text-gray-400">
            {formatDate(comment?.time)}
          </span>

          {/* Only show delete icon if user is the commenter and not confirming yet */}
          {user && user.email === comment?.email && !confirming && (
            <button
              onClick={() => setConfirming(true)}
              className="text-red-500 bg-red-200 hover:bg-red-300 p-2 rounded-full border border-red-500 mt-1 cursor-pointer"
            >
              <FaRegTrashAlt />
            </button>
          )}
        </div>
      </div>

      {/* Comment content */}
      <p className="px-14 py-2">{comment?.content}</p>
    </div>
  );
};

// Add prop validation here
PostDetailsComment.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  comment: PropTypes.shape({
    userImg: PropTypes.string,
    user: PropTypes.string.isRequired,
    role: PropTypes.string,
    time: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    email: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func,
  CommunityPostsRefetch: PropTypes.func.isRequired,
};

export default PostDetailsComment;
