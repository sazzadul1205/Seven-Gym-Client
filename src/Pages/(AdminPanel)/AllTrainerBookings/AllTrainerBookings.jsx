/* eslint-disable react/prop-types */
import AllTrainerBookingAccepted from "./AllTrainerBookingAccepted/AllTrainerBookingAccepted";
import AllTrainerBookingCanceled from "./AllTrainerBookingCanceled/AllTrainerBookingCanceled";
import AllTrainerBookingCompleted from "./AllTrainerBookingCompleted/AllTrainerBookingCompleted";
import AllTrainerBookingHistory from "./AllTrainerBookingHistory/AllTrainerBookingHistory";
import AllTrainerBookingRequest from "./AllTrainerBookingRequest/AllTrainerBookingRequest";

const AllTrainerBookings = ({
  AllTrainerBookingRequestData,
  AllTrainerBookingHistoryData,
  AllTrainerBookingAcceptedData,
  AllTrainerBookingCompletedData,
  AllTrainerBookingCancelledData,
}) => {
  return (
    <div className="text-black">
      <AllTrainerBookingRequest
        AllTrainerBookingRequestData={AllTrainerBookingRequestData}
      />
      <AllTrainerBookingHistory
        AllTrainerBookingHistoryData={AllTrainerBookingHistoryData}
      />
      <AllTrainerBookingAccepted
        AllTrainerBookingAcceptedData={AllTrainerBookingAcceptedData}
      />
      <AllTrainerBookingCanceled
        AllTrainerBookingCancelledData={AllTrainerBookingCancelledData}
      />
      <AllTrainerBookingCompleted
        AllTrainerBookingCompletedData={AllTrainerBookingCompletedData}
      />
    </div>
  );
};

export default AllTrainerBookings;
