import { useState } from "react";
import PropTypes from "prop-types";
import ViewDetailsThreadsModal from "../ViewDetailsThreadsModal/ViewDetailsThreadsModal";

const ForumThreads = ({
  topThreads,
  filteredThreads,
  threadsToDisplay,
  visibleThreadsCount,
  setVisibleThreadsCount,
}) => {
  // State to track the selected thread for the modal
  const [selectedThread, setSelectedThread] = useState(null);

  // Utility function to calculate the time ago from timestamp
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

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 bg-white/20 mb-5 p-4">
      {/* Threads Section */}
      <div className="lg:w-3/5 bg-white/30 p-4 rounded-lg shadow-md">
        {/* Section Title */}
        <h5 className="text-2xl font-bold italic border-b-2 border-black pb-2">
          Threads
        </h5>

        {/* Threads List */}
        <div className="grid gap-4 pt-2">
          {threadsToDisplay?.length > 0 ? (
            threadsToDisplay.map((thread) => (
              <div
                key={thread.id}
                onClick={() => {
                  setSelectedThread(thread);
                  document
                    .getElementById("View_Details_Threads_Modal")
                    .showModal();
                }}
                className="cursor-pointer border p-4 rounded-lg bg-gradient-to-br from-white to-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
              >
                {/* Thread Title */}
                <h3 className="text-lg font-bold text-black">{thread.title}</h3>
                {/* Thread Description */}
                <p className="text-gray-600 italic py-2">
                  {thread.description}
                </p>
                {/* Thread Stats */}
                <div className="flex gap-5 font-semibold text-gray-800 mt-2">
                  <p>Comments: {thread.comments?.length || 0}</p> |
                  <p>Likes: {thread.likes}</p> |
                  <p>{timeAgo(thread.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No threads found.</p>
          )}
        </div>

        {/* Show More Button */}
        {filteredThreads?.length > visibleThreadsCount && (
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

        {/* Top Threads List */}
        <div className="grid gap-4 pt-2">
          {topThreads?.map((thread) => (
            <div
              key={thread.id}
              onClick={() => {
                setSelectedThread(thread);
                document
                  .getElementById("View_Details_Threads_Modal")
                  .showModal();
              }}
              className="cursor-pointer p-4 rounded-lg bg-gradient-to-bl from-gray-100 to-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
            >
              {/* Thread Title */}
              <h3 className="text-lg font-bold text-black">{thread.title}</h3>
              {/* Short Description */}
              <p className="text-gray-600">
                {thread.description.split(" ").slice(0, 20).join(" ")}...
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Thread Details Modal */}

      <dialog id="View_Details_Threads_Modal" className="modal">
        <ViewDetailsThreadsModal thread={selectedThread} />
      </dialog>
    </div>
  );
};

// PropTypes Validation
ForumThreads.propTypes = {
  threadsToDisplay: PropTypes.array.isRequired,
  filteredThreads: PropTypes.array.isRequired,
  visibleThreadsCount: PropTypes.number.isRequired,
  setVisibleThreadsCount: PropTypes.func.isRequired,
  topThreads: PropTypes.array.isRequired,
};

export default ForumThreads;
