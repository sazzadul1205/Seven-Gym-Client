/* eslint-disable react/prop-types */
import Title from "../../../Shared/Componenet/Title";
import Cards from "../../Trainers/Cards/Cards";

const FeaturedTrainers = ({ trainersData }) => {
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

  return (
    <div className="py-16 mx-auto max-w-[1200px]">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent={" Our Featured Teachers"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 mt-6 md:mt-11 px-2">
          {trainersData.slice(0, 6).map((trainer) => (
            <Cards
              key={trainer._id}
              trainer={trainer}
              getTierBadge={getTierBadge}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <button className=" px-12 md:px-24 py-3 font-semibold bg-[#F72C5B] hover:bg-white text-white hover:text-[#F72C5B] items-end gap-5 justify-end mx-auto transform transition-all duration-300 ease-in-out hover:scale-105">
            <span>Find More Teachers</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTrainers;
