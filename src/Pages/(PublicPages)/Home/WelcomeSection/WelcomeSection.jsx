import { FaChevronRight } from "react-icons/fa";
import PropTypes from "prop-types";

const WelcomeSection = ({ homeWelcomeData }) => {
  return (
    <div className="hidden md:flex relative h-screen w-full text-white">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={homeWelcomeData[0].videoUrl}
          title="Background Video"
          className="w-full h-full object-cover"
          allow="autoplay; fullscreen"
          frameBorder="0"
        ></iframe>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 px-6">
        {/* Hero Text */}
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-center mb-4 max-w-3xl">
          {homeWelcomeData[0].title}
        </h1>
        <p className="text-sm sm:text-lg lg:text-xl text-center mb-6 max-w-2xl opacity-80 sm:opacity-90">
          {homeWelcomeData[0].description}
        </p>

        {/* Call to Action (CTA) Buttons */}
        <div className="flex gap-4">
          {/* View Classes Button */}
          <a
            href="/classes"
            className="bg-transparent border border-white hover:bg-blue-500 hover:text-white text-white py-3 px-6 rounded-lg text-sm md:text-lg transition duration-300 flex items-center justify-between"
          >
            View Classes
          </a>

          {/* Join Now Button */}
          <a
            href="/join-now"
            className="bg-blue-500 hover:bg-linear-to-l from-blue-700 to-blue-400 text-white py-3 px-6 rounded-lg text-sm md:text-lg transition duration-300 flex items-center justify-between"
          >
            Join Now
            <FaChevronRight className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

// PropTypes to ensure data integrity for the component
WelcomeSection.propTypes = {
  homeWelcomeData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      videoUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default WelcomeSection;
