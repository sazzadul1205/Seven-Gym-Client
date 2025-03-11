import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import ViewDetailsThreadsModal from "../ViewDetailsThreadsModal/ViewDetailsThreadsModal";

const ForumThreads = ({
  refetch,
  UsersData,
  forumsData,
  searchQuery,
  selectedCategory,
  visibleThreadsCount,
  setVisibleThreadsCount,
}) => {
  // State to hold the thread selected for detailed view
  const [selectedThread, setSelectedThread] = useState(null);

  // Sort forums by creation date (newest first)
  const sortedForumsData = forumsData
    ? [...forumsData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  // Filter threads based on search query (in thread title) and selected category
  const filteredThreads = sortedForumsData.filter((thread) => {
    const titleMatches = thread.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const categoryMatches =
      selectedCategory === "All" || thread.category === selectedCategory;
    return titleMatches && categoryMatches;
  });

  // Get top threads based on the number of comments, then likes.
  // Using optional chaining to handle missing comments or likes.
  const topThreads = forumsData
    ? [...forumsData]
        .sort(
          (a, b) =>
            (b.comments?.length || 0) - (a.comments?.length || 0) ||
            (b.likes || 0) - (a.likes || 0)
        )
        .slice(0, 5)
    : [];

  // Limit displayed threads to the specified count (visibleThreadsCount)
  const threadsToDisplay = filteredThreads.slice(0, visibleThreadsCount);

  // Utility function to convert a timestamp into a "time ago" string
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

  // Update the selected thread with new data when forumsData changes
  useEffect(() => {
    if (selectedThread) {
      const updatedThread = forumsData.find(
        (thread) => thread._id === selectedThread._id
      );
      if (updatedThread) {
        setSelectedThread(updatedThread);
      }
    }
  }, [forumsData, selectedThread]);

  // Function to close the modal and clear the selected thread
  const closeModal = () => {
    setSelectedThread(null);
    // Close the dialog modal using the dialog API
    document.getElementById("View_Details_Threads_Modal").close();
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 bg-white/20 mb-5 p-4">
      {/* All Threads Section */}
      <div className="lg:w-3/5 bg-white/30 p-4 rounded-lg shadow-md">
        {/* Section Title */}
        <h5 className="text-2xl font-bold italic border-b-2 border-black pb-2">
          Threads
        </h5>

        {/* List of Threads */}
        <div className="grid gap-4 pt-2">
          {threadsToDisplay.length > 0 ? (
            threadsToDisplay.map((thread) => (
              <div
                key={thread._id}
                onClick={() => {
                  // Set the thread to be viewed in detail and open the modal
                  setSelectedThread(thread);
                  document
                    .getElementById("View_Details_Threads_Modal")
                    .showModal();
                }}
                className="cursor-pointer border p-4 rounded-lg bg-gradient-to-br from-white to-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
              >
                <h3 className="text-lg font-bold text-black">{thread.title}</h3>
                <p className="text-gray-600 italic py-2">
                  {thread.description}
                </p>
                <div className="flex gap-5 font-semibold text-gray-800 mt-2">
                  <p>Comments: {thread.comments?.length || 0}</p>
                  <span>|</span>
                  <p>Likes: {thread.likes || 0}</p>
                  <span>|</span>
                  <p>{timeAgo(thread.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No threads found.</p>
          )}
        </div>

        {/* "Show More" Button to load additional threads */}
        {filteredThreads.length > visibleThreadsCount && (
          <div className="text-center pt-4">
            <button
              onClick={() => setVisibleThreadsCount(visibleThreadsCount + 8)}
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
            >
              Show More
            </button>
          </div>
        )}
      </div>

      {/* Top Threads Section */}
      <div className="lg:w-2/5 bg-white/50 p-4 rounded-lg shadow-md">
        {/* Section Title */}
        <h5 className="text-2xl font-bold italic border-b-2 border-black pb-2">
          Top Threads
        </h5>

        {/* List of Top Threads */}
        <div className="grid gap-4 pt-2">
          {topThreads.map((thread) => (
            <div
              key={thread._id}
              onClick={() => {
                // Set selected thread and open the modal for details
                setSelectedThread(thread);
                document
                  .getElementById("View_Details_Threads_Modal")
                  .showModal();
              }}
              className="cursor-pointer p-4 rounded-lg bg-gradient-to-bl from-gray-100 to-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
            >
              <h3 className="text-lg font-bold text-black">{thread.title}</h3>
              <p className="text-gray-600">
                {/* Display a truncated version of the description (first 20 words) */}
                {thread.description.split(" ").slice(0, 20).join(" ")}...
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Dialog for Viewing Thread Details */}
      <dialog id="View_Details_Threads_Modal" className="modal">
        {selectedThread && (
          <ViewDetailsThreadsModal
            refetch={refetch}
            thread={selectedThread}
            UsersData={UsersData}
            Close={closeModal}
          />
        )}
      </dialog>
    </div>
  );
};

ForumThreads.propTypes = {
  refetch: PropTypes.func.isRequired,
  UsersData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    fullName: PropTypes.string,
  }),
  forumsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      createdAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      likes: PropTypes.number,
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          name: PropTypes.string,
          email: PropTypes.string,
          comment: PropTypes.string,
          commentedAt: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date),
          ]),
        })
      ),
    })
  ).isRequired,
  searchQuery: PropTypes.string.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  visibleThreadsCount: PropTypes.number.isRequired,
  setVisibleThreadsCount: PropTypes.func.isRequired,
};

export default ForumThreads;
