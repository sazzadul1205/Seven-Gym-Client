import { useState } from "react";

const TierResetReason = ({ onReasonSelect }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customComplaint, setCustomComplaint] = useState("");

  const predefinedReasons = [
    "I no longer need the current plan",
    "It's too expensive",
    "I am unsatisfied with the service",
    "I found a better alternative",
  ];

  const handleNext = () => {
    if (selectedReason || customComplaint.trim()) {
      onReasonSelect({ reason: selectedReason, complaint: customComplaint });
    }
  };

  return (
    <div className="p-4">
      {/* Modal Description */}
      <p className="py-2 text-black font-semibold text-center text-lg">
        Please select a reason for downgrading your plan, or add a custom
        complaint below.
      </p>

      <form className="pt-2 space-y-4">
        {/* Select Reason */}
        <div className="form-control w-full text-black space-y-2">
          <label className="label font-bold">
            <span className="label-text">Reason for Downgrading</span>
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="select select-bordered w-full bg-white border-black"
            required
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

        {/* Custom Complaint */}
        <div className="form-control w-full text-black space-y-2">
          <label className="label font-bold">
            <span className="label-text">Custom Complaint (optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black"
            placeholder="Type your complaint here..."
            value={customComplaint}
            onChange={(e) => setCustomComplaint(e.target.value)}
          ></textarea>
        </div>

        {/* Next Button */}
        <div className="flex justify-end py-4">
          <button
            type="button"
            className={`rounded-xl text-xl font-semibold px-10 py-2 cursor-pointer ${
              selectedReason || customComplaint.trim()
                ? "bg-gradient-to-bl hover:bg-gradient-to-tr from-emerald-300 to-emerald-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleNext}
            disabled={!selectedReason && !customComplaint.trim()}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default TierResetReason;
