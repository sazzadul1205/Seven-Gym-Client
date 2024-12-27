/* eslint-disable react/prop-types */
const CDPrice = ({ ThisModule }) => {
  // Calculate weekly and monthly fees based on the daily class fee
  const dailyClassFee = ThisModule?.dailyClassFee || 0;
  const weeklyClassFee = (dailyClassFee * 7 * 0.9).toFixed(2); // 10% discount
  const monthlyClassFee = (dailyClassFee * 30 * 0.7).toFixed(2); // 30% discount

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-7xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-800 py-2">
        Detailed Prices
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Registration Fee */}
        <div className="flex flex-col items-center text-center bg-gray-100 p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-700">
            Registration Fee
          </h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${ThisModule?.registrationFee || "0"}
          </p>
        </div>

        {/* Daily Class Fee */}
        <div className="flex flex-col items-center text-center bg-gray-100 p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-700">
            Daily Class Fee
          </h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${dailyClassFee.toFixed(2)}
          </p>
        </div>

        {/* Weekly Class Fee */}
        <div className="flex flex-col items-center text-center bg-gray-100 p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-700">
            Weekly Class Fee
          </h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${weeklyClassFee}
          </p>
        </div>

        {/* Monthly Class Fee */}
        <div className="flex flex-col items-center text-center bg-gray-100 p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-700">
            Monthly Class Fee
          </h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${monthlyClassFee}
          </p>
        </div>
      </div>

      {/* Join Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => document.getElementById("my_modal_2").showModal()}
          className="px-24 py-2 bg-[#F72C5B] text-white text-lg font-bold rounded-lg shadow-md hover:bg-[#f72c5b83] hover:shadow-lg transition-all"
        >
          Join Class
        </button>
      </div>
    </div>
  );
};

export default CDPrice;
