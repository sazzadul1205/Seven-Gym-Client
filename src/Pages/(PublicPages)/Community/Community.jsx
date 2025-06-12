import { useEffect, useState } from "react";
import { FaPlus, FaCommentAlt, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
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

  const [localPosts, setLocalPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const {
    data: CommunityPostsData,
    isLoading: CommunityPostsIsLoading,
    error: CommunityPostsError,
    refetch: CommunityPostsRefetch,
  } = useQuery({
    queryKey: ["CommunityPostsData"],
    queryFn: () => axiosPublic.get("/CommunityPosts").then((res) => res.data),
  });

  // Toggle Like
  const toggleLike = async (post) => {
    if (!user || !user.email) {
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

    // 1. Optimistically update local state
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

    // 2. Perform the actual API call
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

      // 3. Revert on failure
      Swal.fire({
        icon: "error",
        title: "Failed to Like",
        text: "An error occurred while liking the post. Please try again.",
      });

      // 4. Revert to server state
      setLocalPosts(CommunityPostsData);
    }
  };

  // Toggle Dislike
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

    // 1. Optimistically update local state
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

    // 2. Perform the actual API call
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

      // 3. Revert on failure
      Swal.fire({
        icon: "error",
        title: "Failed to Dislike",
        text: "An error occurred while disliking the post. Please try again.",
      });

      // 4. Revert to server state
      setLocalPosts(CommunityPostsData);
    }
  };

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
      <h3 className="bg-gradient-to-b from-[#F72C5B] to-[#c199a2] text-white text-center text-4xl font-extrabold py-8 shadow-lg">
        Community Corner
      </h3>

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

        <div className="px-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {localPosts.map((post) => {
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
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-4">
                    <CommunityAuthorAvatar post={post} />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {post.authorName}
                      </h4>
                      <p className="text-sm text-gray-500">{post.authorRole}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                <div className="p-6 flex-1">
                  <h5 className="text-2xl font-bold text-gray-900 mb-3">
                    {post.postTitle}
                  </h5>

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

                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-6">
                    {/* Like Button */}
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
                    <span className="font-medium text-black">{likeCount}</span>

                    {/* Dislike Button */}
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

                    {/* Comment Button */}
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
