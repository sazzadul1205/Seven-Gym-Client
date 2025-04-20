import PropTypes from "prop-types";

// Import Utility
import { formatDate } from "../../../../../../Utility/formatDate";
import { fetchTierBadge } from "../../../../../../Utility/fetchTierBadge";
import { getGenderIcon } from "../../../../../../Utility/getGenderIcon";

const UserTrainerBookingInfoModalBasic = ({
  SelectedTrainerData,
  selectedBooking,
}) => {
  // Get the gender icon
  const { icon } = getGenderIcon(SelectedTrainerData?.gender);

  return (
    <div className="overflow-auto px-4 py-6 sm:px-6 md:px-8">
      <div className="flex bg-gray-200 flex-col lg:flex-row items-start lg:items-center justify-between gap-6 py-2">
        {/* Trainer Info */}
        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4 sm:gap-6 bg-gray-200">
          {/* Image */}
          <img
            src={SelectedTrainerData?.imageUrl || "/default-profile.png"}
            alt={SelectedTrainerData?.name || "Trainer"}
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full shadow-md object-cover"
            loading="lazy"
          />

          {/* Trainer Content */}
          <div className="text-center sm:text-left space-y-1">
            {/* Name */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <p className="text-xl sm:text-2xl font-bold">
                {SelectedTrainerData?.name || "Unknown Trainer"}
              </p>
              {icon}
            </div>

            {/* Specialization */}
            <p className="text-xs sm:text-sm md:text-base italic text-gray-600">
              {SelectedTrainerData?.specialization ||
                "Specialization Not Available"}
            </p>

            {/* Tier Badge */}
            {SelectedTrainerData?.tier && (
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${fetchTierBadge(
                  SelectedTrainerData?.tier
                )}`}
              >
                {SelectedTrainerData?.tier} Tier
              </span>
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0 p-4 sm:p-6 border-t sm:border-t-0 sm:border-l-2 border-gray-300">
          <div className="space-y-4 text-sm sm:text-base">
            {/* Duration */}
            <div className="flex justify-between">
              <strong>Duration (Weeks):</strong>
              <span>
                {selectedBooking?.durationWeeks === 1
                  ? "1 Week"
                  : `${selectedBooking?.durationWeeks} Weeks`}
              </span>
            </div>

            {/* Total Price */}
            <div className="flex justify-between">
              <strong>Total Price:</strong>
              <span>
                {selectedBooking?.totalPrice === "free"
                  ? "Free"
                  : `$ ${selectedBooking?.totalPrice}`}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between">
              <strong>Status:</strong>
              <span>{selectedBooking?.status || "N/A"}</span>
            </div>

            {/* Booked At */}
            <div className="flex justify-between">
              <strong>Booked At:</strong>
              <span>
                {selectedBooking?.bookedAt
                  ? formatDate(selectedBooking?.bookedAt)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Prop Types validation
UserTrainerBookingInfoModalBasic.propTypes = {
  SelectedTrainerData: PropTypes.shape({
    tier: PropTypes.string,
    name: PropTypes.string,
    gender: PropTypes.string,
    imageUrl: PropTypes.string,
    specialization: PropTypes.string,
  }),
  selectedBooking: PropTypes.shape({
    status: PropTypes.string,
    bookedAt: PropTypes.string,
    durationWeeks: PropTypes.number,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default UserTrainerBookingInfoModalBasic;
