import { Link } from "react-router";

import PropTypes from "prop-types";

import Title from "../../../../Shared/Component/Title";
import TrainerPublicIdCard from "../../../../Shared/Component/TrainerPublicIdCard";

// Main Featured Trainers Component
const FeaturedTrainers = ({ trainersData }) => {
  return (
    <div className="py-10 bg-gradient-to-t from-black/40 to-black/70">
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="text-center px-6">
          <Title titleContent="Our Trainer's" />
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-5">
          {trainersData.slice(0, 8).map((trainer) => (
            <TrainerPublicIdCard key={trainer._id} trainer={trainer} />
          ))}
        </div>

        {/* "Find More Teachers" Button */}
        <div className="text-center mt-8">
          <Link to="/Trainers">
            <button className="bg-linear-to-bl hover:bg-linear-to-tr from-[#d1234f] to-[#fc003f] px-14 py-3 text-xl font-semibold text-white rounded-xl shadow-lg hover:shadow-2xl">
              Find More Teachers
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation for FeaturedTrainers component
FeaturedTrainers.propTypes = {
  trainersData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      tier: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      specialization: PropTypes.string.isRequired,
      experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      perSession: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      availableDays: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

export default FeaturedTrainers;
