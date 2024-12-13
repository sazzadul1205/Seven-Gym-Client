import { useQuery } from "@tanstack/react-query";
import Background from "../../assets/Background.jpeg";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loading from "../../Shared/Loading/Loading";
import { FaSearch } from "react-icons/fa";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";
import Cards from "./Cards/Cards";

const Trainers = () => {
  const axiosPublic = useAxiosPublic();

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
  const Dropdown = ({ label, options, onChange }) => (
    <div className="mt-6">
      <p className="font-bold">{label}</p>
      <select
        className="input input-bordered w-full mt-2"
        onChange={onChange}
        defaultValue=""
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

  // Fetching data using React Query
  const { data: TrainersData, isLoading: TrainersDataIsLoading } = useQuery({
    queryKey: ["TrainersData"],
    queryFn: () => axiosPublic.get(`/Trainers`).then((res) => res.data),
  });

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
      axiosPublic.get(`/Trainers/languages`).then((res) => res.data),
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

  if (TrainersDataIsLoading) {
    return <Loading />;
  }

  return (
    <div
      className="min-h-screen pb-5"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Main Content */}
      <div className="flex">
        {/* Filter Section */}
        <div className="w-1/4 bg-white bg-opacity-90 shadow-lg pt-20 p-6">
          {/* Search By Name */}
          <div className="mt-6">
            <p className="font-bold">Search By Name</p>
            <label className="input input-bordered flex items-center mt-2">
              <input type="text" className="grow" placeholder="Search" />
              <FaSearch />
            </label>
          </div>

          {/* Dropdown Specialization Filters */}
          <Dropdown
            label="Specialization"
            options={TrainersSpecializationsData || []}
          />

          {/* Dropdown Tier Filters */}
          <Dropdown label="Tier" options={TrainersTiersData || []} />

          {/* Gender Selection */}
          <div className="mt-6">
            <p className="font-bold">Select Gender</p>
            <div className="flex justify-between mt-3 space-x-2">
              <button className="flex-1 flex items-center justify-center p-4 border border-blue-500 rounded-lg hover:bg-blue-100">
                <IoMdMale className="text-blue-500 text-2xl" />
                <span className="ml-2 font-semibold text-blue-500">Male</span>
              </button>
              <button className="flex-1 flex items-center justify-center p-4 border border-gray-400 rounded-lg hover:bg-gray-100">
                <MdOutlinePeopleAlt className="text-gray-400 text-2xl" />
                <span className="ml-2 font-semibold text-gray-500">All</span>
              </button>
              <button className="flex-1 flex items-center justify-center p-4 border border-pink-500 rounded-lg hover:bg-pink-100">
                <IoMdFemale className="text-pink-500 text-2xl" />
                <span className="ml-2 font-semibold text-pink-500">Female</span>
              </button>
            </div>
          </div>

          {/* Dropdown languages Filters */}
          <Dropdown label="languages" options={TrainersLanguagesData || []} />

          {/* Dropdown classTypes Filters */}
          <Dropdown label="classTypes" options={TrainersClassTypesData || []} />

          {/* Dropdown focusAreas Filters */}
          <Dropdown label="focusAreas" options={TrainersFocusAreasData || []} />
        </div>

        {/* Trainers Cards */}
        <div className="w-3/4">
          <div className="pt-28 text-center">
            <p className="text-3xl font-bold text-black">Our Trainers</p>
            <div className="bg-red-500 h-[2px] w-1/6 mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 mt-10">
            {TrainersData.map((trainer) => (
              <Cards
                key={trainer._id}
                trainer={trainer}
                getTierBadge={getTierBadge}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers;
