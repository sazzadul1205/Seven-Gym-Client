import { useState } from "react";

import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineAddComment } from "react-icons/md";

import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Utility function to format timestamps into "time ago" format
const timeAgo = (timestamp) => {
  const now = new Date();
  const timeDiff = now - new Date(timestamp);
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
};

const ViewDetails = ({ thread, Close, UsersData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Loading States
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // States
  const [message, setMessage] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showAllComments] = useState(false);
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);

  // Prevent rendering if thread is not available
  if (!thread) return null;

  // Check if user is logged in
  const isLoggedIn = UsersData && UsersData.email;

  // Check if user has already commented
  const hasCommented = thread?.comments?.some(
    (comment) => comment?.email === UsersData?.email
  );

  // Handle Like button click with loading state
  const handleLikeClick = async () => {
    if (!isLoggedIn) return; // Prevent action if not logged in
    if (likeLoading) return; // Prevent multiple clicks
    setLikeLoading(true);
    try {
      await axiosPublic.patch(`/Forums/${thread._id}/like`, {
        email: UsersData.email,
      });
      setTimeout(() => {
        refetch();
        setLikeLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to update like:", error);
      setLikeLoading(false);
    }
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!isLoggedIn || !newComment.trim()) return;

    const commentData = {
      name: UsersData.fullName || "Anonymous",
      email: UsersData.email,
      comment: newComment,
      commentedAt: new Date(),
    };

    try {
      setLoading(true);
      await axiosPublic.post(`/Forums/${thread._id}/comment`, commentData);
      setNewComment("");
      setMessage({ type: "success", text: "Comment submitted successfully!" });

      setTimeout(() => {
        setMessage(null);
        setIsCommentBoxVisible(false);
        refetch();
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to add comment. Try again!",
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-3xl sm:max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      {/* Show login prompt if user is not logged in */}
      {!isLoggedIn && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-center font-semibold mb-4">
          You must log in to like and comment on this thread.
        </div>
      )}

      {/* Modal Header with Close Button */}
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-xl text-gray-800 text-center">
          {thread.title}
        </h4>
        <ImCross
          onClick={Close}
          className="text-black hover:text-red-500 text-xl cursor-pointer"
        />
      </div>

      {/* Details */}
      <div className="pt-5 space-y-3">
        {/* Thread Details */}
        <p className="text-gray-600 italic leading-relaxed">
          {thread.description}
        </p>

        {/* Thread Metadata */}
        <div className="flex justify-between items-center bg-gray-200 flex-wrap px-2 py-3">
          <div className="text-black font-semibold">
            <a
              href={thread.author?.profileUrl}
              className="text-blue-500 hover:underline"
            >
              {thread.author?.name}
            </a>
            <p>{thread.category}</p>
          </div>
          <p className="text-gray-500 text-sm">{timeAgo(thread.createdAt)}</p>
        </div>

        {/* Comment & Like Section */}
        <div className="flex justify-between items-center flex-wrap">
          {/* Comments Part */}
          <div className="flex items-center gap-2 text-black">
            <h3 className="font-semibold text-xl">Comments:</h3>
            <MdOutlineAddComment
              className={`text-2xl ${
                isLoggedIn
                  ? "hover:text-yellow-500 cursor-pointer"
                  : "opacity-50"
              }`}
              onClick={() =>
                isLoggedIn && setIsCommentBoxVisible((prev) => !prev)
              }
            />
          </div>

          {/* Like Button */}
          <div
            className={`flex items-center bg-gray-100 hover:bg-gray-300 gap-4 px-4 py-2 rounded-3xl cursor-pointer ${
              likeLoading || !isLoggedIn ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={handleLikeClick}
          >
            {likeLoading ? (
              <span className="text-gray-600 text-md">Loading...</span>
            ) : isLoggedIn && thread.likedBy?.includes(UsersData.email) ? (
              <BiSolidLike className="text-blue-600 text-2xl" />
            ) : (
              <BiLike className="text-gray-600 text-2xl" />
            )}
            <p className="text-black">||</p>
            <p className="text-gray-700 font-medium">
              {thread?.likes || 0} {thread?.likes === 1 ? "Like" : "Likes"}
            </p>
          </div>
        </div>

        {/* Comment Input Box */}
        {isCommentBoxVisible && isLoggedIn && (
          <div className="border border-gray-300 p-2 rounded-xl mt-4">
            {message && (
              <p
                className={`text-sm ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                } mb-2`}
              >
                {message.text}
              </p>
            )}
            <textarea
              className="textarea w-full text-black bg-white border border-black rounded-2xl"
              placeholder={
                hasCommented ? "Already commented" : "Add a comment..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={hasCommented}
            ></textarea>
            <div className="flex justify-between items-center pt-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg px-10 py-2"
                onClick={() => setIsCommentBoxVisible(false)}
                disabled={loading}
              >
                Close
              </button>
              <button
                className={`font-semibold rounded-lg px-10 py-2 ${
                  hasCommented
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-700 text-white"
                }`}
                onClick={handleAddComment}
                disabled={loading || hasCommented}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="mb-6 border-2 border-gray-300 rounded-2xl p-2 mt-5">
        {thread.comments?.length > 0 ? (
          <>
            <ul className="space-y-4 mt-4">
              {(showAllComments
                ? thread.comments
                : thread.comments.slice(0, 5)
              ).map((comment, index) => (
                <li
                  key={index}
                  className="border-b border-gray-200 pb-3 flex-col"
                >
                  <p className="text-gray-800">
                    <strong>{comment.name}:</strong>
                  </p>
                  <div className="flex justify-between text-black">
                    <p className="pt-1">{comment.comment}</p>
                    <p className="text-sm text-gray-500">
                      {timeAgo(comment.commentedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-700">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

ViewDetails.propTypes = {
  thread: PropTypes.object.isRequired,
  Close: PropTypes.func.isRequired,
  UsersData: PropTypes.object,
  refetch: PropTypes.func.isRequired,
};

export default ViewDetails;
