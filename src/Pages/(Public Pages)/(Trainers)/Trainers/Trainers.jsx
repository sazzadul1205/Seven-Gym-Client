import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Background from "../../../../assets/Background.jpeg";
import { FaSearch } from "react-icons/fa";
import TrainersCards from "./TrainersCards/TrainersCards";
import TrainerFilter from "./TrainerFilter/TrainerFilter";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Loading from "../../../../Shared/Loading/Loading";

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

  return (
    <div
      className="drawer drawer-end"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Section */}
      <div className="bg-[#F72C5B] py-11"></div>
      {/* Main Section */}
      <div className="flex">
        {/* Left Filter Section */}
        <div className="w-full lg:w-1/4 bg-white bg-opacity-90 shadow-lg p-6 h-screen sticky top-0 hidden lg:block">
          <TrainerFilter
            searchName={searchName}
            setSearchName={setSearchName}
            selectedSpecialization={selectedSpecialization}
            setSelectedSpecialization={setSelectedSpecialization}
            selectedTier={selectedTier}
            setSelectedTier={setSelectedTier}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedLanguages={selectedLanguages}
            setSelectedLanguages={setSelectedLanguages}
            selectedClassType={selectedClassType}
            setSelectedClassType={setSelectedClassType}
            selectedFocusArea={selectedFocusArea}
            setSelectedFocusArea={setSelectedFocusArea}
            TrainersSpecializationsData={TrainersSpecializationsData}
            TrainersTiersData={TrainersTiersData}
            TrainersLanguagesData={TrainersLanguagesData}
            TrainersClassTypesData={TrainersClassTypesData}
            TrainersFocusAreasData={TrainersFocusAreasData}
          />
        </div>

        {/* Trainers Cards */}
        <div className="flex-1 w-full lg:w-3/4 overflow-y-auto pb-20 lg:px-6">
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
          <>
            {TrainersDataIsLoading ? (
              <Loading /> // Show loading spinner in the content area while trainers are being loaded
            ) : TrainersData?.length === 0 ? (
              <div className="text-center text-3xl text-red-500 font-semibold">
                No trainers found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 px-2 lg:px-0">
                {TrainersData.map((trainer) => (
                  <TrainersCards
                    key={trainer._id}
                    trainer={trainer}
                    getTierBadge={getTierBadge}
                  />
                ))}
              </div>
            )}
          </>
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
            <TrainerFilter
              searchName={searchName}
              setSearchName={setSearchName}
              selectedSpecialization={selectedSpecialization}
              setSelectedSpecialization={setSelectedSpecialization}
              selectedTier={selectedTier}
              setSelectedTier={setSelectedTier}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              selectedClassType={selectedClassType}
              setSelectedClassType={setSelectedClassType}
              selectedFocusArea={selectedFocusArea}
              setSelectedFocusArea={setSelectedFocusArea}
              TrainersSpecializationsData={TrainersSpecializationsData}
              TrainersTiersData={TrainersTiersData}
              TrainersLanguagesData={TrainersLanguagesData}
              TrainersClassTypesData={TrainersClassTypesData}
              TrainersFocusAreasData={TrainersFocusAreasData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers;
