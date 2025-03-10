/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */

import { useState } from "react";
import { ImCross } from "react-icons/im";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineAddComment } from "react-icons/md";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";

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

const ViewDetails = ({ thread, closeModal }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  
  if (!thread) return null; // Handle the case where thread is undefined

  // State for like functionality
  const [likes, setLikes] = useState(thread.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  // State for toggling the comment section
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(thread.comments || []);
  const [showAllComments, setShowAllComments] = useState(false);

  // Handle like button click
  const handleLikeClick = () => {
    if (isLiked) {
      // Unlike: decrease the count
      setLikes((prevLikes) => Math.max(prevLikes - 1, 0));
    } else {
      // Like: increase the count
      setLikes((prevLikes) => prevLikes + 1);
    }
    setIsLiked((prev) => !prev); // Toggle like state
  };

  // Handle add comment button click
  const toggleCommentBox = () => {
    setIsCommentBoxVisible((prev) => !prev); // Toggle the comment box visibility
  };

  // Handle submit comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      const commentToAdd = {
        name: "You", // This can be replaced with the logged-in user's name
        comment: newComment,
        commentedAt: new Date(),
      };
      setComments((prevComments) => [commentToAdd, ...prevComments]);
      setNewComment(""); // Clear the text area
      setIsCommentBoxVisible(false); // Optionally hide the comment box after adding
    }
  };

  // Toggle "Show More" comments
  const toggleShowAllComments = () => {
    setShowAllComments((prev) => !prev);
  };

  return (
    <div className="modal-box max-w-3xl sm:max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      {/* Top section */}
      <div className="flex justify-between items-center">
        {/* Title */}
        <h4 className="font-bold text-xl text-gray-800 text-center">
          {thread.title}
        </h4>
        {/* Close Btn */}
        <ImCross
          onClick={closeModal}
          className="text-black hover:text-red-500 text-xl cursor-pointer"
        />
      </div>

      <div className="pt-5 space-y-3">
        {/* Description */}
        <p className="text-gray-600 italic leading-relaxed">
          {thread.description}
        </p>

        {/* Author and Date */}
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

        {/* Tags */}
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

        {/* Likes and Add Comment Button */}
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex items-center gap-2 text-black">
            <h3 className="font-semibold text-xl">Comments:</h3>
            <MdOutlineAddComment
              className="text-2xl hover:text-yellow-500 cursor-pointer"
              onClick={toggleCommentBox}
            />
          </div>

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
        <div
          className={`transition-all duration-300 ease-in-out border border-gray-300 p-2 rounded-xl ${
            isCommentBoxVisible
              ? "max-h-[300px] opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          } mt-4`}
        >
          {/* Input */}
          <textarea
            className="textarea w-full text-black bg-white border border-black rounded-2xl"
            placeholder="Bio"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-2">
            <button
              className="bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-700 text-white font-semibold rounded-lg px-10 py-2 "
              onClick={toggleCommentBox}
            >
              close
            </button>
            <button
              className="bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-700 text-white font-semibold rounded-lg px-10 py-2 "
              onClick={handleAddComment}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-6">
          {comments.length > 0 ? (
            <>
              <ul className="space-y-4 mt-4">
                {(showAllComments ? comments : comments.slice(0, 5)).map(
                  (comment, index) => (
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
    </div>
  );
};

export default ViewDetails;
