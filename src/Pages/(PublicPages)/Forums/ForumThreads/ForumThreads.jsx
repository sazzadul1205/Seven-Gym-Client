const ForumThreads = ({
  threadsToDisplay,
  setSelectedThread,
  filteredThreads,
  visibleThreadsCount,
  setVisibleThreadsCount,
  topThreads,
}) => {
  // Utility function to calculate time ago
  const timeAgo = (timestamp) => {
    const now = new Date();
    const timeDiff = now - new Date(timestamp); // Difference in milliseconds
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
    <div className="flex flex-col lg:flex-row gap-10 lg:px-20">
      {/* Threads */}
      <div className="pt-8 pb-4 px-6 lg:w-4/5 bg-white">
        <h2 className="text-2xl font-bold pb-2 text-center lg:text-left italic">
          All Threads
        </h2>
        <div className="grid gap-4 pt-2">
          {threadsToDisplay?.length > 0 ? (
            threadsToDisplay.map((thread) => (
              <div
                key={thread.id}
                onClick={() => {
                  setSelectedThread(thread);
                  document.getElementById("Modal_View_Details").showModal();
                }}
                className="border p-4 rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
              >
                <h3 className="text-lg font-semibold">{thread.title}</h3>
                <p className="text-gray-600">{thread.description}</p>
                <div className="text-sm text-gray-500 mt-2">
                  Comments: {thread.comments?.length || 0} | Likes:{" "}
                  {thread.likes} | {timeAgo(thread.createdAt)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No threads found.</p>
          )}
        </div>

        {/* Show More Button */}
        {filteredThreads?.length > visibleThreadsCount && (
          <div className="text-center pt-4 ">
            <button
              onClick={() => setVisibleThreadsCount(visibleThreadsCount + 8)}
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
            >
              Show More
            </button>
          </div>
        )}
      </div>

      {/* Top Threads */}
      <div className="pt-8 pb-4 px-6 lg:w-1/5 bg-white">
        <h2 className="text-2xl font-bold pb-2 text-center lg:text-left italic">
          Top Threads
        </h2>
        <div className="grid gap-4 pt-2">
          {topThreads?.length > 0 ? (
            topThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => {
                  setSelectedThread(thread);
                  document.getElementById("Modal_View_Details").showModal();
                }}
                className="border-2 border-green-300 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
              >
                <h3 className="text-lg font-semibold">{thread.title}</h3>
                <p className="text-gray-600">
                  {thread.description.split(" ").slice(0, 20).join(" ")}
                  ...
                </p>
                <div className="text-sm text-gray-500 mt-2">
                  Comments: {thread.comments?.length || 0} | Likes:{" "}
                  {thread.likes} | {timeAgo(thread.createdAt)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No top threads found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumThreads;
