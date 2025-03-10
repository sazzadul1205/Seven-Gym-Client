import PropTypes from "prop-types";
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

const ViewDetailsThreadsComments = ({
  toggleCommentBox,
  handleLikeClick,
  isLiked,
  likes,
  isCommentBoxVisible,
  newComment,
  setNewComment,
  handleAddComment,
  comments,
  showAllComments,
  toggleShowAllComments,
}) => {
  return (
    <div>
      {/* Likes and Add Comment Button */}
      <div className="flex justify-between items-center flex-wrap">
        {/* Comments Part */}
        <div className="flex text-black items-center bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 gap-4 px-4 py-2 rounded-3xl">
          <h3 className="font-semibold text-xl">Comments:</h3>
          <MdOutlineAddComment
            className="text-2xl hover:text-yellow-500 cursor-pointer"
            onClick={toggleCommentBox}
          />
        </div>

        {/* Likes Part */}
        <div
          className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 gap-4 px-4 py-2 rounded-3xl"
          onClick={handleLikeClick}
        >
          {isLiked ? (
            <BiSolidLike className="text-blue-600 text-2xl" />
          ) : (
            <BiLike className="text-gray-600 text-2xl" />
          )}
          <p className="text-black">||</p>
          <p className="text-gray-700 font-medium">
            {likes} {likes === 1 ? "Like" : "Likes"}
          </p>
        </div>
      </div>

      {/* Comment Box */}
      {isCommentBoxVisible && (
        <div className="border border-gray-300 p-2 rounded-xl mt-4">
          <textarea
            className="textarea w-full text-black bg-white border border-black rounded-2xl"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>

          <div className="flex justify-between items-center pt-2">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg px-10 py-2"
              onClick={toggleCommentBox}
            >
              Close
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg px-10 py-2"
              onClick={handleAddComment}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="mb-6 border border-gray-300 px-2 mt-5">
        {comments.length > 0 ? (
          <>
            <ul className="space-y-4 mt-4">
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
                onClick={toggleShowAllComments}
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
  );
};

// Define PropTypes
ViewDetailsThreadsComments.propTypes = {
  toggleCommentBox: PropTypes.func.isRequired,
  handleLikeClick: PropTypes.func.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likes: PropTypes.number.isRequired,
  isCommentBoxVisible: PropTypes.bool.isRequired,
  newComment: PropTypes.string.isRequired,
  setNewComment: PropTypes.func.isRequired,
  handleAddComment: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
      commentedAt: PropTypes.string.isRequired, // Assuming timestamp is stored as a string
    })
  ).isRequired,
  showAllComments: PropTypes.bool.isRequired,
  toggleShowAllComments: PropTypes.func.isRequired,
};

export default ViewDetailsThreadsComments;
