/* eslint-disable react/prop-types */

const CDContent = ({ ThisModule }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 bg-white rounded-lg -mt-16 relative z-10 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
              Description
            </h3>
            <p className="text-gray-600 mt-2">{ThisModule.description}</p>
          </div>

          {/* Additional Info */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
              Additional Info
            </h3>
            <p className="text-gray-600 mt-2">{ThisModule.additionalInfo}</p>
          </div>

          {/* Difficulty Level */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
              Difficulty Level
            </h3>
            <p className="text-gray-600 mt-2">{ThisModule.difficultyLevel}</p>
          </div>

          {/* Prerequisites */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
              Prerequisites
            </h3>
            <p className="text-gray-600 mt-2">{ThisModule.prerequisites}</p>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex flex-col items-center border-2 border-dotted border-gray-200 rounded-lg p-6 bg-gray-50 shadow-inner hover:scale-105">
          <img
            src={ThisModule.icon}
            alt={ThisModule.module}
            className="w-20 h-20 md:w-24 md:h-24 object-cover mb-4"
          />
          <p className="text-lg font-medium text-gray-700 text-center">
            Module: <span className="text-gray-900">{ThisModule.module}</span>
          </p>
          <p className="text-gray-600 mt-2 text-center">
            Explore and enjoy this exciting and engaging activity tailored for
            all!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CDContent;
