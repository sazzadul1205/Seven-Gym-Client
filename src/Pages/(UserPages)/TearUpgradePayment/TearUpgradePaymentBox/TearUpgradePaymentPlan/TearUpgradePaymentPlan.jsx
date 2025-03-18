import PropTypes from "prop-types";
import TUPCalender from "../../../../../assets/Tear-Upgrade-Plan/TUPCalendar.png";
import TUPHourglass from "../../../../../assets/Tear-Upgrade-Plan/TUPHourglass.png";
import TUPTrophy from "../../../../../assets/Tear-Upgrade-Plan/TUPTrophy.png";

// Define the available plans
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

const TearUpgradePaymentPlan = ({
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
    <div className="bg-white/80 px-2">
      {/* Plan Title */}
      <h2 className="text-3xl font-bold text-center text-gray-800 py-2">
        Select Your Preferred Plan
      </h2>

      <div className="bg-black p-[1px] w-1/2 mx-auto"></div>

      {/* Plan Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
        {plans.map((option, index) => {
          const isSelected = selectedDuration?.duration === option.duration;
          const totalPrice = (CurrentTierData?.price || 0) * option.multiplier;
          const expirationDate = calculateExpirationDate(option.months);

          return (
            <div
              key={index}
              className={`px-6 py-8 border-4 rounded-xl shadow-lg bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-400 transition-all duration-300 cursor-pointer 
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
              <div className="flex flex-col items-center gap-4 border-b border-t border-gray-300 py-4">
                <img src={option.icon} alt={option.name} className="w-16" />
                <div className="text-center">
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

              {/* Expiration Date */}
              <p className="text-xs text-gray-500 text-center mt-2">
                Expires on: {expirationDate}
              </p>
            </div>
          );
        })}
      </div>
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
