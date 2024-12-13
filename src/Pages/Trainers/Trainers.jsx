import { useQuery } from "@tanstack/react-query";
import Background from "../../assets/Background.jpeg";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loading from "../../Shared/Loading/Loading";
import { FaSearch } from "react-icons/fa";

const Trainers = () => {
  const axiosPublic = useAxiosPublic();

  // Function to return tier badge style
  const getTierBadge = (tier) => {
    switch (tier) {
      case "Bronze":
        return "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg";
      case "Silver":
        return "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg";
      case "Gold":
        return "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg";
      case "Diamond":
        return "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg";
      case "Platinum":
        return "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Fetching Trainers Data
  const {
    data: TrainersData,
    isLoading: TrainersDataIsLoading,
    error: TrainersDataError,
  } = useQuery({
    queryKey: ["TrainersData"],
    queryFn: () => axiosPublic.get(`/Trainers`).then((res) => res.data),
  });

  // Fetching TrainersSpecializations Data
  const {
    data: TrainersSpecializationsData,
    isLoading: TrainersSpecializationsDataIsLoading,
    error: TrainersSpecializationsDataError,
  } = useQuery({
    queryKey: ["TrainersSpecializationsData"],
    queryFn: () =>
      axiosPublic.get(`/Trainers/specializations`).then((res) => res.data),
  });

  // Loading and error states (render below hooks)
  if (TrainersDataIsLoading || TrainersSpecializationsDataIsLoading) {
    return <Loading />;
  }

  if (TrainersDataError || TrainersSpecializationsDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }


  return (
    <div
      className=" min-h-screen pb-5"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Content */}
      <div className="flex">
        {/* Selectors */}
        <div className="w-1/4 bg-white opacity-80 ">
          <div className="pt-28 px-10">
            {/* Search By Name */}
            <div>
              <p className="font-bold">Search By Name</p>
              <label className="input input-bordered flex items-center mt-2">
                <input type="text" className="grow" placeholder="Search" />
                <FaSearch />
              </label>
            </div>

            {/* Specialization Dropdown */}
            <div className="mt-6">
              <p className="font-bold">Select Specialization</p>
              <select className="input input-bordered w-full mt-2">
                <option value="">All Specializations</option>
                {TrainersSpecializationsData.map((specialization, index) => (
                  <option key={index} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards Content */}
        <div className="w-3/4">
          {/* Title */}
          <div className="pt-28 text-center">
            <p className="text-3xl font-bold text-black">Our Gallery</p>
            <div className="bg-white p-[2px] md:w-1/6 mx-auto"></div>
          </div>
          {/* Card */}
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 mt-6 md:mt-11 px-5 mr-28">
            {TrainersData.map((trainer) => (
              <div
                key={trainer._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col"
              >
                {/* Tier Badge */}
                <span
                  className={`absolute opacity-80 top-4 left-4 inline-block px-4 py-2 rounded-full text-sm font-semibold ${getTierBadge(
                    trainer.tier
                  )}`}
                >
                  {trainer.tier} Tier
                </span>

                <img
                  src={trainer.imageUrl}
                  alt={trainer.name}
                  className="w-full h-[350px]"
                />
                <div className="p-6 text-left flex-1">
                  <h3 className="text-2xl font-bold">{trainer.name}</h3>
                  <p className="font-semibold">({trainer.specialization})</p>

                  {/* Active Time Works */}
                  <div className="mt-4 text-sm">
                    <p>
                      <strong>Active Time: </strong>
                      {trainer.availableFrom} - {trainer.availableUntil}
                    </p>
                    <p>
                      <strong>Available Days: </strong>
                      {trainer.availableDays.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Book Teacher Button */}
                <div className="mt-auto mb-1 mx-1">
                  <button className="px-6 py-2 font-semibold border-2 border-[#F72C5B] hover:bg-[#F72C5B] text-[#F72C5B] hover:text-white w-full">
                    Book Teacher
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers;
