/* eslint-disable react/prop-types */

const CDPrice = ({ ThisModule }) => {
  return (
    <div className="mt-8 p-6 bg-gray-200 rounded-lg shadow-inner max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-lg font-medium text-gray-700">
            <span className="font-bold">Registration Fee:</span> $
            {ThisModule.registrationFee}
          </p>
          <p className="text-lg font-medium text-gray-700 mt-2">
            <span className="font-bold">Daily Class Fee:</span> $
            {ThisModule.dailyClassFee}
          </p>
        </div>
        <button className="px-10 py-3 border-2 border-[#F72C5B] hover:bg-[#F72C5B] hover:text-white rounded-lg font-bold">
          Join Class
        </button>
      </div>
    </div>
  );
};

export default CDPrice;
