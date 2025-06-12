import { FaThumbsDown, FaThumbsUp, FaTimes } from "react-icons/fa";
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import { useState } from "react";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import CommunityAuthorAvatar from "../CommunityAuthorAvatar/CommunityAuthorAvatar";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const options = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return d.toLocaleString("en-US", options);
};

const PostDetails = ({ setSelectedPost, selectedPost }) => {
  const axiosPublic = useAxiosPublic();

  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const toggleCommentBox = () => {
    if (showCommentBox) {
      setShowCommentBox(false);
      setTimeout(() => setShouldRender(false), 500);
    } else {
      setShouldRender(true);
      setTimeout(() => setShowCommentBox(true), 10);
    }
  };

  const { data: profileData } = useQuery({
    queryKey: [
      "PostAuthor",
      selectedPost?.authorId || selectedPost?.authorEmail,
    ],
    queryFn: async () => {
      if (selectedPost?.authorRole === "Trainer") {
        const res = await axiosPublic.get(
          `/Trainers/BasicInfo?id=${selectedPost.authorId}`
        );
        return res.data;
      } else if (selectedPost?.authorRole === "Member") {
        const res = await axiosPublic.get(
          `/Users/BasicProfile?email=${selectedPost.authorEmail}`
        );
        return res.data;
      } else return null;
    },
    enabled: !!selectedPost,
  });

  const authorImage =
    profileData?.profileImage ||
    profileData?.imageUrl ||
    "https://via.placeholder.com/64";

  // Count likes, dislikes, and comments safely (handle undefined)
  const likeCount = selectedPost?.liked?.length ?? 0;
  const dislikeCount = selectedPost?.disliked?.length ?? 0;

  return (
    <div className="modal-box min-w-3xl p-0 bg-gradient-to-b from-white to-gray-200 text-black">
      <button
        onClick={() => {
          setSelectedPost("");
          document.getElementById("Post_Details_Modal").close();
        }}
        className="absolute top-2 right-2 text-white bg-red-400 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-50 cursor-pointer"
      >
        <FaTimes className="text-sm" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <img
            src={authorImage}
            alt={selectedPost?.authorName}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              {selectedPost?.authorName}
            </h4>
            <p className="text-sm text-gray-500">{selectedPost?.authorRole}</p>
          </div>
        </div>
        <span className="text-sm text-gray-400">
          {formatDate(selectedPost?.createdAt)}
        </span>
      </div>

      {/* Post Content */}
      <div className="p-6 flex-1">
        <h5 className="text-2xl font-bold text-gray-900 mb-3">
          {selectedPost?.postTitle}
        </h5>
        <p className="text-gray-700 leading-relaxed mb-4">
          {selectedPost?.postContent}
        </p>

        {/* Post action buttons (Like, Dislike, Comment) */}
        <div className="flex items-center justify-end gap-6">
          {/* Like Button + Count */}
          <button
            className="flex items-center gap-2 border border-gray-400 p-3 rounded-full text-gray-600 hover:text-green-600 hover:border-green-600 transition-colors cursor-pointer"
            title="Like"
            aria-label="Like"
            // onClick={handleLike}
          >
            <FaThumbsUp className="text-lg" />
          </button>
          <span className="font-medium text-black">{likeCount}</span>

          {/* Dislike Button + Count */}
          <button
            className="flex items-center gap-2 border border-gray-400 p-3 rounded-full text-gray-600 hover:text-red-600 hover:border-red-500 transition-colors cursor-pointer"
            title="Dislike"
            aria-label="Dislike"
            // onClick={handleDislike}
          >
            <FaThumbsDown className="text-lg" />
          </button>
          <span className="font-medium text-black">{dislikeCount}</span>
        </div>

        {/* Comment Input */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showCommentBox ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {shouldRender && (
            <div className="pt-4">
              <textarea
                rows="3"
                placeholder="Write your comment..."
                className="w-full p-3 bg-white border border-gray-300 rounded shadow-sm resize-none focus:outline-none focus:ring focus:ring-blue-200"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>

              <CommonButton
                // clickEvent={handleAddComment}
                text="Submit"
                bgColor="green"
                className="mt-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white pb-5">
        <h3 className="text-lg font-bold p-2">
          Comments :{" "}
          <span className="font-thin">
            ( {selectedPost?.comments?.length ?? 0} )
          </span>
        </h3>

        <div className="pl-12 pr-5 space-y-3 cursor-default">
          {selectedPost?.comments?.map((comment, index) => (
            <div key={index}>
              <div className="flex justify-between border-b py-2">
                <div className="flex items-center gap-4">
                  <img
                    src={comment?.userImg || "https://via.placeholder.com/48"}
                    alt={comment?.user}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {comment?.user}
                    </h4>
                    <p className="text-sm text-gray-500">{comment?.role}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {formatDate(comment?.time)}
                </span>
              </div>
              <p className="px-14 py-2">{comment?.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
