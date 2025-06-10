import { Link } from "react-router";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { FaChevronRight } from "react-icons/fa";

// Import Hooks
import useAuth from "../../../../Hooks/useAuth";

// Import Shared button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const WelcomeSection = ({ homeWelcomeData }) => {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex relative h-screen w-full text-white">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={homeWelcomeData.videoUrl}
          title="Background Video"
          className="w-full h-full object-cover"
          allow="autoplay; fullscreen"
          frameBorder="0"
        ></iframe>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 px-6">
        {/* Hero Text */}
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-center mb-4 max-w-3xl">
          {homeWelcomeData.title}
        </h1>
        <p className="text-sm sm:text-lg lg:text-xl text-center mb-6 max-w-2xl opacity-80 sm:opacity-90">
          {homeWelcomeData.description}
        </p>

        {/* Call to Action (CTA) Buttons */}
        <div className="flex gap-4 items-center">
          {/* View Classes Button */}
          <Link to="/Classes">
            <button className="border bg-linear-to-bl hover:bg-linear-to-tr from-gray-500/50 to-gray-800/70 py-3 px-10 rounded-lg text-sm md:text-lg cursor-pointer ">
              View Classes
            </button>
          </Link>

          {/* Conditional Button: Join Now or Trainers */}
          <Link to={user ? "/Trainers" : "/SignUp"}>
            <CommonButton
              text={user ? "Trainers" : "Join Now"}
              textColor="text-white"
              bgColor="blue"
              px="px-10"
              py="py-4"
              className="text-sm md:text-lg"
              icon={<FaChevronRight />}
              iconPosition="after"
              borderRadius="rounded-lg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

// PropTypes to ensure data integrity for the component
WelcomeSection.propTypes = {
  homeWelcomeData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    videoUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default WelcomeSection;
