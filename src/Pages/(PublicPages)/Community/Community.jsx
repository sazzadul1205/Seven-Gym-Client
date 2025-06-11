import { useState } from "react";
import { FaPlus, FaCommentAlt, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Forums_Background from "../../../assets/Forums-Background/Forums-Background.jfif";
import PostDetails from "./PostDetails/PostDetails";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery, useQueries } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";
import CommonButton from "../../../Shared/Buttons/CommonButton";
import useAuth from "../../../Hooks/useAuth";

// Helper function to format a date string into a readable format with month, day, year, and time in 12-hour format
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

  console.log(user);

  // State to track currently selected post for detailed view
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch all by Tanstack Query
  const {
    data: CommunityPostsData,
    isLoading: CommunityPostsIsLoading,
    error: CommunityPostsError,
  } = useQuery({
    queryKey: ["CommunityPostsData"],
    queryFn: () => axiosPublic.get("/CommunityPosts").then((res) => res.data),
  });

  // Once posts are fetched, fetch profile info for each post’s author, depending on their role (Trainer or Member)
  const profileQueries = useQueries({
    queries:
      CommunityPostsData?.map((post) => {
        // If author is a Trainer, fetch trainer basic info by authorId
        if (post.authorRole === "Trainer") {
          return {
            queryKey: ["TrainerBasicInfo", post.authorId],
            queryFn: () =>
              axiosPublic
                .get(`/Trainers/BasicInfo?id=${post.authorId}`)
                .then((res) => res.data),
            enabled: !!post.authorId,
          };
        } else if (post.authorRole === "Member") {
          // If author is a Member, fetch user basic profile by email
          return {
            queryKey: ["UserBasicProfile", post.authorEmail],
            queryFn: () =>
              axiosPublic
                .get(`/Users/BasicProfile?email=${post.authorEmail}`)
                .then((res) => res.data),
            enabled: !!post.authorEmail,
          };
        } else {
          // If role is unknown or invalid, skip fetching profile
          return {
            queryKey: ["InvalidAuthor", post._id],
            queryFn: async () => null,
            enabled: false,
          };
        }
      }) || [],
  });

  // Check if any profile query is still loading
  const isAnyProfileLoading = profileQueries.some((q) => q.isLoading);

  // Check if any profile query has errored
  const isAnyProfileError = profileQueries.some((q) => q.error);

  // Show loading spinner if posts or profiles are loading
  if (CommunityPostsIsLoading || isAnyProfileLoading) {
    return <Loading />;
  }

  // Show error component if posts or profile fetches errored
  if (CommunityPostsError || isAnyProfileError) {
    return <FetchingError />;
  }

  console.log(CommunityPostsData[0]);

  return (
    <div
      className="bg-fixed bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${Forums_Background})` }}
    >
      {/* Page header */}
      <h3 className="bg-gradient-to-b from-[#F72C5B] to-[#c199a2] text-white text-center text-4xl font-extrabold py-8 shadow-lg">
        Community Corner
      </h3>

      {/* Main content area with gradient background */}
      <div className="bg-gradient-to-b from-gray-100/50 to-gray-300/50 min-h-screen pb-5">
        {/* Button to add a new post, positioned top-right */}
        <div className="flex justify-start py-5 px-10">
          <CommonButton
            clickEvent={() => {
              // Add your click handler here
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
        {/* Posts grid container */}
        <div className="px-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Loop through community posts */}
          {CommunityPostsData.map((post, index) => {
            // Check if post content is longer than 300 characters for preview truncation
            const isLong = post.postContent.length > 300;
            // Create preview text - truncated or full content accordingly
            const preview = isLong
              ? post.postContent.slice(0, 300) + "..."
              : post.postContent;

            // Count likes, dislikes, and comments safely (handle undefined)
            const likeCount = post.liked?.length ?? 0;
            const dislikeCount = post.disliked?.length ?? 0;
            const commentCount = post.comments?.length ?? 0;

            // Get profile data from the corresponding profile query result
            const profileData = profileQueries[index]?.data;

            // Determine author image URL from profile data or fallback to generated avatar with initials
            const authorImg =
              profileData?.imageUrl || // For Trainer profile image
              profileData?.profileImage || // For Member profile image
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.authorName
              )}&background=random&size=64`; // Fallback avatar

            return (
              // Individual post card container with rounded corners and shadow
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
              >
                {/* Post header with author info and timestamp */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-4">
                    {/* Author avatar */}
                    <img
                      src={authorImg}
                      alt={post.authorName}
                      className="w-12 h-12 rounded-full"
                    />
                    {/* Author name and role */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {post.authorName}
                      </h4>
                      <p className="text-sm text-gray-500">{post.authorRole}</p>
                    </div>
                  </div>
                  {/* Post creation date formatted */}
                  <span className="text-sm text-gray-400">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                {/* Post title and content preview */}
                <div className="p-6 flex-1">
                  {/* Post title */}
                  <h5 className="text-2xl font-bold text-gray-900 mb-3">
                    {post.postTitle}
                  </h5>
                  {/* Post content preview */}
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {preview}{" "}
                    {/* Show 'Show more' button if content is truncated */}
                    {isLong && (
                      <button
                        onClick={() => setSelectedPost(post)} // Select post for detailed view on click
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Show more
                      </button>
                    )}
                  </p>

                  {/* Post action buttons (Like, Dislike, Comment) */}
                  <div className="flex items-center justify-end gap-6">
                    {/* Like Button */}
                    <button
                      className="flex items-center gap-2 group transition cursor-pointer"
                      aria-label="Like"
                      onClick={() => {
                        // Placeholder: implement like functionality here
                      }}
                    >
                      <div className="border border-gray-400 p-2 rounded-full group-hover:border-green-600 transition-colors">
                        <FaThumbsUp className="text-lg text-gray-600 group-hover:text-green-600" />
                      </div>
                      <span className="text-gray-700 group-hover:text-green-600 font-medium">
                        {likeCount}
                      </span>
                    </button>

                    {/* Dislike Button */}
                    <button
                      className="flex items-center gap-2 group transition cursor-pointer"
                      aria-label="Dislike"
                      onClick={() => {
                        // Placeholder: implement dislike functionality here
                      }}
                    >
                      <div className="border border-gray-400 p-2 rounded-full group-hover:border-red-500 transition-colors">
                        <FaThumbsDown className="text-lg text-gray-600 group-hover:text-red-600" />
                      </div>
                      <span className="text-gray-700 group-hover:text-red-600 font-medium">
                        {dislikeCount}
                      </span>
                    </button>

                    {/* Comment Button */}
                    <button
                      className="flex items-center gap-2 group transition cursor-pointer"
                      aria-label="Comment"
                      onClick={() => {
                        setSelectedPost(post); // Set selected post for modal
                        document
                          .getElementById("Post_Details_Modal")
                          .showModal(); // Show the comments/details modal
                      }}
                    >
                      <div className="border border-gray-400 p-2 rounded-full group-hover:border-yellow-500 transition-colors">
                        <FaCommentAlt className="text-lg text-gray-600 group-hover:text-yellow-600" />
                      </div>
                      <span className="text-gray-700 group-hover:text-yellow-600 font-medium">
                        {commentCount}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal dialog for post details and comments */}
      <dialog id="Post_Details_Modal" className="modal">
        <PostDetails
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
        />
      </dialog>
    </div>
  );
};

export default Community;
