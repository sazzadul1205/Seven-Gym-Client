import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Icons
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import Modals and Components
import CommunityAuthorAvatar from "../../(PublicPages)/Community/CommunityAuthorAvatar/CommunityAuthorAvatar";
import PostDetails from "../../(PublicPages)/Community/PostDetails/PostDetails";

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

const CommunityPostsManagement = ({ CommunityPostsData, Refetch }) => {
  // Local State
  const [selectedPost, setSelectedPost] = useState(null);

  // Filter States
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [sortPriority, setSortPriority] = useState("mostRecent");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // How many refunds to show per page
  const postsPerPage = 10;

  // Unique tags for dropdown
  const allTags = [
    ...new Set(CommunityPostsData.flatMap((post) => post.tags || [])),
  ];

  // Filtered + sorted posts
  const filteredPosts = [...CommunityPostsData]
    .filter((post) => {
      const authorMatch = post.authorName
        ?.toLowerCase()
        .includes(searchAuthor.toLowerCase());
      const titleMatch = post.postTitle
        ?.toLowerCase()
        .includes(searchTitle.toLowerCase());
      const tagMatch = selectedTag ? post.tags?.includes(selectedTag) : true;

      return authorMatch && titleMatch && tagMatch;
    })
    .sort((a, b) => {
      switch (sortPriority) {
        case "mostLiked":
          return (b.liked?.length || 0) - (a.liked?.length || 0);
        case "mostDisliked":
          return (b.disliked?.length || 0) - (a.disliked?.length || 0);
        case "mostCommented":
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        case "mostRecent":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Pagination calculations
  const indexOfLastTrainer = currentPage * postsPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - postsPerPage;

  // Current posts to display on the current page
  const currentPosts = filteredPosts.slice(
    indexOfFirstTrainer,
    indexOfLastTrainer
  );

  // Total number of pages
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="text-black pb-5">
      {/* Header */}
      <div className="bg-gray-400 py-2 flex items-center">
        {/* Left: Add Button */}
        <div className="flex-shrink-0 w-10" />

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Community Posts (Admin) [ Total Posts:{" "}
          {CommunityPostsData?.length || 0} ]
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
        {/* Author Name Filter */}
        <div className="flex flex-col w-full sm:w-[240px]">
          <label className="text-xs sm:text-sm font-semibold text-white mb-1">
            Search by Author
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Author name..."
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
              className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Post Title Filter */}
        <div className="flex flex-col w-full sm:w-[240px]">
          <label className="text-xs sm:text-sm font-semibold text-white mb-1">
            Search by Title
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Post title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Tag Dropdown */}
        <div className="flex flex-col w-full sm:w-[180px]">
          <label className="text-xs sm:text-sm font-semibold text-white mb-1">
            Filter by Tag
          </label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 outline-none shadow-sm"
          >
            <option value="">All Tags</option>
            {allTags.map((tag, i) => (
              <option key={i} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex flex-col w-full sm:w-[180px]">
          <label className="text-xs sm:text-sm font-semibold text-white mb-1">
            Sort By
          </label>
          <select
            value={sortPriority}
            onChange={(e) => setSortPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 outline-none shadow-sm"
          >
            <option value="mostRecent">Most Recent</option>
            <option value="mostLiked">Most Liked</option>
            <option value="mostDisliked">Most Disliked</option>
            <option value="mostCommented">Most Commented</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      {currentPosts.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Data Table */}
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Likes</th>
                <th className="px-4 py-2">Dislikes</th>
                <th className="px-4 py-2">Comments</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {currentPosts?.map((post, index) => (
                <tr key={post._id} className="hover:bg-gray-100">
                  {/* Post Number */}
                  <td className="px-4 py-2 border">{index + 1}</td>

                  {/* Post Title */}
                  <td className="px-4 py-2 border font-medium">
                    {post.postTitle}
                  </td>

                  {/* Author Information */}
                  <td className="px-4 py-2 border">
                    <CommunityAuthorAvatar post={post} />
                  </td>

                  {/* Like Count */}
                  <td className="px-4 py-2 border text-center">
                    {post.liked?.length || 0}
                  </td>

                  {/* Dislike Count */}
                  <td className="px-4 py-2 border text-center">
                    {post.disliked?.length || 0}
                  </td>

                  {/* Comment Count */}
                  <td className="px-4 py-2 border text-center">
                    {post.comments?.length || 0}
                  </td>

                  {/* Create dAt */}
                  <td className="px-4 py-2 border">
                    {formatDate(post.createdAt)}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {/* Delete Button */}
                      <>
                        <button
                          id={`Delete-post-btn-${post._id}`}
                          className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => {
                            //   handleDeleteTestimonial(post?._id);
                          }}
                        >
                          <FaRegTrashAlt className="text-red-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#Delete-post-btn-${post._id}`}
                          content="Delete Post"
                        />
                      </>

                      {/* Edit Button */}
                      <>
                        <button
                          id={`Edit-post-btn-${post._id}`}
                          className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => {
                            setSelectedPost(post);
                            document
                              .getElementById("Post_Details_Modal")
                              .showModal();
                          }}
                        >
                          <MdEdit className="text-yellow-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#Edit-post-btn-${post._id}`}
                          content="Edit Post"
                        />
                      </>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Control */}
          <div className="mt-6 flex justify-center items-center gap-4 px-4 sm:px-6 md:px-10">
            <div className="join">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesLeft />
              </button>

              <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesRight />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-200 p-4">
          <p className="text-center font-semibold text-black">
            No Posts Available.
          </p>
        </div>
      )}

      {/* Post Details Modal */}
      <dialog id="Post_Details_Modal" className="modal">
        <PostDetails
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          CommunityPostsRefetch={Refetch}
          adminOverride="Admin"
        />
      </dialog>
    </div>
  );
};

// Prop Validation
CommunityPostsManagement.propTypes = {
  CommunityPostsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      authorName: PropTypes.string,
      authorEmail: PropTypes.string,
      authorRole: PropTypes.string,
      authorId: PropTypes.string,
      postTitle: PropTypes.string,
      postContent: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      liked: PropTypes.array,
      disliked: PropTypes.array,
      comments: PropTypes.array,
      createdAt: PropTypes.string,
    })
  ).isRequired,
  Refetch: PropTypes.func.isRequired,
};

export default CommunityPostsManagement;
