import PropTypes from "prop-types";
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineAddComment } from "react-icons/md";

import ViewDetailsThreadComment from "./ViewDetailsThreadComment/ViewDetailsThreadComment";

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
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(thread?.likes || 0);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);

  if (!thread) return null;

  const handleLikeClick = () => {
    setLikes((prevLikes) =>
      isLiked ? Math.max(prevLikes - 1, 0) : prevLikes + 1
    );
    setIsLiked((prev) => !prev);
  };

  const toggleCommentBox = () => {
    setIsCommentBoxVisible((prev) => !prev);
  };

  const toggleShowAllComments = () => {
    setShowAllComments((prev) => !prev);
  };

  return (
    <div className="modal-box max-w-3xl sm:max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-xl text-gray-800 text-center">
          {thread.title}
        </h4>
        <ImCross
          onClick={Close}
          className="text-black hover:text-red-500 text-xl cursor-pointer"
        />
      </div>

      <div className="pt-5 space-y-3">
        <p className="text-gray-600 italic leading-relaxed">
          {thread.description}
        </p>

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

        <div className="mb-6 flex items-center flex-wrap gap-2">
          <h3 className="font-semibold text-xl text-gray-800">Tags:</h3>
          <div className="flex flex-wrap gap-2 ml-4">
            {thread.tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap">
          <div className="flex items-center gap-2 text-black">
            <h3 className="font-semibold text-xl">Comments:</h3>
            <MdOutlineAddComment
              className="text-2xl hover:text-yellow-500 cursor-pointer"
              onClick={toggleCommentBox}
            />
          </div>

          <div
            className="flex items-center bg-gray-100 hover:bg-gray-300 gap-4 px-4 py-2 rounded-3xl cursor-pointer"
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

        {isCommentBoxVisible && (
          <ViewDetailsThreadComment
            refetch={refetch}
            threadId={thread._id}
            UsersData={UsersData}
            toggleCommentBox={toggleCommentBox}
            setIsCommentBoxVisible={setIsCommentBoxVisible}
          />
        )}

        <div className="mb-6 border-2 border-gray-300 rounded-2xl p-2">
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
              {thread.comments.length > 5 && (
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
    </div>
  );
};

ViewDetails.propTypes = {
  thread: PropTypes.shape({
    title: PropTypes.string,
    _id: PropTypes.string,
    description: PropTypes.string,
    likes: PropTypes.number,
    createdAt: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
      profileUrl: PropTypes.string,
    }),
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        comment: PropTypes.string,
        commentedAt: PropTypes.string,
      })
    ),
  }),
  Close: PropTypes.func,
  UsersData: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ViewDetails;
