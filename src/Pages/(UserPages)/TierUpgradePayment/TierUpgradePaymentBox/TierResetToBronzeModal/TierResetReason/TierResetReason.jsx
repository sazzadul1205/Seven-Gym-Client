import { useState } from "react";
import PropTypes from "prop-types";
import CommonButton from "../../../../../../Shared/Buttons/CommonButton";

const TierResetReason = ({ setRefundReason }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const predefinedReasons = [
    "I no longer need the current plan",
    "It's too expensive",
    "I am unsatisfied with the service",
    "I found a better alternative",
    "Custom reason", // Last option triggers custom input
  ];

  const handleReasonChange = (e) => {
    const value = e.target.value;
    if (value === "Custom reason") {
      setIsCustom(true);
      setSelectedReason("");
    } else {
      setIsCustom(false);
      setSelectedReason(value);
      setCustomInput("");
    }
  };

  const handleCustomChange = (e) => {
    setCustomInput(e.target.value);
  };

  const handleNext = () => {
    const finalReason = isCustom ? customInput.trim() : selectedReason;

    if (finalReason) {
      const refundData = {
        reason: finalReason,
      };

      setRefundReason(refundData);
    }
  };

  return (
    <div className="p-4">
      <p className="py-2 text-black font-semibold text-center text-lg">
        Please choose or enter your reason for downgrading.
      </p>

      <form className="pt-2 space-y-4">
        {/* Single Reason Input */}
        <div className="form-control w-full text-black space-y-2">
          <label className="label font-bold">
            <span className="label-text">Reason</span>
          </label>
          <select
            value={isCustom ? "Custom reason" : selectedReason}
            onChange={handleReasonChange}
            className="select select-bordered w-full bg-white border-black"
          >
            <option value="" disabled>
              Select or enter a reason
            </option>
            {predefinedReasons.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Reason Input (conditional) */}
        {isCustom && (
          <div className="form-control w-full text-black space-y-2">
            <label className="label font-bold">
              <span className="label-text">Custom Reason</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full bg-white border-black"
              placeholder="Type your custom reason here..."
              value={customInput}
              onChange={handleCustomChange}
            />
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-end">
          <CommonButton
            type="button"
            clickEvent={handleNext}
            text="Next"
            bgColor="emerald"
            px="px-10"
            py="py-2"
            width="auto"
            disabled={
              (!selectedReason && !isCustom) ||
              (isCustom && !customInput.trim())
            }
          />
        </div>
      </form>
    </div>
  );
};

TierResetReason.propTypes = {
  setRefundReason: PropTypes.func.isRequired,
};

export default TierResetReason;
