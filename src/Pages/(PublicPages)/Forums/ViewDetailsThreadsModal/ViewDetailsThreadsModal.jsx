import PropTypes from "prop-types";
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineAddComment } from "react-icons/md";

// Utility function to calculate time ago
const timeAgo = (timestamp) => {
  const now = new Date();
  const timeDiff = now - new Date(timestamp); // Difference in milliseconds
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
};

const ViewDetailsThreadsModal = ({ thread, onClose }) => {
  if (!thread) return null; // Handle undefined thread case

  // State for like functionality
  const [likes, setLikes] = useState(thread.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  // State for comments
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(thread.comments || []);
  const [showAllComments, setShowAllComments] = useState(false);

  // Handle like button click
  const handleLikeClick = () => {
    setLikes((prev) => (isLiked ? Math.max(prev - 1, 0) : prev + 1));
    setIsLiked((prev) => !prev);
  };

  // Toggle comment input box visibility
  const toggleCommentBox = () => {
    setIsCommentBoxVisible((prev) => !prev);
  };

  // Handle adding a new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const commentToAdd = {
      name: "You", // Replace with actual logged-in user
      comment: newComment,
      commentedAt: new Date(),
    };

    setComments((prevComments) => [commentToAdd, ...prevComments]);
    setNewComment(""); // Clear input
    setIsCommentBoxVisible(false); // Hide comment box
  };

  return (
    <div className="modal-box max-w-3xl sm:max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      {/* Close Button */}
      <div className="flex justify-between items-center text-xl">
        {/* Title */}
        <h2 className="font-bold text-black">{thread.title}</h2>
        <ImCross
          onClick={() => {
            document.getElementById("View_Details_Threads_Modal").close();
          }}
          className="text-black hover:text-gray-700 cursor-pointer"
        />
      </div>

      <div className="pt-5">
        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed italic">
          {thread.description}
        </p>

        {/* Author & Time */}
        <div className="flex justify-between items-center flex-wrap text-sm text-gray-700 bg-gray-200 px-2 py-1">
          <div>
            <p>Posted By</p>
            {thread.author?.name && (
              <a
                href={thread.author?.profileUrl}
                className="text-blue-500 hover:underline"
              >
                {thread.author?.name}
              </a>
            )}
          </div>
          <p className="text-gray-500">{timeAgo(thread.createdAt)}</p>
        </div>

        {/* Tags */}
        {thread.tags?.length > 0 && (
          <div className="mt-4 flex items-center flex-wrap gap-2">
            <h3 className="font-semibold text-gray-800">Tags:</h3>
            <div className="flex flex-wrap gap-2 ml-4">
              {thread.tags.map((tag, index) => {
                const randomColor = `hsl(${Math.random() * 360}, 70%, 75%)`; // Generates a random pastel color
                return (
                  <span
                    key={index}
                    className="px-3 py-2 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: randomColor, color: "#333" }} // Text color adjusted for readability
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Likes and Comments */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">Comments:</h3>
            <MdOutlineAddComment
              className="text-2xl cursor-pointer text-black hover:text-yellow-500"
              onClick={toggleCommentBox}
            />
          </div>

          {/* Like Button */}
          <div
            className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition w-[180px]"
            onClick={handleLikeClick}
          >
            {isLiked ? (
              <BiSolidLike className="text-blue-600 text-2xl" />
            ) : (
              <BiLike className="text-gray-600 text-2xl" />
            )}
            <p className="text-gray-700 font-medium">
              {likes} {likes === 1 ? "Like" : "Likes"}
            </p>
          </div>
        </div>

        {/* Comment Box */}
        {isCommentBoxVisible && (
          <div className="mt-4">
            <textarea
              className="textarea textarea-accent w-full px-5 py-4 mb-2"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-10 py-2 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg"
                onClick={handleAddComment}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="mt-6">
          {comments.length > 0 ? (
            <>
              <ul className="space-y-4">
                {(showAllComments ? comments : comments.slice(0, 5)).map(
                  (comment, index) => (
                    <li key={index} className="border-b border-gray-200 pb-3">
                      <p className="text-gray-800">
                        <strong>{comment.name}:</strong> {comment.comment}
                      </p>
                      <p className="text-sm text-gray-500">
                        {timeAgo(comment.commentedAt)}
                      </p>
                    </li>
                  )
                )}
              </ul>
              {comments.length > 5 && (
                <button
                  className="mt-4 text-blue-600 hover:underline"
                  onClick={() => setShowAllComments((prev) => !prev)}
                >
                  {showAllComments ? "Show Less" : "Show More"}
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-700">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// PropTypes for validation
ViewDetailsThreadsModal.propTypes = {
  thread: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string,
      profileUrl: PropTypes.string,
    }),
    createdAt: PropTypes.string.isRequired,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    likes: PropTypes.number,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        comment: PropTypes.string.isRequired,
        commentedAt: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewDetailsThreadsModal;
