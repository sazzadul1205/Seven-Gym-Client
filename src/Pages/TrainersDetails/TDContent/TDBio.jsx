/* eslint-disable react/prop-types */
const TDBio = ({ TrainerDetails }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        About {TrainerDetails.name}
      </h2>
      <p className="text-lg text-gray-700 mb-6">{TrainerDetails.bio}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Experience */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-xl text-gray-800">Experience</h3>
          <p className="text-lg text-gray-600">
            {TrainerDetails.experience} years
          </p>
        </div>

        {/* Age */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-xl text-gray-800">Age</h3>
          <p className="text-lg text-gray-600">{TrainerDetails.age} years</p>
        </div>

        {/* Gender */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-xl text-gray-800">Gender</h3>
          <p className="text-lg text-gray-600">{TrainerDetails.gender}</p>
        </div>

        {/* Available Days */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-xl text-gray-800">
            Available Days
          </h3>
          <p className="text-lg text-gray-600">
            {TrainerDetails.availableDays.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TDBio;
