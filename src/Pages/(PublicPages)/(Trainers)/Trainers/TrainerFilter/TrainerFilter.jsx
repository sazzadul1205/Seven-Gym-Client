import PropTypes from "prop-types";
import { FaSearch } from "react-icons/fa";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";

// Reusable Dropdown Component
const Dropdown = ({ label, options, onChange, selectedValue }) => (
  <div className="mt-6 space-y-2">
    <p className="font-bold text-black text-lg">{label}</p>
    <select
      className="input border border-gray-500 w-full bg-white text-black rounded-xl h-12"
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

//  TrainerFilter Component - Provides various filters for selecting trainers.
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
      <div className="mt-5 space-y-3">
        <p className="font-bold text-black text-lg">Search By Name</p>
        <label className="input border border-gray-500 w-full bg-white text-black rounded-3xl h-12 flex items-center px-3">
          <FaSearch className="text-xl text-gray-600 mr-2" />
          <input
            type="search"
            placeholder="Search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full outline-none bg-transparent"
          />
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
        <p className="font-bold text-black text-lg">Select Gender</p>
        <div className="flex justify-between mt-3 space-x-2 gap-2">
          {/* Gender Selection Buttons */}
          {[
            {
              value: "Male",
              icon: <IoMdMale className="text-blue-500 text-3xl" />,
              border: "border-blue-500",
              bgActive: "bg-blue-100",
              bgInactive: "bg-blue-50 hover:bg-blue-100",
            },
            {
              value: null,
              icon: <MdOutlinePeopleAlt className="text-gray-500 text-3xl" />,
              border: "border-gray-500",
              bgActive: "bg-gray-200",
              bgInactive: "bg-gray-100 hover:bg-gray-200",
            },
            {
              value: "Female",
              icon: <IoMdFemale className="text-pink-500 text-3xl" />,
              border: "border-pink-500",
              bgActive: "bg-pink-100",
              bgInactive: "bg-pink-50 hover:bg-pink-100",
            },
          ].map(({ value, icon, border, bgActive, bgInactive }) => (
            <button
              key={value === null ? "all" : value}
              className={`flex-1 flex items-center justify-center p-4 border-2 rounded-lg transition ${
                selectedGender === value ? bgActive : bgInactive
              } ${border}`}
              onClick={() => setSelectedGender(value)}
            >
              {icon}
            </button>
          ))}
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
