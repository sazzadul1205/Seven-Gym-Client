import PropTypes from "prop-types";

const ForumThreads = ({
  topThreads,
  filteredThreads,
  threadsToDisplay,
  visibleThreadsCount,
  setVisibleThreadsCount,
}) => {
  // Utility function to calculate time ago
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
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-2 pb-5">
      {/* Threads Section */}
      <div className="lg:w-3/5 bg-white/30 p-2">
        {/* Threads Title */}
        <h5 className="text-2xl font-bold italic border-b-2 border-black">
          Threads
        </h5>

        {/* Threads Content */}
        <div className="grid gap-4 pt-2">
          {threadsToDisplay?.length > 0 ? (
            threadsToDisplay.map((thread) => (
              <div
                key={thread.id}
                className="border p-4 rounded-lg bg-linear-to-br hover:bg-linear-to-tl from-white to-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-700"
              >
                {/* Title */}
                <h3 className="text-lg font-bold text-black">
                  {thread.title}
                </h3>
                {/* Description */}
                <p className="text-gray-600 italic py-2">
                  {thread.description}
                </p>
                {/* Extra */}
                <div className="flex gap-5 font-semibold text-gray-800 mt-2 ">
                  <p>Comments: {thread.comments?.length || 0}</p> |
                  <p>
                    Likes:
                    {thread.likes}
                  </p>
                  | <p>{timeAgo(thread.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No threads found.</p>
          )}
        </div>

        {/* Show More Button */}
        {filteredThreads?.length > visibleThreadsCount && (
          <div className="text-center pt-4">
            <button
              onClick={() => setVisibleThreadsCount(visibleThreadsCount + 8)}
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
            >
              Show More
            </button>
          </div>
        )}
      </div>

      {/* Top Threads Section */}
      <div className="pt-8 pb-4 px-6 lg:w-2/5">
        <h2 className="text-2xl font-bold pb-2 text-center lg:text-left italic">
          Top Threads
        </h2>
        <div className="grid gap-4 pt-2">
          {topThreads?.map((thread) => (
            <div
              key={thread.id}
              className="border-2 border-green-300 p-4 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-lg font-semibold">{thread.title}</h3>
              <p className="text-gray-600">
                {thread.description.split(" ").slice(0, 20).join(" ")}...
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ForumThreads.propTypes = {
  threadsToDisplay: PropTypes.array,
  filteredThreads: PropTypes.array,
  visibleThreadsCount: PropTypes.number.isRequired,
  setVisibleThreadsCount: PropTypes.func.isRequired,
  topThreads: PropTypes.array,
};

export default ForumThreads;
