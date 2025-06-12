/* eslint-disable react/prop-types */
import { FaThumbsDown, FaThumbsUp, FaTimes } from "react-icons/fa";
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import { useState } from "react";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import "./PostDetails.css";
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";
import { useUserOrTrainerData } from "./useUserOrTrainerData";

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

  const [localError, setLocalError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [animateClass, setAnimateClass] = useState("");

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
      }
      return null;
    },
    enabled: !!selectedPost,
  });

  const authorImage =
    profileData?.profileImage ||
    profileData?.imageUrl ||
    "https://via.placeholder.com/64";

  const { data, isLoading, error, role } = useUserOrTrainerData(user?.email);

  const updatePostLikes = (updatedPost) => {
    setSelectedPost({ ...selectedPost, ...updatedPost });
  };

  const toggleLike = async () => {
    if (!user?.email) {
      setLocalError("Login Required", "Please log in to like.", "warning");
    }

    const liked = selectedPost.liked || [];
    const disliked = selectedPost.disliked || [];

    const alreadyLiked = liked.includes(user.email);
    const alreadyDisliked = disliked.includes(user.email);

    const newLiked = alreadyLiked
      ? liked.filter((e) => e !== user.email)
      : [...liked, user.email];

    const newDisliked = alreadyDisliked
      ? disliked.filter((e) => e !== user.email)
      : disliked;

    updatePostLikes({ liked: newLiked, disliked: newDisliked });

    try {
      if (alreadyLiked) {
        await axiosPublic.patch(
          `/CommunityPosts/Post/Like/${selectedPost._id}`,
          {
            email: user.email,
          }
        );
      } else {
        if (alreadyDisliked) {
          await axiosPublic.patch(
            `/CommunityPosts/Post/Dislike/${selectedPost._id}`,
            {
              email: user.email,
            }
          );
        }
        await axiosPublic.patch(
          `/CommunityPosts/Post/Like/${selectedPost._id}`,
          {
            email: user.email,
          }
        );
      }
      CommunityPostsRefetch();
    } catch (err) {
      setLocalError("Error", "Failed to update like.", "error", err);
    }
  };

  const toggleDislike = async () => {
    if (!user?.email) {
      setLocalError("Login Required", "Please log in to like.", "warning");
    }

    const liked = selectedPost.liked || [];
    const disliked = selectedPost.disliked || [];

    const alreadyLiked = liked.includes(user.email);
    const alreadyDisliked = disliked.includes(user.email);

    const newDisliked = alreadyDisliked
      ? disliked.filter((e) => e !== user.email)
      : [...disliked, user.email];

    const newLiked = alreadyLiked
      ? liked.filter((e) => e !== user.email)
      : liked;

    updatePostLikes({ liked: newLiked, disliked: newDisliked });

    try {
      if (alreadyDisliked) {
        await axiosPublic.patch(
          `/CommunityPosts/Post/Dislike/${selectedPost._id}`,
          {
            email: user.email,
          }
        );
      } else {
        if (alreadyLiked) {
          await axiosPublic.patch(
            `/CommunityPosts/Post/Like/${selectedPost._id}`,
            {
              email: user.email,
            }
          );
        }
        await axiosPublic.patch(
          `/CommunityPosts/Post/Dislike/${selectedPost._id}`,
          {
            email: user.email,
          }
        );
      }
      CommunityPostsRefetch();
    } catch (err) {
      setLocalError("Error", "Failed to update like.", "error", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentPayload = {
      user: data?.fullName || data?.name || "Anonymous",
      email: data?.email || " ",
      userImg: data?.profileImage || "https://via.placeholder.com/48",
      role: role || "Member",
      content: newComment,
      time: new Date().toISOString(),
    };

    const updatedComments = [...(selectedPost.comments || []), commentPayload];
    updatePostLikes({ comments: updatedComments });

    try {
      await axiosPublic.post(
        `/CommunityPosts/Post/Comment/${selectedPost._id}`,
        commentPayload
      );
      setNewComment("");
      CommunityPostsRefetch(); // optional but recommended
    } catch (err) {
      setLocalError("Error", "Failed to add comment.", "error", err);
    }
  };

  const toggleCommentBox = () => {
    if (showCommentBox) {
      setAnimateClass("comment-box-exit");
      setTimeout(() => {
        setShowCommentBox(false);
      }, 400); // match the animation duration
    } else {
      setShowCommentBox(true);
      setAnimateClass("comment-box-enter");
    }
  };

  const likeCount = selectedPost?.liked?.length || 0;
  const dislikeCount = selectedPost?.disliked?.length || 0;
  const userLiked = selectedPost?.liked?.includes(user?.email);
  const userDisliked = selectedPost?.disliked?.includes(user?.email);

  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  console.log("Users Data :", data);
  console.log("Users Role :", role);

  return (
    <div className="modal-box min-w-3xl p-0 bg-gradient-to-b from-white to-gray-200 text-black">
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

      {localError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative m-4">
          <strong className="font-bold">Error:</strong>{" "}
          <span>{localError}</span>
        </div>
      )}

      {/* Header */}
      {/* [. . . . header Content] */}

      {/* Post Content */}
      <div className="p-6 flex-1">
        <h5 className="text-2xl font-bold text-gray-900 mb-3">
          {selectedPost?.postTitle}
        </h5>
        <p className="text-gray-700 leading-relaxed mb-4">
          {selectedPost?.postContent}
        </p>

        <div className="flex items-center justify-between">
          <CommonButton
            text={showCommentBox ? "Hide Comment Box" : "Add Comment"}
            clickEvent={() => {
              if (!user?.email) {
                setLocalError(
                  "Login Required",
                  "Please log in to Comment.",
                  "warning"
                );
              }
              toggleCommentBox();
            }}
            bgColor="blue"
            textColor="text-white"
            py="py-2"
            width="[200px]"
            iconPosition="before"
          />

          {/* Like / Dislike */}
          <div className="flex items-center justify-end gap-6">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 border p-3 rounded-full transition cursor-pointer ${
                userLiked
                  ? "text-green-600 border-green-600"
                  : "text-gray-600 border-gray-400 hover:text-green-600 hover:border-green-600"
              }`}
            >
              <FaThumbsUp className="text-lg" />
            </button>
            <span className="font-medium text-black">{likeCount}</span>

            <button
              onClick={toggleDislike}
              className={`flex items-center gap-2 border p-3 rounded-full transition cursor-pointer ${
                userDisliked
                  ? "text-red-600 border-red-500"
                  : "text-gray-600 border-gray-400 hover:text-red-600 hover:border-red-500"
              }`}
            >
              <FaThumbsDown className="text-lg" />
            </button>
            <span className="font-medium text-black">{dislikeCount}</span>
          </div>
        </div>

        {/* Comment Input */}
        {showCommentBox && (
          <div className={`pt-4 ${animateClass}`}>
            <textarea
              rows="3"
              placeholder="Write your comment..."
              className="w-full p-3 bg-white border border-gray-300 rounded shadow-sm resize-none focus:outline-none focus:ring focus:ring-blue-200"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>

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

      {/* Comments */}
      {/* [. . . . Comment Content] */}
    </div>
  );
};

export default PostDetails;
