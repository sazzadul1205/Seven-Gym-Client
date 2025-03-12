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
  // State to store the currently selected thread for the modal
  const [selectedThread, setSelectedThread] = useState(null);

  // Sort forums by creation date (newest first)
  const sortedForumsData = forumsData
    ? [...forumsData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  // Filter threads based on search query and selected category
  const filteredThreads = sortedForumsData.filter((thread) => {
    const titleMatches = thread.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const categoryMatches =
      selectedCategory === "All" || thread.category === selectedCategory;
    return titleMatches && categoryMatches;
  });

  // Sort and get the top 5 most engaged threads (based on comments and likes)
  const topThreads = forumsData
    ? [...forumsData]
        .sort(
          (a, b) =>
            (b.comments?.length || 0) - (a.comments?.length || 0) || // Sort by number of comments
            (b.likes || 0) - (a.likes || 0) // If comments are equal, sort by likes
        )
        .slice(0, 5)
    : [];

  // Limit the number of threads displayed
  const threadsToDisplay = filteredThreads.slice(0, visibleThreadsCount);

  // Function to format timestamps into "time ago" format
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

  // Update selectedThread when the forumsData changes
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

  // Function to close the modal
  const closeModal = () => {
    setSelectedThread(null);
    document.getElementById("View_Details_Threads_Modal").close();
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 bg-white/20 mb-5 p-4">
      {/* Main Threads Section */}
      <div className="lg:w-3/5 w-full bg-white/30 p-4 rounded-lg shadow-md">
        <h5 className="text-2xl font-bold italic border-b-2 border-black pb-2">
          Threads
        </h5>
        <div className="grid gap-4 pt-2">
          {threadsToDisplay.length > 0 ? (
            threadsToDisplay.map((thread) => (
              <div
                key={thread._id}
                onClick={() => {
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
                <div className="flex flex-col md:flex-row flex-wrap gap-5 font-semibold text-gray-800 mt-2">
                  <p>Comments: {thread.comments?.length || 0}</p>
                  <span className="hidden lg:flex">|</span>
                  <p>Likes: {thread.likes || 0}</p>
                  <span className="hidden lg:flex">|</span>
                  <p>{timeAgo(thread.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No threads found.</p>
          )}
        </div>
        {/* Load more button if more threads are available */}
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
      <div className="lg:w-2/5 w-full bg-white/50 p-4 rounded-lg shadow-md">
        <h5 className="text-2xl font-bold italic border-b-2 border-black pb-2">
          Top Threads
        </h5>
        <div className="grid gap-4 pt-2">
          {topThreads.map((thread) => (
            <div
              key={thread._id}
              onClick={() => {
                setSelectedThread(thread);
                document
                  .getElementById("View_Details_Threads_Modal")
                  .showModal();
              }}
              className="cursor-pointer p-4 rounded-lg bg-gradient-to-bl from-gray-100 to-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
            >
              <h3 className="text-lg font-bold text-black">{thread.title}</h3>
              <p className="text-gray-600">
                {thread.description.split(" ").slice(0, 20).join(" ")}...
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Viewing Thread Details */}
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
