import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineAddComment } from "react-icons/md";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Utility function to calculate "time ago"
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

const ViewDetailsThreadsModal = ({ thread, onClose }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [likes, setLikes] = useState(thread.likes);
  const [isLiked, setIsLiked] = useState(
    Array.isArray(thread.likedBy) && thread.likedBy.includes(user.email)
  );
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState(thread?.comments);
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);

  useEffect(() => {
    setIsLiked(
      Array.isArray(thread?.likedBy) && thread?.likedBy.includes(user?.email)
    );
  }, [thread?.likedBy, user?.email]);

  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        // Unlike: remove email from likedBy and decrease likes
        const response = await axiosPublic.patch(
          `/Forums/${thread._id}/unlike`,
          { email: user.email }
        );
        setLikes(response.data.likes);
        setIsLiked(false);
      } else {
        // Like: add email to likedBy and increase likes
        const response = await axiosPublic.patch(`/Forums/${thread._id}/like`, {
          email: user.email,
        });
        setLikes(response.data.likes);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const toggleCommentBox = () => setIsCommentBoxVisible((prev) => !prev);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const commentToAdd = {
      name: "You", // Replace with actual logged-in user if available
      comment: newComment,
      commentedAt: new Date().toISOString(),
    };

    setComments((prev) => [commentToAdd, ...prev]);
    setNewComment("");
    setIsCommentBoxVisible(false);
  };

  return (
    <div className="modal-box max-w-3xl sm:max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      {/* Title and Close */}
      <div className="flex justify-between items-center text-xl">
        <h2 className="font-bold text-black">{thread?.title}</h2>
        <ImCross
          onClick={onClose}
          className="text-black hover:text-gray-700 cursor-pointer"
        />
      </div>

      <div className="pt-5">
        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed italic">
          {thread?.description}
        </p>

        {/* Author & Time */}
        <div className="flex justify-between items-center flex-wrap text-sm text-gray-700 bg-gray-200 px-2 py-1">
          <div>
            <p>Posted By</p>
            {thread?.author?.name && (
              <a
                href={thread?.author.profileUrl}
                className="text-blue-500 hover:underline"
              >
                {thread?.author.name}
              </a>
            )}
          </div>
          <p className="text-gray-500">{timeAgo(thread?.createdAt)}</p>
        </div>

        {/* Tags */}
        {thread?.tags.length > 0 && (
          <div className="mt-4 flex items-center flex-wrap gap-2">
            <h3 className="font-semibold text-gray-800">Tags:</h3>
            <div className="flex flex-wrap gap-2 ml-4">
              {thread?.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-2 rounded-full text-xs font-semibold bg-gray-200 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Likes and Comments */}
        <div className="mt-6 flex justify-between items-center">
          {/* Comments Part */}
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">Comments:</h3>
            <MdOutlineAddComment
              className="text-2xl cursor-pointer text-black hover:text-yellow-500"
              onClick={toggleCommentBox}
            />
          </div>

          {/* Likes Part */}
          <div
            className="flex items-center bg-gray-100 hover:bg-gray-300 rounded-lg transition cursor-pointer gap-3 px-4 py-2"
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

        {/* Comment Input */}
        {isCommentBoxVisible && (
          <div className="mt-4">
            <textarea
              className="w-full textarea bg-white border border-gray-500 text-black rounded-xl"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-between items-center pt-3">
              <button
                className="px-10 py-2 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-lg"
                onClick={toggleCommentBox}
              >
                Close
              </button>
              <button
                className="px-10 py-2 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-lg"
                onClick={handleAddComment}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="mt-6">
          {comments?.length > 0 ? (
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

ViewDetailsThreadsModal.propTypes = {
  thread: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewDetailsThreadsModal;
