import { useState } from "react";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const AllTrainerManagementBan = ({ trainer, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State to hold ban reason input by user
  const [banReason, setBanReason] = useState("");

  // State to hold selected ban duration (e.g., "7D", "Permanent", "Custom")
  const [banDuration, setBanDuration] = useState("");

  // State and value for custom duration unit and value if "Custom" duration is chosen
  const [customUnit, setCustomUnit] = useState("Days");
  const [customValue, setCustomValue] = useState("");

  // Close modal by targeting its ID and calling close()
  const closeModal = () => document.getElementById("Trainer_Ban")?.close();

  // Predefined reasons user can select from for banning
  const predefinedReasons = [
    "Violation of code of conduct",
    "Inappropriate behavior",
    "Unprofessional attitude",
    "Repeated no-shows",
    "Client complaints",
  ];

  // Duration options user can select from including "Custom" and "Permanent"
  const durationOptions = [
    "1D",
    "7D",
    "2W",
    "4W",
    "3M",
    "6M",
    "12M",
    "2Y",
    "Permanent",
    "Custom",
  ];

  // Calculate end date of ban based on selected duration or custom input
  const calculateEndDate = () => {
    const now = new Date();

    // If permanent, return string representing indefinite ban
    if (banDuration === "Permanent") return "Indefinite";

    let endDate = new Date(now);

    if (banDuration !== "Custom") {
      // Extract numeric value and unit (D/W/M/Y) from predefined duration string
      const value = parseInt(banDuration.slice(0, -1));
      const unit = banDuration.slice(-1);

      // Add corresponding time to now based on unit
      switch (unit) {
        case "D":
          endDate.setDate(endDate.getDate() + value);
          break;
        case "W":
          endDate.setDate(endDate.getDate() + value * 7);
          break;
        case "M":
          endDate.setMonth(endDate.getMonth() + value);
          break;
        case "Y":
          endDate.setFullYear(endDate.getFullYear() + value);
          break;
      }
    } else {
      // For custom duration, validate input and add time based on customUnit
      const val = parseInt(customValue);
      if (isNaN(val) || val <= 0) return "Invalid custom duration";

      switch (customUnit) {
        case "Days":
          endDate.setDate(endDate.getDate() + val);
          break;
        case "Weeks":
          endDate.setDate(endDate.getDate() + val * 7);
          break;
        case "Months":
          endDate.setMonth(endDate.getMonth() + val);
          break;
        case "Years":
          endDate.setFullYear(endDate.getFullYear() + val);
          break;
      }
    }

    // Return the calculated end date as a formatted string
    return endDate.toLocaleString();
  };

  // Function to handle confirming the ban action
  const handleConfirmBan = async () => {
    const now = new Date();

    // Create ban object payload for API
    const ban = {
      Reason: banReason || "No reason provided",
      Duration:
        banDuration === "Custom" ? `${customValue} ${customUnit}` : banDuration,
      Start: now.toLocaleString(),
      End: calculateEndDate(),
    };

    try {
      // Send ban data to server for specific trainer by ID
      const res = await axiosPublic.post(
        `/Trainers/AddBanElement/${trainer._id}`,
        ban
      );

      // Check server response and notify user accordingly
      if (res.data?.message === "Ban added successfully.") {
        Swal.fire({
          icon: "success",
          title: "Trainer Banned",
          text: "Ban has been successfully recorded.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Unexpected Response",
          text: res.data?.error || "Unknown error occurred.",
        });
      }
    } catch (error) {
      // Handle network or server errors during API call
      Swal.fire({
        icon: "error",
        title: "Ban Failed",
        text: error?.response?.data?.error || "Failed to apply ban.",
      });
    }

    // Close the modal regardless of success or failure
    closeModal();
    Refetch();
  };

  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black max-h-[90vh] overflow-y-auto rounded-lg shadow-xl relative">
      {/* Header: Title with trainer name and close button */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-300 bg-white">
        <h2 className="font-semibold text-xl">
          Ban Trainer: {trainer?.name || "Unnamed"}
        </h2>
        {/* Close icon triggers modal close */}
        <ImCross
          className="hover:text-red-600 cursor-pointer"
          onClick={closeModal}
        />
      </div>

      {/* Body: Contains form inputs for ban reason and duration */}
      <div className="px-5 py-4 space-y-5">
        {/* Ban Reason Input with predefined suggestions */}
        <div>
          <label className="block font-medium mb-1">
            Select or Write Ban Reason:
          </label>
          {/* Input field with datalist for quick predefined reasons */}
          <input
            list="predefined-reasons"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            className="input input-bordered w-full bg-white border-gray-600 py-3"
            placeholder="Choose or type your own reason"
          />
          <datalist id="predefined-reasons">
            {predefinedReasons.map((reason, idx) => (
              <option key={idx} value={reason} />
            ))}
          </datalist>
        </div>

        {/* Ban Duration Selection Buttons */}
        <div>
          <label className="block font-medium mb-2">Ban Duration:</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {durationOptions.map((duration, idx) => (
              <button
                key={idx}
                // Highlight selected duration with different styles
                className={`border rounded py-2 px-3 text-sm cursor-pointer ${
                  banDuration === duration
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-blue-300"
                }`}
                onClick={() => setBanDuration(duration)}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Duration Input Fields: only show if "Custom" selected */}
        {banDuration === "Custom" && (
          <div>
            <h3 className="font-medium mb-1">Custom Duration</h3>
            <div className="flex gap-2">
              {/* Number input for custom duration value */}
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="input input-bordered w-1/2 bg-white border-gray-600 py-3"
                placeholder="Enter number"
              />
              {/* Dropdown for custom duration unit */}
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                className="p-2 w-1/2 bg-white border border-gray-300 rounded"
              >
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Confirm ban button */}
      <div className=" p-5 flex justify-end">
        <CommonButton
          clickEvent={handleConfirmBan} // Trigger ban confirmation
          text="Confirm Ban"
          bgColor="DarkRed"
          px="px-10"
          py="py-3"
          borderRadius="rounded-xl"
          textColor="text-white"
        />
      </div>
    </div>
  );
};

AllTrainerManagementBan.propTypes = {
  trainer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
  Refetch: PropTypes.func.isRequired,
};

export default AllTrainerManagementBan;
