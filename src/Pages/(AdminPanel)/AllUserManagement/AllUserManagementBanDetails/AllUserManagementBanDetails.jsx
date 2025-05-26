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

const AllUserManagementBanDetails = ({ user, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State for handling loading state during UnBan action
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to close the modal
  const closeModal = () =>
    document.getElementById(`Users_UnBan_Details_${user._id}`)?.close();

  // Handler function to UnBan the user
  const handleUnBan = async () => {
    setIsProcessing(true);
    try {
      // Make PATCH request to UnBan the user
      await axiosPublic.patch(`/Users/UnBan/${user._id}`);
      Refetch();
      closeModal();
    } catch (error) {
      // Log any error that occurs during the API call
      console.error("Failed to UnBan user:", error);
      alert("Error: Could not UnBan user. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black max-w-lg mx-auto mt-10 shadow-xl rounded-lg overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 border-b">
        <h2 className="font-semibold text-xl">
          user: {user?.name || "Unnamed"}&apos;s Ban Details
        </h2>
        {/* Close button (X icon) */}
        <ImCross
          className="text-xl hover:text-red-600 cursor-pointer"
          onClick={closeModal}
        />
      </div>

      {/* Ban Details Section */}
      <div className="px-6 py-4 space-y-4">
        {user?.ban ? (
          // If ban data exists, display details
          [
            {
              label: "Reason",
              value: user?.ban?.Reason,
              icon: (
                <FaBan
                  key="icon-reason"
                  className="text-red-600 text-2xl mr-2"
                />
              ),
            },
            {
              label: "Duration",
              value: user?.ban?.Duration,
              icon: (
                <FaStopwatch
                  key="icon-duration"
                  className="text-yellow-600 text-2xl mr-2"
                />
              ),
            },
            {
              label: "Start Time",
              value: user?.ban?.Start,
              icon: (
                <FaCalendarAlt
                  key="icon-start"
                  className="text-blue-600 text-2xl mr-2"
                />
              ),
            },
            {
              label: "End Time",
              value: user?.ban?.End,
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

        {/* UnBan user Button */}
        <CommonButton
          clickEvent={handleUnBan}
          text="UnBan user"
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
AllUserManagementBanDetails.propTypes = {
  user: PropTypes.shape({
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

export default AllUserManagementBanDetails;
