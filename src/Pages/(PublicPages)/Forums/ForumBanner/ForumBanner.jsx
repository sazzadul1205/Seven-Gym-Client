import PropTypes from "prop-types";
import { FaSearch } from "react-icons/fa";

const ForumCategoryBanner = ({ Wall, searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full">
      {/* Banner Background Image */}
      <img
        src={Wall}
        alt="Forum Banner"
        className="w-full h-[250px] sm:h-[300px] md:h-[350px] object-cover"
      />

      {/* Overlay container with gradient background */}
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-gray-300/50 to-gray-400/50 px-4">
        {/* Banner Title */}
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
          Search Thread
        </p>

        {/* Search Input Label */}
        <label className="input rounded-xl input-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 gap-2 bg-white flex items-center px-3 mt-4">
          {/* Search Icon */}
          <FaSearch className="text-black font-semibold" />

          {/* Search Input Field */}
          <input
            type="search"
            placeholder="Search threads by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-lg sm:text-xl text-black flex-grow outline-none bg-transparent"
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
