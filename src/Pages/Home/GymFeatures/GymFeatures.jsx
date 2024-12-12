/* eslint-disable react/prop-types */
import Title from "../../../Shared/Componenet/Title";

const GymFeatures = ({ gymFeaturesData }) => {
  return (
    <div className="py-16">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent={"Gym Features"} />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-8 mt-6 md:mt-11">
          {gymFeaturesData.map((feature) => (
            <div
              key={feature._id}
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-110"
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GymFeatures;
