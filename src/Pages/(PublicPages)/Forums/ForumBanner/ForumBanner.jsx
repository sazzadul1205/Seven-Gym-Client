import { FaSearch } from "react-icons/fa";

const ForumBanner = ({ Wall, searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      <img
        src={Wall}
        alt="Forum Banner"
        className="w-full h-[300px] object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <p className="text-3xl font-bold text-white">Search Thread</p>
        <div className="flex md:w-2/3 max-w-xl">
          <input
            type="text"
            placeholder="Search threads by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-4 border bg-white shadow-lg rounded-l-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-green-500 hover:bg-green-400 p-4 rounded-r-lg">
            <FaSearch className="text-xl text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumBanner;
