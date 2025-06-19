import { useRef, useState } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Modal
import ClassBookingFormModal from "./ClassBookingFormModal/ClassBookingFormModal";

// Reusable Pricing Card Component
const PriceCard = ({ title, price }) => (
  <div
    className="flex flex-col items-center text-center
      bg-gradient-to-bl from-white to-gray-400
      hover:bg-gradient-to-tr
      shadow-lg hover:shadow-2xl
      p-6 rounded-md
      transition-transform duration-500 hover:scale-105"
  >
    <h4 className="text-lg font-semibold text-black">{title}</h4>
    <p className="text-3xl font-extrabold text-gray-900 mt-3">${price}</p>
  </div>
);

PriceCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
};

const ClassesDetailsPrice = ({ ThisModule, user, UsersData }) => {
  const bookingModalRef = useRef(null);

  // Local State Management
  const [loading, setLoading] = useState(false);

  // Fee calculations
  const { dailyClassFee = 0 } = ThisModule || {};
  const updatedDailyFee = (dailyClassFee + 20).toFixed(2);
  const updatedWeeklyFee = (dailyClassFee * 7 + 20).toFixed(2);
  const updatedMonthlyFee = (dailyClassFee * 30 + 20).toFixed(2);
  const updatedYearlyFee = (dailyClassFee * 365 + 20).toFixed(2);

  // Modal controls
  const openBookingModal = () => {
    setLoading(true);
    if (bookingModalRef.current?.showModal) {
      bookingModalRef.current.showModal();
    } else {
      console.error("Modal not found or unsupported.");
    }
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <div className="bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-32 rounded-none md:rounded-xl shadow-inner">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center border-b-2 border-gray-100 pb-3">
        <h3 className="text-2xl text-white font-semibold">Detailed Prices</h3>
        <p className="px-10 py-2 bg-red-100 text-red-800 text-lg font-medium rounded-xl select-none">
          Price without Discount
        </p>
      </header>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 pt-3">
        <PriceCard title="Daily Class Fee" price={updatedDailyFee} />
        <PriceCard title="Weekly Fee" price={updatedWeeklyFee} />
        <PriceCard title="Monthly Fee" price={updatedMonthlyFee} />
        <PriceCard title="Yearly Fee" price={updatedYearlyFee} />
      </div>

      {/* Join Class Button */}
      <div className="flex justify-center py-2">
        {user && UsersData ? (
          <CommonButton
            clickEvent={openBookingModal}
            type="button"
            text="Join Class"
            isLoading={loading}
            loadingText="Preparing..."
            bgColor="OriginalRed"
            textColor="text-white"
            px="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-0"
            py="py-3"
            borderRadius="rounded-xl"
            cursorStyle="cursor-pointer"
            width="auto"
            className="shadow-md hover:shadow-lg transition-transform"
          />
        ) : (
          <CommonButton
            text="Login to Join Class"
            type="button"
            disabled
            bgColor="gray"
            textColor="text-gray-600"
            px="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-0"
            py="py-3"
            borderRadius="rounded-xl"
            cursorStyle="cursor-not-allowed"
            className="select-none"
          />
        )}
      </div>

      {/* Modal */}
      <dialog ref={bookingModalRef} id="Class_Booking_Modal" className="modal">
        <ClassBookingFormModal ThisModule={ThisModule} UsersData={UsersData} />
      </dialog>
    </div>
  );
};

// Prop Validation
ClassesDetailsPrice.propTypes = {
  ThisModule: PropTypes.shape({
    dailyClassFee: PropTypes.number,
  }),
  user: PropTypes.object,
  UsersData: PropTypes.object,
};

export default ClassesDetailsPrice;
