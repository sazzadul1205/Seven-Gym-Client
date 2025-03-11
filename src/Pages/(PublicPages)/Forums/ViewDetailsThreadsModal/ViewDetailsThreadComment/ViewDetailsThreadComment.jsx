import { useState } from "react";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import PropTypes from "prop-types";

const ViewDetailsThreadComment = ({
  threadId,
  UsersData,
  refetch,
  toggleCommentBox,
  setIsCommentBoxVisible,
}) => {
  const axiosPublic = useAxiosPublic();
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle submit comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      name: UsersData.fullName || "Anonymous",
      email: UsersData.email,
      comment: newComment,
      commentedAt: new Date(),
    };

    try {
      setLoading(true);
      const response = await axiosPublic.post(
        `/Forums/${threadId}/comment`,
        commentData
      );
      refetch();

      if (response.status === 200) {
        setNewComment("");
        setIsCommentBoxVisible(false);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 p-2 rounded-xl mt-4">
      <textarea
        className="textarea w-full text-black bg-white border border-black rounded-2xl"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      ></textarea>
      <div className="flex justify-between items-center pt-2">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg px-6 py-2"
          onClick={toggleCommentBox}
          disabled={loading}
        >
          Close
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg px-6 py-2"
          onClick={handleAddComment}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

ViewDetailsThreadComment.propTypes = {
  UsersData: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  threadId: PropTypes.string.isRequired,
  setComments: PropTypes.func,
  refetch: PropTypes.func,
  toggleCommentBox: PropTypes.func,
  setIsCommentBoxVisible: PropTypes.func,
};

export default ViewDetailsThreadComment;
