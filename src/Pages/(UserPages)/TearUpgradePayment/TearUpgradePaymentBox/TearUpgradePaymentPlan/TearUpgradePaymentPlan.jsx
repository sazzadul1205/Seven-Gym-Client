import PropTypes from "prop-types";
import {
  AiFillCalendar,
  AiOutlineHourglass,
  AiFillTrophy,
} from "react-icons/ai"; // Using React Icons

import TUPCalender from "../../../../../assets/Tear-Upgrade-Plan/TUPCalendar.png";

const plans = [
  {
    name: "Basic Plan",
    duration: "1 Month",
    multiplier: 1,
    icon: <AiFillCalendar size={48} className="text-blue-500" />,
    description: "Perfect for short-term needs.",
  },
  {
    name: "Value Plan",
    duration: "5 Months",
    multiplier: 4.8,
    icon: <AiOutlineHourglass size={48} className="text-green-500" />,
    description: "Great value for medium-term plans.",
  },
  {
    name: "Premium Plan",
    duration: "12 Months",
    multiplier: 11.5,
    icon: <AiFillTrophy size={48} className="text-yellow-500" />,
    description: "Best for long-term commitment.",
  },
];

const TearUpgradePaymentPlan = ({
  CurrentTierData,
  selectedDuration,
  setSelectedDuration,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((option, index) => {
        const isSelected = selectedDuration?.duration === option.duration;
        const totalPrice = (CurrentTierData?.price || 0) * option.multiplier;

        return (
          <div
            key={index}
            className={`px-6 py-8 border-4 rounded-xl shadow-lg bg-white transition-all duration-300 cursor-pointer 
              ${
                isSelected
                  ? "border-blue-500 shadow-2xl scale-105"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-xl"
              }`}
            onClick={() =>
              setSelectedDuration({
                duration: option.duration,
                name: option.name,
                totalPrice,
              })
            }
          >
            {/* Plan Title */}
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              {option.name}
            </h2>

            {/* Icon & Plan Details */}
            <div className="flex items-center gap-4 border-b border-t border-gray-300 py-4">
              {option.icon}
              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  {option.duration}
                </h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>

            {/* Price */}
            <p className="text-lg font-bold text-gray-800 text-center mt-2">
              Price: ${totalPrice.toFixed(2)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

TearUpgradePaymentPlan.propTypes = {
  CurrentTierData: PropTypes.shape({
    price: PropTypes.number,
  }),
  selectedDuration: PropTypes.shape({
    duration: PropTypes.string,
    name: PropTypes.string,
    totalPrice: PropTypes.number,
  }),
  setSelectedDuration: PropTypes.func.isRequired,
};

export default TearUpgradePaymentPlan;
