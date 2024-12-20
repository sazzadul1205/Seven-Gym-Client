/* eslint-disable react/prop-types */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Background from "../../assets/Background.jpeg";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loading from "../../Shared/Loading/Loading";
import { FaSearch } from "react-icons/fa";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";
import TrainersCards from "./TrainersCards/TrainersCards";

const Trainers = () => {
  const axiosPublic = useAxiosPublic();

  // State for filters
  const [searchName, setSearchName] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState("");
  const [selectedClassType, setSelectedClassType] = useState("");
  const [selectedFocusArea, setSelectedFocusArea] = useState("");

  // Fetching static data for dropdowns and range sliders
  const { data: TrainersSpecializationsData } = useQuery({
    queryKey: ["TrainersSpecializationsData"],
    queryFn: () =>
      axiosPublic.get(`/Trainers/specializations`).then((res) => res.data),
  });

  const { data: TrainersTiersData } = useQuery({
    queryKey: ["TrainersTiersData"],
    queryFn: () => axiosPublic.get(`/Trainers/tiers`).then((res) => res.data),
  });

  const { data: TrainersLanguagesData } = useQuery({
    queryKey: ["TrainersLanguagesData"],
    queryFn: () =>
      axiosPublic.get(`/Trainers/languagesSpoken`).then((res) => res.data),
  });

  const { data: TrainersClassTypesData } = useQuery({
    queryKey: ["TrainersClassTypesData"],
    queryFn: () =>
      axiosPublic.get(`/Trainers/classTypes`).then((res) => res.data),
  });

  const { data: TrainersFocusAreasData } = useQuery({
    queryKey: ["TrainersFocusAreasData"],
    queryFn: () =>
      axiosPublic.get(`/Trainers/focusAreas`).then((res) => res.data),
  });

  // Fetching filtered trainers
  const { data: TrainersData, isLoading: TrainersDataIsLoading } = useQuery({
    queryKey: [
      "TrainersData",
      searchName,
      selectedSpecialization,
      selectedTier,
      selectedGender,
      selectedLanguages,
      selectedClassType,
      selectedFocusArea,
    ],
    queryFn: () => {
      const params = {};

      if (searchName) params.name = searchName;
      if (selectedSpecialization)
        params.specialization = selectedSpecialization;
      if (selectedTier) params.tier = selectedTier;
      if (selectedGender) params.gender = selectedGender;
      if (selectedLanguages) params.languages = selectedLanguages;
      if (selectedClassType) params.classType = selectedClassType;
      if (selectedFocusArea) params.focusArea = selectedFocusArea;
      return axiosPublic.get(`/Trainers`, { params }).then((res) => res.data);
    },
    enabled: true,
  });

  // Function to return tier badge style
  const getTierBadge = (tier) => {
    const styles = {
      Bronze: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
      Silver: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
      Gold: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
      Diamond: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
      Platinum: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
    };
    return styles[tier] || "bg-gray-200 text-gray-700";
  };

  // Reusable Dropdown Component
  const Dropdown = ({ label, options, onChange, selectedValue }) => (
    <div className="mt-6">
      <p className="font-bold">{label}</p>
      <select
        className="input input-bordered w-full mt-2"
        onChange={onChange}
        value={selectedValue}
      >
        <option value="">All {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div
      className="drawer drawer-end"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex">
        {/* Filter Section */}
        <div className="w-full lg:w-1/4 bg-white bg-opacity-90 shadow-lg pt-20 p-6 h-screen sticky top-0 hidden lg:block">
          {/* Search By Name */}
          <div className="mt-24 ">
            <p className="font-bold">Search By Name</p>
            <label className="input input-bordered flex items-center mt-2">
              <input
                type="text"
                className="grow"
                placeholder="Search"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <FaSearch />
            </label>
          </div>

          {/* Dropdown Specialization Filters */}
          <Dropdown
            label="Specialization"
            options={TrainersSpecializationsData || []}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            selectedValue={selectedSpecialization}
          />

          {/* Dropdown Tier Filters */}
          <Dropdown
            label="Tier"
            options={TrainersTiersData || []}
            onChange={(e) => setSelectedTier(e.target.value)}
            selectedValue={selectedTier}
          />

          {/* Gender Selection */}
          <div className="mt-6">
            <p className="font-bold">Select Gender</p>
            <div className="flex justify-between mt-3 space-x-2">
              <button
                className={`flex-1 flex items-center justify-center p-4 border rounded-lg ${
                  selectedGender === "Male"
                    ? "border-blue-500 bg-blue-100"
                    : "border-blue-500 hover:bg-blue-100"
                }`}
                onClick={() => setSelectedGender("Male")}
              >
                <IoMdMale className="text-blue-500 text-2xl" />
                <span className="ml-2 font-semibold text-blue-500">Male</span>
              </button>
              <button
                className={`flex-1 flex items-center justify-center p-4 border rounded-lg ${
                  selectedGender === null
                    ? "border-gray-500 bg-gray-300"
                    : "border-gray-400 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedGender(null)} // Use null for "All"
              >
                <MdOutlinePeopleAlt className="text-gray-400 text-2xl" />
                <span className="ml-2 font-semibold text-gray-500">All</span>
              </button>
              <button
                className={`flex-1 flex items-center justify-center p-4 border rounded-lg ${
                  selectedGender === "Female"
                    ? "border-pink-500 bg-pink-100"
                    : "border-pink-500 hover:bg-pink-100"
                }`}
                onClick={() => setSelectedGender("Female")}
              >
                <IoMdFemale className="text-pink-500 text-2xl" />
                <span className="ml-2 font-semibold text-pink-500">Female</span>
              </button>
            </div>
          </div>

          {/* Other Dropdown Filters */}
          <Dropdown
            label="Languages"
            options={TrainersLanguagesData || []}
            onChange={(e) => setSelectedLanguages(e.target.value)}
            selectedValue={selectedLanguages}
          />
          <Dropdown
            label="Class Types"
            options={TrainersClassTypesData || []}
            onChange={(e) => setSelectedClassType(e.target.value)}
            selectedValue={selectedClassType}
          />
          <Dropdown
            label="Focus Areas"
            options={TrainersFocusAreasData || []}
            onChange={(e) => setSelectedFocusArea(e.target.value)}
            selectedValue={selectedFocusArea}
          />
        </div>

        {/* Trainers Cards */}
        <div className="flex-1 w-full lg:w-3/4 overflow-y-auto pb-20 lg:px-6 pt-20">
          {/* Title */}
          <div>
            <div className=" py-5 text-center hidden lg:block">
              <p className="text-3xl font-bold text-black">Our Trainers</p>
              <div className="bg-white p-[2px] md:w-1/6 mx-auto"></div>
            </div>

            <div className="px-4 py-5 flex lg:hidden justify-between items-center bg-white mb-2">
              <p className="text-3xl font-bold text-black">Our Trainers</p>
              {/* Drawer toggle button */}
              <label htmlFor="my-drawer-5" className="drawer-button ">
                <FaSearch className="text-2xl" />
              </label>
            </div>
          </div>

          {/* Content */}
          {TrainersDataIsLoading ? (
            <Loading /> // Show loading spinner in the content area while trainers are being loaded
          ) : TrainersData?.length === 0 ? (
            <div className="text-center text-3xl text-red-500 font-semibold">
              No trainers found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {TrainersData.map((trainer) => (
                <TrainersCards
                  key={trainer._id}
                  trainer={trainer}
                  getTierBadge={getTierBadge}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer Section */}
      <div className="drawer drawer-end z-40">
        <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <div className="drawer-side ">
          <label
            htmlFor="my-drawer-5"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div
            className="menu bg-base-200 text-base-content min-h-full w-80 p-4"
            style={{ maxWidth: "80%" }}
          >
            <div className="pt-8">
              {/* Search By Name */}
              <div className="mt-6">
                <p className="font-bold">Search By Name</p>
                <label className="input input-bordered flex items-center mt-2">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Search"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  <FaSearch />
                </label>
              </div>

              {/* Dropdown Specialization Filters */}
              <Dropdown
                label="Specialization"
                options={TrainersSpecializationsData || []}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                selectedValue={selectedSpecialization}
              />

              {/* Dropdown Tier Filters */}
              <Dropdown
                label="Tier"
                options={TrainersTiersData || []}
                onChange={(e) => setSelectedTier(e.target.value)}
                selectedValue={selectedTier}
              />

              {/* Gender Selection */}
              <div className="mt-6">
                <p className="font-bold">Select Gender</p>
                <div className="flex flex-col justify-between mt-3 space-y-2">
                  <button
                    className={`flex-1 flex items-center justify-center p-4 border rounded-lg ${
                      selectedGender === "Male"
                        ? "border-blue-500 bg-blue-100"
                        : "border-blue-500 hover:bg-blue-100"
                    }`}
                    onClick={() => setSelectedGender("Male")}
                  >
                    <IoMdMale className="text-blue-500 text-2xl" />
                    <span className="ml-2 font-semibold text-blue-500">
                      Male
                    </span>
                  </button>
                  <button
                    className={`flex-1 flex items-center justify-center p-4 border rounded-lg ${
                      selectedGender === null
                        ? "border-gray-500 bg-gray-300"
                        : "border-gray-400 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedGender(null)} // Use null for "All"
                  >
                    <MdOutlinePeopleAlt className="text-gray-400 text-2xl" />
                    <span className="ml-2 font-semibold text-gray-500">
                      All
                    </span>
                  </button>
                  <button
                    className={`flex-1 flex items-center justify-center p-4 border rounded-lg ${
                      selectedGender === "Female"
                        ? "border-pink-500 bg-pink-100"
                        : "border-pink-500 hover:bg-pink-100"
                    }`}
                    onClick={() => setSelectedGender("Female")}
                  >
                    <IoMdFemale className="text-pink-500 text-2xl" />
                    <span className="ml-2 font-semibold text-pink-500">
                      Female
                    </span>
                  </button>
                </div>
              </div>

              {/* Other Dropdown Filters */}
              <Dropdown
                label="Languages"
                options={TrainersLanguagesData || []}
                onChange={(e) => setSelectedLanguages(e.target.value)}
                selectedValue={selectedLanguages}
              />
              <Dropdown
                label="Class Types"
                options={TrainersClassTypesData || []}
                onChange={(e) => setSelectedClassType(e.target.value)}
                selectedValue={selectedClassType}
              />
              <Dropdown
                label="Focus Areas"
                options={TrainersFocusAreasData || []}
                onChange={(e) => setSelectedFocusArea(e.target.value)}
                selectedValue={selectedFocusArea}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers;
