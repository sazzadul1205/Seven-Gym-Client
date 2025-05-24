import { useState } from "react";
import { ImCross } from "react-icons/im";

import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const AllTrainerManagementBan = ({ trainer }) => {
  const axiosPublic = useAxiosPublic();

  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("");
  const [customUnit, setCustomUnit] = useState("Days");
  const [customValue, setCustomValue] = useState("");

  const closeModal = () => document.getElementById("Trainer_Ban")?.close();

  const predefinedReasons = [
    "Violation of code of conduct",
    "Inappropriate behavior",
    "Unprofessional attitude",
    "Repeated no-shows",
    "Client complaints",
  ];

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

  const calculateEndDate = () => {
    const now = new Date();
    if (banDuration === "Permanent") return "Indefinite";

    let endDate = new Date(now);

    if (banDuration !== "Custom") {
      const value = parseInt(banDuration.slice(0, -1));
      const unit = banDuration.slice(-1);

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

    return endDate.toLocaleString();
  };

  const handleConfirmBan = async () => {
    const now = new Date();
    const ban = {
      Reason: banReason || "No reason provided",
      Duration:
        banDuration === "Custom" ? `${customValue} ${customUnit}` : banDuration,
      Start: now.toLocaleString(),
      End: calculateEndDate(),
    };

    try {
      const res = await axiosPublic.post(
        `/Trainers/AddBanElement/${trainer._id}`,
        ban
      );

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
      Swal.fire({
        icon: "error",
        title: "Ban Failed",
        text: error?.response?.data?.error || "Failed to apply ban.",
      });
    }

    closeModal();
  };

  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black max-h-[90vh] overflow-y-auto rounded-lg shadow-xl relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-300 bg-white">
        <h2 className="font-semibold text-xl">
          Ban Trainer: {trainer?.fullName || "Unnamed"}
        </h2>
        <ImCross
          className="hover:text-red-600 cursor-pointer"
          onClick={closeModal}
        />
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-5">
        {/* Reason input */}
        <div>
          <label className="block font-medium mb-1">
            Select or Write Ban Reason:
          </label>
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

        {/* Duration options */}
        <div>
          <label className="block font-medium mb-2">Ban Duration:</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {durationOptions.map((duration, idx) => (
              <button
                key={idx}
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

        {/* Custom duration input */}
        {banDuration === "Custom" && (
          <div>
            <h3 className="font-medium mb-1">Custom Duration</h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="input input-bordered w-1/2 bg-white border-gray-600 py-3"
                placeholder="Enter number"
              />
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

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-300 bg-white flex justify-end">
        <CommonButton
          clickEvent={handleConfirmBan}
          text="Confirm Ban"
          bgColor="DarkRed"
          px="px-4"
          py="py-2"
          borderRadius="rounded"
          textColor="text-white"
        />
      </div>
    </div>
  );
};

export default AllTrainerManagementBan;
