import { useEffect, useState } from "react";
import {
  FaPlus,
  FaCommentAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaRegTrashAlt,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Forums_Background from "../../../assets/Forums-Background/Forums-Background.jfif";
import PostDetails from "./PostDetails/PostDetails";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";
import CommonButton from "../../../Shared/Buttons/CommonButton";
import useAuth from "../../../Hooks/useAuth";
import CommunityAuthorAvatar from "./CommunityAuthorAvatar/CommunityAuthorAvatar";
import Swal from "sweetalert2";

// Utility function to format date to a human-readable string
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

const Community = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Local state for storing posts and selected post for modal/view
  const [localPosts, setLocalPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch community posts using React Query
  const {
    data: CommunityPostsData,
    isLoading: CommunityPostsIsLoading,
    error: CommunityPostsError,
    refetch: CommunityPostsRefetch,
  } = useQuery({
    queryKey: ["CommunityPostsData"],
    queryFn: () => axiosPublic.get("/CommunityPosts").then((res) => res.data),
  });

  // Like toggle handler
  const toggleLike = async (post) => {
    if (!user || !user.email) {
      // Ask user to log in if not authenticated
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to like this post.",
        confirmButtonText: "Login",
      });
      return;
    }

    const userEmail = user.email;
    const userLiked = post.liked?.includes(userEmail);
    const userDisliked = post.disliked?.includes(userEmail);

    // Optimistically update UI
    const updatedPosts = localPosts.map((p) => {
      if (p._id === post._id) {
        const newLiked = userLiked
          ? p.liked.filter((email) => email !== userEmail)
          : [...(p.liked || []), userEmail];

        const newDisliked = userDisliked
          ? p.disliked.filter((email) => email !== userEmail)
          : p.disliked;

        return { ...p, liked: newLiked, disliked: newDisliked };
      }
      return p;
    });

    setLocalPosts(updatedPosts);

    // Sync with server
    try {
      if (userLiked) {
        await axiosPublic.patch(`/CommunityPosts/Post/Like/${post._id}`, {
          email: userEmail,
        });
      } else {
        if (userDisliked) {
          await axiosPublic.patch(`/CommunityPosts/Post/Dislike/${post._id}`, {
            email: userEmail,
          });
        }
        await axiosPublic.patch(`/CommunityPosts/Post/Like/${post._id}`, {
          email: userEmail,
        });
      }
    } catch (error) {
      console.log(error);

      // Revert UI and alert user on error
      Swal.fire({
        icon: "error",
        title: "Failed to Like",
        text: "An error occurred while liking the post. Please try again.",
      });
      setLocalPosts(CommunityPostsData);
    }
  };

  // Dislike toggle handler (same logic as like, but for dislikes)
  const toggleDislike = async (post) => {
    if (!user || !user.email) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to dislike this post.",
        confirmButtonText: "Login",
      });
      return;
    }

    const userEmail = user.email;
    const userLiked = post.liked?.includes(userEmail);
    const userDisliked = post.disliked?.includes(userEmail);

    const updatedPosts = localPosts.map((p) => {
      if (p._id === post._id) {
        const newDisliked = userDisliked
          ? p.disliked.filter((email) => email !== userEmail)
          : [...(p.disliked || []), userEmail];

        const newLiked = userLiked
          ? p.liked.filter((email) => email !== userEmail)
          : p.liked;

        return { ...p, disliked: newDisliked, liked: newLiked };
      }
      return p;
    });

    setLocalPosts(updatedPosts);

    try {
      if (userDisliked) {
        await axiosPublic.patch(`/CommunityPosts/Post/Dislike/${post._id}`, {
          email: userEmail,
        });
      } else {
        if (userLiked) {
          await axiosPublic.patch(`/CommunityPosts/Post/Like/${post._id}`, {
            email: userEmail,
          });
        }
        await axiosPublic.patch(`/CommunityPosts/Post/Dislike/${post._id}`, {
          email: userEmail,
        });
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Failed to Dislike",
        text: "An error occurred while disliking the post. Please try again.",
      });
      setLocalPosts(CommunityPostsData);
    }
  };

  // Update local state when data is fetched or refetch'ed
  useEffect(() => {
    if (CommunityPostsData) {
      setLocalPosts(CommunityPostsData);
    }
  }, [CommunityPostsData]);

  if (CommunityPostsIsLoading) return <Loading />;
  if (CommunityPostsError) return <FetchingError />;

  return (
    <div
      className="bg-fixed bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${Forums_Background})` }}
    >
      {/* Header */}
      <h3 className="bg-gradient-to-b from-[#F72C5B] to-[#c199a2] text-white text-center text-4xl font-extrabold py-8 shadow-lg">
        Community Corner
      </h3>

      {/* Add, Search, Dropdowns & toggle  */}
      <div className="bg-gradient-to-b from-gray-100/50 to-gray-300/50 min-h-screen pb-5">
        <div className="flex justify-start py-5 px-10">
          <CommonButton
            clickEvent={() => {
              // Add post logic
            }}
            text="Add New Post"
            icon={<FaPlus />}
            iconPosition="before"
            textColor="text-white"
            bgColor="green"
            px="px-10"
            py="py-3"
            borderRadius="rounded-xl"
            className="shadow hover:bg-green-700 transition"
            cursorStyle="cursor-pointer"
          />
        </div>

        {/* Community Grid Layout */}
        <div className="px-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {localPosts.map((post) => {
            // Prepare preview and interaction state
            const isLong = post.postContent.length > 300;
            const preview = isLong
              ? post.postContent.slice(0, 300) + "..."
              : post.postContent;

            const likeCount = post.liked?.length ?? 0;
            const dislikeCount = post.disliked?.length ?? 0;
            const commentCount = post.comments?.length ?? 0;

            const userLiked = post.liked?.includes(user?.email);
            const userDisliked = post.disliked?.includes(user?.email);

            return (
              // Post Card
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
              >
                {/* Post Header with Author Info */}
                <div className="flex items-center justify-between p-6 border-b">
                  {/* Post Author Avatar, Name & Role */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <CommunityAuthorAvatar post={post} />

                    {/* Name & Role  */}
                    <div>
                      {/* Name */}
                      <h4 className="text-lg font-semibold text-gray-800">
                        {post.authorName}
                      </h4>
                      {/* Role */}
                      <p className="text-sm text-gray-500">{post.authorRole}</p>
                    </div>
                  </div>

                  {/* Post Created At */}
                  <span className="text-sm text-gray-400">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                {/* Post Content */}
                <div className="p-6 flex-1">
                  {/* Post Title */}
                  <h5 className="text-2xl font-bold text-gray-900 mb-3">
                    {post.postTitle}
                  </h5>

                  {/* Post Preview Content with 'Show more' if long */}
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {preview}
                    {isLong && (
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          document
                            .getElementById("Post_Details_Modal")
                            .showModal();
                        }}
                        className="text-blue-600 hover:underline text-sm ml-2"
                      >
                        Show more
                      </button>
                    )}
                  </p>

                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-sm bg-pink-100 text-pink-500 px-5 py-1 rounded-full"
                        >
                          # {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex justify-between items-center">
                    {/* Trash & Edit Buttons */}
                    <div className="flex items-center gap-6">
                      {/* Edit/Delete only for post author */}
                      {user?.email === post.authorEmail && (
                        <>
                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              // handle delete here
                            }}
                            className="flex items-center text-red-700 bg-red-100 hover:bg-red-200 border border-red-500 p-3 rounded-full transition cursor-pointer"
                          >
                            <FaRegTrashAlt className="text-lg" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              // handle edit here
                            }}
                            className="flex items-center text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border border-yellow-500 p-3 rounded-full transition cursor-pointer"
                          >
                            <MdEdit className="text-lg" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Like, Dislike & Comment Comments */}
                    <div className="flex items-center gap-6">
                      {/* Like */}
                      <button
                        onClick={() => toggleLike(post)}
                        className={`flex items-center gap-2 border p-3 rounded-full transition cursor-pointer ${
                          userLiked
                            ? "text-green-600 border-green-600"
                            : "text-gray-600 border-gray-400 hover:text-green-600 hover:border-green-600"
                        }`}
                      >
                        <FaThumbsUp className="text-lg" />
                      </button>
                      <span className="font-medium text-black">
                        {likeCount}
                      </span>

                      {/* Dislike */}
                      <button
                        onClick={() => toggleDislike(post)}
                        className={`flex items-center gap-2 border p-3 rounded-full transition cursor-pointer ${
                          userDisliked
                            ? "text-red-600 border-red-500"
                            : "text-gray-600 border-gray-400 hover:text-red-600 hover:border-red-500"
                        }`}
                      >
                        <FaThumbsDown className="text-lg" />
                      </button>
                      <span className="font-medium text-black">
                        {dislikeCount}
                      </span>

                      {/* Comment */}
                      <button
                        className="flex items-center gap-2 border border-gray-400 p-3 rounded-full text-gray-600 hover:text-yellow-600 hover:border-yellow-500 transition cursor-pointer"
                        onClick={() => {
                          setSelectedPost(post);
                          document
                            .getElementById("Post_Details_Modal")
                            .showModal();
                        }}
                      >
                        <FaCommentAlt className="text-lg" />
                      </button>
                      <span className="font-medium text-black">
                        {commentCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Details Modal */}
      <dialog id="Post_Details_Modal" className="modal">
        <PostDetails
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          CommunityPostsRefetch={CommunityPostsRefetch}
        />
      </dialog>
    </div>
  );
};

export default Community;
