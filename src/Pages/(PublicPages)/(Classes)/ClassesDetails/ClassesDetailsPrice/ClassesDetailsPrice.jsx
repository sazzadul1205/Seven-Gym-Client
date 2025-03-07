import PropTypes from "prop-types";

import ClassBookingFormModal from "./ClassBookingFormModal/ClassBookingFormModal";

// Component to display detailed pricing information for classes
const ClassesDetailsPrice = ({ ThisModule, user, UsersData }) => {
  // Destructure ThisModule properties with default values
  const { dailyClassFee = 0 } = ThisModule || {};

  // Calculate fees without discount and add an extra $20 to each field
  const updatedDailyFee = (dailyClassFee + 20).toFixed(2);
  const updatedWeeklyFee = (dailyClassFee * 7 + 20).toFixed(2);
  const updatedMonthlyFee = (dailyClassFee * 30 + 20).toFixed(2);
  const updatedYearlyFee = (dailyClassFee * 365 + 20).toFixed(2);

  // Handle the Join Class button click by showing the modal
  const handleJoinClass = () => {
    const modal = document.getElementById("Class_Booking_Modal");
    if (modal && typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      console.error(
        "Modal element not found or showModal method is not supported."
      );
    }
  };

  return (
    <div className="max-w-7xl bg-gradient-to-bl from-gray-200 to-gray-400 rounded-lg shadow-lg mx-auto p-6">
      {/* Header Section: Title on the left and tag on the right */}
      <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">
          Detailed Prices
        </h3>
        {/* Tag indicating an extra $20 is added on top of all fees */}
        <div className="mt-2">
          <p className="px-5 py-1 bg-blue-100 text-blue-800 text-lg font-medium rounded-full hover:scale-105 transform transition-all duration-300">
            Price without Discount
          </p>
        </div>
      </div>

      {/* Pricing Details Grid for Daily, Weekly, Monthly, and Yearly Fees */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center pt-2">
        {/* Daily Class Fee */}
        <div className="flex flex-col items-center text-center border border-black bg-linear-to-bl hover:bg-linear-to-tr from-gray-400 to-gray-300 shadow-lg hover:shadow-2xl p-4">
          <h4 className="text-lg font-semibold text-gray-700">
            Daily Class Fee
          </h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${updatedDailyFee}
          </p>
        </div>

        {/* Weekly Class Fee */}
        <div className="flex flex-col items-center text-center border border-black bg-linear-to-bl hover:bg-linear-to-tr from-gray-400 to-gray-300 shadow-lg hover:shadow-2xl p-4">
          <h4 className="text-lg font-semibold text-gray-700">Weekly Fee</h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${updatedWeeklyFee}
          </p>
        </div>

        {/* Monthly Class Fee */}
        <div className="flex flex-col items-center text-center border border-black bg-linear-to-bl hover:bg-linear-to-tr from-gray-400 to-gray-300 shadow-lg hover:shadow-2xl p-4">
          <h4 className="text-lg font-semibold text-gray-700">Monthly Fee</h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${updatedMonthlyFee}
          </p>
        </div>

        {/* Yearly Class Fee */}
        <div className="flex flex-col items-center text-center border border-black bg-linear-to-bl hover:bg-linear-to-tr from-gray-400 to-gray-300 shadow-lg hover:shadow-2xl p-4">
          <h4 className="text-lg font-semibold text-gray-700">Yearly Fee</h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${updatedYearlyFee}
          </p>
        </div>
      </div>

      {/* Join Class Button */}
      <div className="flex justify-center mt-5">
        <button
          onClick={handleJoinClass}
          className="w-1/4 border-2 border-red-500 bg-linear-to-tl hover:bg-linear-to-br from-[#c23e5f] to-[#ff0040] py-2 font-semibold rounded-xl hover:text-white"
        >
          Join Class
        </button>
      </div>

      {/* Module Details Modal */}
      <dialog id="Class_Booking_Modal" className="modal">
        <ClassBookingFormModal
          ThisModule={ThisModule}
          user={user}
          UsersData={UsersData}
        />
      </dialog>
    </div>
  );
};

// Define expected prop types for the component
ClassesDetailsPrice.propTypes = {
  ThisModule: PropTypes.shape({
    dailyClassFee: PropTypes.number,
  }),
  user: PropTypes.object, // Further shape validation can be added if needed
  UsersData: PropTypes.object, // Further shape validation can be added if needed
};

export default ClassesDetailsPrice;
