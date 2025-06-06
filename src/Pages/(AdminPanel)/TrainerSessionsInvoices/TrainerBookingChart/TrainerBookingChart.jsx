import React from "react";

const TrainerBookingChart = ({
  TrainerBookingRequestStatusData,
  TrainerBookingAcceptedStatusData,
  TrainerBookingCompletedStatusData,
  TrainerBookingCancelledStatusData,
}) => {
  console.log(
    "Trainer Booking Request Status Data :",
    TrainerBookingRequestStatusData
  );
  console.log(
    "Trainer Booking Accepted Status Data :",
    TrainerBookingAcceptedStatusData
  );
  console.log(
    "Trainer Booking Completed Status Data :",
    TrainerBookingCompletedStatusData
  );
  console.log(
    "Trainer Booking Cancelled Status Data :",
    TrainerBookingCancelledStatusData
  );
  return <div></div>;
};

export default TrainerBookingChart;
