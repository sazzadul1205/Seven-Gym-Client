import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";

import Trainer_Page_Background from "../../../../assets/Trainers-Background/Trainer_Page_Background.jpg";

import Loading from "../../../../Shared/Loading/Loading";
import TrainerFilter from "./TrainerFilter/TrainerFilter";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import TrainerPublicIdCard from "../../../../Shared/Component/TrainerPublicIdCard";

const Trainers = () => {
  const axiosPublic = useAxiosPublic();

  // State for filters
  const [searchName, setSearchName] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState("");
  const [selectedClassType, setSelectedClassType] = useState("");
  const [selectedFocusArea, setSelectedFocusArea] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

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

  // Fetching filtered trainers based on user selection
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

      // Fetch filtered trainer data from the server
      return axiosPublic.get(`/Trainers`, { params }).then((res) => res.data);
    },
    enabled: true, // Ensure query runs only when necessary
  });

  return (
    <div
      className=" bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Trainer_Page_Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Main Section */}
      <div className="flex">
        {/* Left Filter Section */}
        <div className="hidden lg:block w-1/4 bg-white/90 px-2 border-r-2 border-black pb-5">
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

        {/* Trainers Cards Section */}
        <div className="w-full lg:w-3/4 lg:ml-auto overflow-y-auto bg-linear-to-b from-white/50 to-white/10">
          {/* Title (Mobile View) */}
          <div className="px-4 py-5 flex lg:hidden justify-between items-center bg-gray-200 text-white mb-5">
            <p className="text-3xl font-bold text-black border-b-2 border-black">
              Our Trainers
            </p>
            {/* Drawer toggle button */}
            <label
              htmlFor="my-drawer-5"
              className="drawer-button cursor-pointer bg-white rounded-xl p-2"
            >
              <FaSearch className="text-xl text-black" />
            </label>
          </div>

          {/* Title (PC View) */}
          <div className="hidden lg:block py-5 text-center bg-white/50 text-gray-700">
            <p className="text-4xl font-bold text-gray-900">Our Trainers</p>
            <div className="bg-gray-900 p-[2px] md:w-3/12 mx-auto mt-2"></div>
          </div>

          {/* Trainer Cards Content */}
          <div className="px-2">
            {TrainersDataIsLoading ? (
              <Loading /> // Show loading spinner while trainers are being fetched
            ) : !Array.isArray(TrainersData) || TrainersData.length === 0 ? (
              <div className="text-center text-3xl text-red-500 font-semibold">
                No trainers found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {TrainersData.map((trainer) => (
                  <TrainerPublicIdCard key={trainer._id} trainer={trainer} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer Section (Mobile View) */}
      <div className="drawer drawer-end z-40">
        <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-5"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div
            className="menu bg-white/80 text-base-content min-h-full w-80 p-4 pt-20"
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
