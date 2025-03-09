import PropTypes from "prop-types";
import ClassBookingFormModal from "./ClassBookingFormModal/ClassBookingFormModal";

// Reusable Pricing Card Component
const PriceCard = ({ title, price }) => (
  <div className="flex flex-col items-center text-center border border-black bg-gradient-to-bl from-gray-400 to-gray-300 shadow-lg hover:shadow-2xl p-4 rounded-md transition-transform duration-300 hover:scale-105">
    <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
    <p className="text-2xl font-bold text-gray-900 mt-2">${price}</p>
  </div>
);

PriceCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
};

const ClassesDetailsPrice = ({ ThisModule, user, UsersData }) => {
  // Destructure properties with default values
  const { dailyClassFee = 0 } = ThisModule || {};

  // Calculate fees with an extra $20 added
  const updatedDailyFee = (dailyClassFee + 20).toFixed(2);
  const updatedWeeklyFee = (dailyClassFee * 7 + 20).toFixed(2);
  const updatedMonthlyFee = (dailyClassFee * 30 + 20).toFixed(2);
  const updatedYearlyFee = (dailyClassFee * 365 + 20).toFixed(2);

  // Handle Join Class button click
  const handleJoinClass = () => {
    const modal = document.getElementById("Class_Booking_Modal");
    if (modal?.showModal) {
      modal.showModal();
    } else {
      console.error("Modal not found or showModal method is not supported.");
    }
  };

  return (
    <div className="max-w-7xl bg-gradient-to-bl from-gray-200 to-gray-400 rounded-lg shadow-lg mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 border-b-2 border-gray-100 pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">
          Detailed Prices
        </h3>
        <p className="px-5 py-1 bg-blue-100 text-blue-800 text-lg font-medium rounded-full hover:scale-105 transform transition-all duration-300">
          Price without Discount
        </p>
      </div>

      {/* Pricing Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center pt-2">
        <PriceCard title="Daily Class Fee" price={updatedDailyFee} />
        <PriceCard title="Weekly Fee" price={updatedWeeklyFee} />
        <PriceCard title="Monthly Fee" price={updatedMonthlyFee} />
        <PriceCard title="Yearly Fee" price={updatedYearlyFee} />
      </div>

      {/* Join Class Button */}
      <div className="flex justify-center mt-5">
        {user && UsersData ? (
          <button
            onClick={handleJoinClass}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border-2 border-red-500 bg-linear-to-tl hover:bg-linear-to-br from-[#c23e5f] to-[#ff0040] py-2 font-semibold rounded-xl hover:text-white"
          >
            Join Class
          </button>
        ) : (
          <button
            disabled
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border-2 border-gray-400 bg-gray-300 py-2 font-semibold rounded-xl cursor-not-allowed"
          >
            Login to Join Class
          </button>
        )}
      </div>

      {/* Class Booking Modal */}
      {user && UsersData && (
        <dialog id="Class_Booking_Modal" className="modal">
          <ClassBookingFormModal
            ThisModule={ThisModule}
            user={user}
            UsersData={UsersData}
          />
        </dialog>
      )}
    </div>
  );
};

// PropTypes validation
ClassesDetailsPrice.propTypes = {
  ThisModule: PropTypes.shape({
    dailyClassFee: PropTypes.number,
  }),
  user: PropTypes.object, // You can add a more specific shape if needed
  UsersData: PropTypes.object, // You can add a more specific shape if needed
};

export default ClassesDetailsPrice;
