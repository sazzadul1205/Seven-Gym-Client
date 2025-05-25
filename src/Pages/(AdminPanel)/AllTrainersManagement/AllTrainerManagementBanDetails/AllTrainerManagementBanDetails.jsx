// Import React Hook
import { useState } from "react";

// Import Type Checking for Props
import PropTypes from "prop-types";

// Import Required Icons
import {
  FaBan,
  FaCalendarAlt,
  FaCheck,
  FaRegClock,
  FaStopwatch,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Import Reusable CommonButton component
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Custom Axios Hook
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Trainer Ban Details Modal Component
const AllTrainerManagementBanDetails = ({ trainer, Refetch }) => {
  // State for handling loading state during UnBan action
  const [isProcessing, setIsProcessing] = useState(false);

  // Custom Axios instance for making public API requests
  const axiosPublic = useAxiosPublic();

  // Function to close the modal
  const closeModal = () =>
    document.getElementById(`Trainer_UnBan_Details_${trainer._id}`)?.close();

  // Handler function to UnBan the trainer
  const handleUnBan = async () => {
    setIsProcessing(true);
    try {
      // Make PATCH request to UnBan the trainer
      await axiosPublic.patch(`/Trainers/UnBan/${trainer._id}`);
      Refetch();
      closeModal();
    } catch (error) {
      // Log any error that occurs during the API call
      console.error("Failed to UnBan trainer:", error);
      alert("Error: Could not UnBan trainer. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black max-w-lg mx-auto mt-10 shadow-xl rounded-lg overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 border-b">
        <h2 className="font-semibold text-xl">
          Trainer: {trainer?.name || "Unnamed"}&apos;s Ban Details
        </h2>
        {/* Close button (X icon) */}
        <ImCross
          className="text-xl hover:text-red-600 cursor-pointer"
          onClick={closeModal}
        />
      </div>

      {/* Ban Details Section */}
      <div className="px-6 py-4 space-y-4">
        {trainer?.ban ? (
          // If ban data exists, display details
          [
            {
              label: "Reason",
              value: trainer?.ban?.Reason,
              icon: (
                <FaBan
                  key="icon-reason"
                  className="text-red-600 text-2xl mr-2"
                />
              ),
            },
            {
              label: "Duration",
              value: trainer?.ban?.Duration,
              icon: (
                <FaStopwatch
                  key="icon-duration"
                  className="text-yellow-600 text-2xl mr-2"
                />
              ),
            },
            {
              label: "Start Time",
              value: trainer?.ban?.Start,
              icon: (
                <FaCalendarAlt
                  key="icon-start"
                  className="text-blue-600 text-2xl mr-2"
                />
              ),
            },
            {
              label: "End Time",
              value: trainer?.ban?.End,
              icon: (
                <FaRegClock
                  key="icon-end"
                  className="text-green-600 text-2xl mr-2"
                />
              ),
            },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center justify-between">
              {/* Label with icon */}
              <div className="flex items-center font-medium">
                {icon}
                {label}:
              </div>
              {/* Value displayed on the right */}
              <span>{value}</span>
            </div>
          ))
        ) : (
          // Fallback if no ban data is available
          <p className="text-red-600 font-semibold">
            No ban details available.
          </p>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between p-5">
        {/* Cancel Button */}
        <CommonButton
          clickEvent={closeModal}
          text="Cancel"
          bgColor="gray"
          px="px-5"
          py="py-3"
          borderRadius="rounded-lg"
        />

        {/* UnBan Trainer Button */}
        <CommonButton
          clickEvent={handleUnBan}
          text="UnBan Trainer"
          isLoading={isProcessing}
          loadingText="Unbanning..."
          px="px-10"
          py="py-3"
          bgColor="green"
          icon={<FaCheck />}
        />
      </div>
    </div>
  );
};

// Define PropTypes for safety and clarity
AllTrainerManagementBanDetails.propTypes = {
  trainer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    ban: PropTypes.shape({
      Reason: PropTypes.string,
      Duration: PropTypes.string,
      Start: PropTypes.string,
      End: PropTypes.string,
    }),
  }),
  Refetch: PropTypes.func.isRequired,
};

// Export the component
export default AllTrainerManagementBanDetails;
