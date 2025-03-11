import { useState } from "react";

import ViewDetailsThreadsModal from "../ViewDetailsThreadsModal/ViewDetailsThreadsModal";

const ForumThreads = ({
  UsersData,
  forumsData,
  refetch,
  searchQuery,
  selectedCategory,
  visibleThreadsCount,
  setVisibleThreadsCount,
}) => {
  const [selectedThread, setSelectedThread] = useState(null);

  // Sorting forums by date (newest first)
  const sortedForumsData = forumsData
    ? forumsData
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  // Filtering based on search and category
  const filteredThreads = sortedForumsData.filter(
    (thread) =>
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || thread.category === selectedCategory)
  );

  // Get top threads
  const topThreads = forumsData
    ? forumsData
        .slice()
        .sort(
          (a, b) => b.comments.length - a.comments.length || b.likes - a.likes
        )
        .slice(0, 5)
    : [];

  // Get visible threads
  const threadsToDisplay = filteredThreads.slice(0, visibleThreadsCount);

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

  const closeModal = () => {
    setSelectedThread(null);
    document.getElementById("View_Details_Threads_Modal").close();
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 bg-white/20 mb-5 p-4">
      <div className="lg:w-3/5 bg-white/30 p-4 rounded-lg shadow-md">
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

      <div className="lg:w-2/5 bg-white/50 p-4 rounded-lg shadow-md">
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

export default ForumThreads;
