import { useState } from "react";
import PropTypes from "prop-types";
import CommonButton from "../../../../../../Shared/Buttons/CommonButton";

const TierResetReason = ({ setRefundReason }) => {
  // State for storing selected reason and custom complaint
  const [selectedReason, setSelectedReason] = useState("");
  const [customComplaint, setCustomComplaint] = useState("");

  // Predefined list of downgrade reasons
  const predefinedReasons = [
    "I no longer need the current plan",
    "It's too expensive",
    "I am unsatisfied with the service",
    "I found a better alternative",
  ];

  // Handles selection of predefined reason
  const handleReasonChange = (e) => {
    setSelectedReason(e.target.value);
  };

  // Handles input change for custom complaint
  const handleComplaintChange = (e) => {
    setCustomComplaint(e.target.value);
  };

  // Proceed to the next step if at least one input is provided
  const handleNext = () => {
    if (selectedReason || customComplaint.trim()) {
      setRefundReason({ reason: selectedReason, complaint: customComplaint });
    }
  };

  return (
    <div className="p-4">
      {/* Modal Description */}
      <p className="py-2 text-black font-semibold text-center text-lg">
        Please select a reason for downgrading your plan, or add a custom
        complaint below.
      </p>

      {/* Modal Form */}
      <form className="pt-2 space-y-4">
        {/* Reason Dropdown Selection */}
        <div className="form-control w-full text-black space-y-2">
          <label className="label font-bold">
            <span className="label-text">Reason for Downgrading</span>
          </label>
          <select
            value={selectedReason}
            onChange={handleReasonChange}
            className="select select-bordered w-full bg-white border-black"
          >
            <option value="" disabled>
              Select a reason
            </option>
            {predefinedReasons.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Complaint Input */}
        <div className="form-control w-full text-black space-y-2">
          <label className="label font-bold">
            <span className="label-text">Custom Complaint (optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black"
            placeholder="Type your complaint here..."
            value={customComplaint}
            onChange={handleComplaintChange}
          ></textarea>
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <CommonButton
            type="button"
            clickEvent={handleNext}
            text="Next"
            bgColor="emerald"
            textColor="text-xl font-semibold"
            px="px-10"
            py="py-2"
            width="auto"
            disabled={!selectedReason && !customComplaint.trim()}
          />
        </div>
      </form>
    </div>
  );
};

// PropTypes validation
TierResetReason.propTypes = {
  setRefundReason: PropTypes.func.isRequired,
};

export default TierResetReason;
