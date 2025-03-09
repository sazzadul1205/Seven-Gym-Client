import PropTypes from "prop-types";

import { FaSearch } from "react-icons/fa";

const ForumCategoryBanner = ({ Wall, searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      {/* Banner Background Image */}
      <img
        src={Wall}
        alt="Forum Banner"
        className="w-full h-[300px] object-cover"
      />

      {/* Overlay container with gradient background */}
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-gray-300/50 to-gray-400/50">
        {/* Banner Title */}
        <p className="text-3xl font-bold text-white">Search Thread</p>

        {/* Search Input Label */}
        <label className="input rounded-xl input-lg w-1/4 gap-2 bg-white flex items-center px-3">
          {/* Search Icon */}
          <FaSearch className="text-black font-semibold" />

          {/* Search Input Field */}
          <input
            type="search"
            placeholder="Search threads by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xl text-black flex-grow outline-none"
          />
        </label>
      </div>
    </div>
  );
};

ForumCategoryBanner.propTypes = {
  Wall: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};

export default ForumCategoryBanner;
