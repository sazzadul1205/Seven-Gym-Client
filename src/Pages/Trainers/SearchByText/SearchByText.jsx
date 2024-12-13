// SearchByText.js
import { FaSearch } from "react-icons/fa";

const SearchByText = ({ searchText, setSearchText }) => {
  return (
    <div>
      <p className="font-bold">Search By Name</p>
      <label className="input input-bordered flex items-center mt-2">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <FaSearch />
      </label>
    </div>
  );
};

export default SearchByText;
