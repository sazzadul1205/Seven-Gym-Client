/* eslint-disable react/prop-types */
const TrainerDashboardSessionHistory = ({
  TrainerBookingAccepted,
  TrainerBookingHistory,
}) => {
  const CombinedTrainerBookings = [
    ...(TrainerBookingAccepted || []),
    ...(TrainerBookingHistory || []),
  ];

  console.log("Combined Trainer Bookings:", CombinedTrainerBookings);

  return (
    <div className="w-full text-black">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Trainer Session History
      </h2>
    </div>
  );
};

export default TrainerDashboardSessionHistory;
