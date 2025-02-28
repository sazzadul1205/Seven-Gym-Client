import PropTypes from "prop-types";
import { FaSearch } from "react-icons/fa";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";

// Reusable Dropdown Component
const Dropdown = ({ label, options, onChange, selectedValue }) => (
  <div className="mt-6">
    <p className="font-bold">{label}</p>
    <select
      className="input input-bordered rounded-xl w-full mt-2"
      onChange={onChange}
      value={selectedValue}
    >
      <option value="">All {label}</option>
      {options?.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
};

const TrainerFilter = ({
  searchName,
  setSearchName,
  selectedSpecialization,
  setSelectedSpecialization,
  selectedTier,
  setSelectedTier,
  selectedGender,
  setSelectedGender,
  selectedLanguages,
  setSelectedLanguages,
  selectedClassType,
  setSelectedClassType,
  selectedFocusArea,
  setSelectedFocusArea,
  TrainersSpecializationsData = [],
  TrainersTiersData = [],
  TrainersLanguagesData = [],
  TrainersClassTypesData = [],
  TrainersFocusAreasData = [],
}) => {
  return (
    <>
      {/* Search Input */}
      <div className="mt-5">
        <p className="font-bold">Search By Name</p>
        <label className="input input-bordered rounded-xl flex items-center mt-2">
          <input
            type="text"
            className="grow "
            placeholder="Search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <FaSearch />
        </label>
      </div>

      {/* Dropdown Filters */}
      <Dropdown
        label="Specialization"
        options={TrainersSpecializationsData}
        onChange={(e) => setSelectedSpecialization(e.target.value)}
        selectedValue={selectedSpecialization}
      />
      <Dropdown
        label="Tier"
        options={TrainersTiersData}
        onChange={(e) => setSelectedTier(e.target.value)}
        selectedValue={selectedTier}
      />

      {/* Gender Selection */}
      <div className="mt-6">
        <p className="font-bold">Select Gender</p>
        <div className="flex justify-between mt-3 space-x-2">
          {/* Male Button */}
          <button
            className={`flex-1 flex items-center justify-center p-4 border rounded-lg ${
              selectedGender === "Male"
                ? "border-blue-500 bg-blue-100"
                : "border-blue-500 hover:bg-blue-100"
            }`}
            onClick={() => setSelectedGender("Male")}
          >
            <IoMdMale className="text-blue-500 text-2xl" />
          </button>

          {/* All Genders Button */}
          <button
            className={`flex-1 flex items-center justify-center p-4 border rounded-lg ${
              selectedGender === null
                ? "border-gray-500 bg-gray-300"
                : "border-gray-400 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedGender(null)}
          >
            <MdOutlinePeopleAlt className="text-gray-400 text-2xl" />
          </button>

          {/* Female Button */}
          <button
            className={`flex-1 flex items-center justify-center p-4 border rounded-lg ${
              selectedGender === "Female"
                ? "border-pink-500 bg-pink-100"
                : "border-pink-500 hover:bg-pink-100"
            }`}
            onClick={() => setSelectedGender("Female")}
          >
            <IoMdFemale className="text-pink-500 text-2xl" />
          </button>
        </div>
      </div>

      {/* Additional Dropdown Filters */}
      <Dropdown
        label="Languages"
        options={TrainersLanguagesData}
        onChange={(e) => setSelectedLanguages(e.target.value)}
        selectedValue={selectedLanguages}
      />
      <Dropdown
        label="Class Types"
        options={TrainersClassTypesData}
        onChange={(e) => setSelectedClassType(e.target.value)}
        selectedValue={selectedClassType}
      />
      <Dropdown
        label="Focus Areas"
        options={TrainersFocusAreasData}
        onChange={(e) => setSelectedFocusArea(e.target.value)}
        selectedValue={selectedFocusArea}
      />
    </>
  );
};

// **Prop Validation**
TrainerFilter.propTypes = {
  searchName: PropTypes.string.isRequired,
  setSearchName: PropTypes.func.isRequired,
  selectedSpecialization: PropTypes.string,
  setSelectedSpecialization: PropTypes.func.isRequired,
  selectedTier: PropTypes.string,
  setSelectedTier: PropTypes.func.isRequired,
  selectedGender: PropTypes.oneOf(["Male", "Female", null]),
  setSelectedGender: PropTypes.func.isRequired,
  selectedLanguages: PropTypes.string,
  setSelectedLanguages: PropTypes.func.isRequired,
  selectedClassType: PropTypes.string,
  setSelectedClassType: PropTypes.func.isRequired,
  selectedFocusArea: PropTypes.string,
  setSelectedFocusArea: PropTypes.func.isRequired,
  TrainersSpecializationsData: PropTypes.arrayOf(PropTypes.string),
  TrainersTiersData: PropTypes.arrayOf(PropTypes.string),
  TrainersLanguagesData: PropTypes.arrayOf(PropTypes.string),
  TrainersClassTypesData: PropTypes.arrayOf(PropTypes.string),
  TrainersFocusAreasData: PropTypes.arrayOf(PropTypes.string),
};

// **Default Props**
TrainerFilter.defaultProps = {
  TrainersSpecializationsData: [],
  TrainersTiersData: [],
  TrainersLanguagesData: [],
  TrainersClassTypesData: [],
  TrainersFocusAreasData: [],
};

export default TrainerFilter;
