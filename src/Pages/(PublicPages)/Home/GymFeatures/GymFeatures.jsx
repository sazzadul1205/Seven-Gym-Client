import PropTypes from "prop-types";
import Title from "../../../../Shared/Component/Title";

const GymFeatures = ({ gymFeaturesData }) => {
  // Filter features to only show those with show === true
  const visibleFeatures = gymFeaturesData.filter((feature) => feature.show);

  return (
    <div className="py-10 bg-gradient-to-b from-black/40 to-black/70">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <Title titleContent="Our Gym Features" />

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-6 md:mt-11 px-5 md:px-0">
          {visibleFeatures.map(({ _id, icon, title, description }) => (
            <div
              key={_id}
              className="bg-linear-to-tr hover:bg-linear-to-bl from-gray-200 to-gray-400 shadow-lg hover:shadow-2xl rounded-lg text-center flex flex-col items-center p-5 transition duration-300 cursor-default"
            >
              {/* Feature Icon */}
              <img
                src={icon}
                alt={title}
                className="w-20 h-20 mb-4"
                loading="lazy"
              />

              {/* Feature Title */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {title}
              </h3>

              {/* Feature Description */}
              <p className="text-black">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
GymFeatures.propTypes = {
  gymFeaturesData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      show: PropTypes.bool, // optional but relevant
    })
  ).isRequired,
};

export default GymFeatures;
