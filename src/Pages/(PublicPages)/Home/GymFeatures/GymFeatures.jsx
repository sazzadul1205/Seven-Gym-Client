import PropTypes from "prop-types";
import Title from "../../../../Shared/Component/Title";

const GymFeatures = ({ gymFeaturesData }) => {
  return (
    <section className="py-10 bg-gradient-to-b from-black/20 to-black/40">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Title */}
        <Title titleContent="Our Gym Features" />

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-6 md:mt-11 px-5 md:px-0">
          {gymFeaturesData.map(({ _id, icon, title, description }) => (
            <div
              key={_id}
              className="bg-gradient-to-tr hover:bg-gradient-to-bl from-gray-200 to-gray-400 shadow-lg hover:shadow-2xl rounded-lg text-center flex flex-col items-center p-5 transition duration-300"
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
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
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
    })
  ).isRequired,
};

export default GymFeatures;
