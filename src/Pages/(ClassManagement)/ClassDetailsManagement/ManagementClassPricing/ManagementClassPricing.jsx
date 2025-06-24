import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icons
import { IoSettings } from "react-icons/io5";

// Import Component
import { PriceCard } from "../../../(PublicPages)/(Classes)/ClassesDetails/ClassesDetailsPrice/ClassesDetailsPrice";

const ManagementClassPricing = ({ selectedClass }) => {
  // Fee calculations
  const { dailyClassFee = 0 } = selectedClass || {};
  const updatedDailyFee = (dailyClassFee + 20).toFixed(2);
  const updatedWeeklyFee = (dailyClassFee * 7 + 20).toFixed(2);
  const updatedMonthlyFee = (dailyClassFee * 30 + 20).toFixed(2);
  const updatedYearlyFee = (dailyClassFee * 365 + 20).toFixed(2);

  return (
    <div className="relative bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-10 rounded-none md:rounded-xl shadow-inner">
      {/* Settings Icon (Top Left) */}
      <>
        <div
          className="absolute top-2 right-2 bg-gray-600/90 p-3 rounded-full cursor-pointer "
          data-tooltip-id="Class_Pricing_Edit"
          onClick={() =>
            document.getElementById("Class_Pricing_Edit_Modal").showModal()
          }
        >
          <IoSettings className="text-red-500 text-3xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </div>
        <Tooltip
          id="Class_Pricing_Edit"
          place="top"
          className="z-50"
          content="Edit Class Pricing "
        />
      </>

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
    </div>
  );
};

// Prop Validation
ManagementClassPricing.propTypes = {
  selectedClass: PropTypes.shape({
    dailyClassFee: PropTypes.number,
  }),
};

export default ManagementClassPricing;
