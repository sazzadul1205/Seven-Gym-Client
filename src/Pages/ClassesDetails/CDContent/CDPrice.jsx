/* eslint-disable react/prop-types */
const CDPrice = ({ ThisModule }) => {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 items-center justify-between mt-4">
        <p className="text-xl font-medium text-gray-700">
          <span className="font-bold">Registration Fee:</span> $
          {ThisModule.registrationFee}
        </p>
        <p className="text-xl font-medium text-gray-700 mt-2">
          <span className="font-bold">Daily Class Fee:</span> $
          {ThisModule.dailyClassFee}
        </p>
        <button className="px-10 py-3 border-2 border-[#F72C5B] hover:bg-[#F72C5B] hover:text-white rounded-lg font-bold">
          Join Class
        </button>
      </div>
    </div>
  );
};

export default CDPrice;
