/* eslint-disable react/prop-types */
import CommunityAuthorAvatar from "../../(PublicPages)/Community/CommunityAuthorAvatar/CommunityAuthorAvatar";
import { Tooltip } from "react-tooltip";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import PostDetails from "../../(PublicPages)/Community/PostDetails/PostDetails";
import { useState } from "react";

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
  console.log(CommunityPostsData);

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

      {/* Table Section */}
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
            {CommunityPostsData?.map((post, index) => (
              <tr key={post._id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border font-medium">
                  {post.postTitle}
                </td>
                <td className="px-4 py-2 border">
                  <CommunityAuthorAvatar post={post} />
                </td>
                <td className="px-4 py-2 border text-center">
                  {post.liked?.length || 0}
                </td>
                <td className="px-4 py-2 border text-center">
                  {post.disliked?.length || 0}
                </td>
                <td className="px-4 py-2 border text-center">
                  {post.comments?.length || 0}
                </td>
                <td className="px-4 py-2 border">
                  {formatDate(post.createdAt)}
                </td>
                {/* Action */}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Post Details Modal */}
      <dialog id="Post_Details_Modal" className="modal">
        <PostDetails
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          CommunityPostsRefetch={Refetch}
        />
      </dialog>
    </div>
  );
};

export default CommunityPostsManagement;
