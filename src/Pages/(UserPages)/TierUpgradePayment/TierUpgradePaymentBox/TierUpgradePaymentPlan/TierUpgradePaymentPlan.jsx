import PropTypes from "prop-types";

// Import Icons
import TUPCalender from "../../../../../assets/Tear-Upgrade-Plan/TUPCalendar.png";
import TUPHourglass from "../../../../../assets/Tear-Upgrade-Plan/TUPHourglass.png";
import TUPTrophy from "../../../../../assets/Tear-Upgrade-Plan/TUPTrophy.png";

// Available plans
const plans = [
  {
    name: "Basic Plan",
    duration: "1 Month",
    multiplier: 1,
    icon: TUPCalender,
    description: "Perfect for short-term needs.",
    months: 1,
  },
  {
    name: "Value Plan",
    duration: "6 Months",
    multiplier: 5.8,
    icon: TUPHourglass,
    description: "Great value for medium-term plans.",
    months: 6,
  },
  {
    name: "Premium Plan",
    duration: "12 Months",
    multiplier: 11.5,
    icon: TUPTrophy,
    description: "Best for long-term commitment.",
    months: 12,
  },
];

const TierUpgradePaymentPlan = ({
  CurrentTierData,
  selectedDuration,
  setSelectedDuration,
}) => {
  const calculateExpirationDate = (months) => {
    const today = new Date();
    today.setMonth(today.getMonth() + months);
    return today.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white/90 px-4 py-6 rounded-md shadow-md">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
        Select Your Preferred Plan
      </h2>

      {/* Divider */}
      <div className="h-[2px] bg-gradient-to-r from-blue-500 via-gray-500 to-blue-500 w-2/3 max-w-xs mx-auto mb-6" />

      {/* Plan Options */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((option, index) => {
          const isSelected = selectedDuration?.duration === option.duration;
          const totalPrice = (CurrentTierData?.price || 0) * option.multiplier;
          const expirationDate = calculateExpirationDate(option.months);

          return (
            <div
              key={index}
              onClick={() =>
                setSelectedDuration({
                  duration: option.duration,
                  name: option.name,
                  totalPrice,
                })
              }
              className={`cursor-pointer rounded-xl p-5 shadow transition-all duration-300 hover:scale-[1.02]
              ${
                isSelected
                  ? "border-4 border-blue-600 bg-blue-50 shadow-xl"
                  : "border border-gray-300 bg-white hover:border-blue-400"
              }`}
            >
              {/* Title */}
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                {option.name}
              </h3>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <img
                  src={option.icon}
                  alt={option.name}
                  className="w-12 sm:w-16"
                />
              </div>

              {/* Duration & Description */}
              <div className="text-center mb-4">
                <p className="text-blue-700 font-medium text-sm sm:text-base">
                  {option.duration}
                </p>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mt-4">
                <p className="text-lg font-bold text-gray-800">
                  ${totalPrice.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Expires on:{" "}
                  <span className="font-medium">{expirationDate}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

TierUpgradePaymentPlan.propTypes = {
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

export default TierUpgradePaymentPlan;
