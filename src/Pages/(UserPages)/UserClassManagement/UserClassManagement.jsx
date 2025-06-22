import useFetchData from "../../../Utility/useFetchData";
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";
import UserClassManagementRequest from "./UserClassManagementRequest/UserClassManagementRequest";

import Classes_Background from "../../../assets/Classes-Background/Classes_Background.jpg";
import useAuth from "../../../Hooks/useAuth";
import UserClassManagementAccepted from "./UserClassManagementAccepted/UserClassManagementAccepted";
import UserClassManagementCompleted from "./UserClassManagementCompleted/UserClassManagementCompleted";
import UserClassManagementRejected from "./UserClassManagementRejected/UserClassManagementRejected";

const UserClassManagement = () => {
  const { user } = useAuth();

  // 1. Fetch Class Request
  const {
    data: ClassBookingRequestData,
    isLoading: ClassBookingRequestIsLoading,
    error: ClassBookingRequestError,
    refetch: ClassBookingRequestRefetch,
  } = useFetchData(
    "ClassBookingRequestData",
    `/Class_Booking_Request?email=${user?.email}`
  );

  // 2. Fetch Class Accepted
  const {
    data: ClassBookingAcceptedData,
    isLoading: ClassBookingAcceptedIsLoading,
    error: ClassBookingAcceptedError,
    refetch: ClassBookingAcceptedRefetch,
  } = useFetchData("ClassBookingAcceptedData", "/Class_Booking_Accepted");

  // 3. Fetch Class Completed
  const {
    data: ClassBookingCompletedData,
    isLoading: ClassBookingCompletedIsLoading,
    error: ClassBookingCompletedError,
    refetch: ClassBookingCompletedRefetch,
  } = useFetchData("ClassBookingCompletedData", "/Class_Booking_Completed");

  // 4. Fetch Class Rejected
  const {
    data: ClassBookingRejectedData,
    isLoading: ClassBookingRejectedIsLoading,
    error: ClassBookingRejectedError,
    refetch: ClassBookingRejectedRefetch,
  } = useFetchData("ClassBookingRejectedData", "/Class_Booking_Rejected");

  // Unified refetch function
  const refetchAll = async () => {
    await ClassBookingRequestRefetch();
    await ClassBookingAcceptedRefetch();
    await ClassBookingRejectedRefetch();
    await ClassBookingCompletedRefetch();
  };

  // Loading state
  if (
    ClassBookingRequestIsLoading ||
    ClassBookingAcceptedIsLoading ||
    ClassBookingCompletedIsLoading ||
    ClassBookingRejectedIsLoading
  )
    return <Loading />;

  // Error state
  if (
    ClassBookingRequestError ||
    ClassBookingAcceptedError ||
    ClassBookingCompletedError ||
    ClassBookingRejectedError
  )
    return <FetchingError />;

  return (
    <div
      className="bg-fixed bg-cover bg-center min-h-screen "
      style={{
        backgroundImage: `url(${Classes_Background})`,
      }}
    >
      <div className="bg-gradient-to-b from-black/50 to-gray-700 min-h-screen">
        <UserClassManagementRequest
          ClassBookingRequestData={ClassBookingRequestData}
        />
        <UserClassManagementAccepted
          ClassBookingAcceptedData={ClassBookingAcceptedData}
          refetchAll={refetchAll}
        />
        <UserClassManagementCompleted
          ClassBookingCompletedData={ClassBookingCompletedData}
          refetchAll={refetchAll}
        />
        <UserClassManagementRejected
          ClassBookingRejectedData={ClassBookingRejectedData}
          refetchAll={refetchAll}
        />
      </div>
    </div>
  );
};

export default UserClassManagement;
