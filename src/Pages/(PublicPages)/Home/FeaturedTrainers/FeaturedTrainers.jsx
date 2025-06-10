import { Link } from "react-router";

// Import Packages
import PropTypes from "prop-types";

// Import title
import Title from "../../../../Shared/Component/Title";

// Import Trainer Card
import TrainerPublicIdCard from "../../../../Shared/Component/TrainerPublicIdCard";

// Import button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

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
        <div className="flex text-center justify-center mt-8">
          <Link to="/Trainers">
            <CommonButton
              text="Find More Teachers"
              bgColor="OriginalRed" 
              px="px-14"
              py="py-3"
              textColor="text-white"
              borderRadius="rounded-xl"
              width="auto"
              cursorStyle="cursor-pointer"
            />
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
      tier: PropTypes.string,
      imageUrl: PropTypes.string.isRequired,
      specialization: PropTypes.string.isRequired,
      experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      perSession: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      availableDays: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

export default FeaturedTrainers;
