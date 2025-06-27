import useAuth from "../Hooks/useAuth";
import useFetchData from "./useFetchData";

const useClassManagementData = () => {
  const { user } = useAuth();

  // 1. Fetch Class Request
  const {
    data: ClassBookingRequestData,
    isLoading: ClassBookingRequestIsLoading,
    error: ClassBookingRequestError,
    refetch: ClassBookingRequestRefetch,
  } = useFetchData("ClassBookingRequestData", "/Class_Booking_Request");

  // 2. Fetch Class Accepted
  const {
    data: ClassBookingAcceptedData,
    isLoading: ClassBookingAcceptedIsLoading,
    error: ClassBookingAcceptedError,
    refetch: ClassBookingAcceptedRefetch,
  } = useFetchData("ClassBookingAcceptedData", "/Class_Booking_Accepted");

  // 3. Fetch Class Rejected
  const {
    data: ClassBookingRejectedData,
    isLoading: ClassBookingRejectedIsLoading,
    error: ClassBookingRejectedError,
    refetch: ClassBookingRejectedRefetch,
  } = useFetchData("ClassBookingRejectedData", "/Class_Booking_Rejected");

  // 4. Fetch Class Completed
  const {
    data: ClassBookingCompletedData,
    isLoading: ClassBookingCompletedIsLoading,
    error: ClassBookingCompletedError,
    refetch: ClassBookingCompletedRefetch,
  } = useFetchData("ClassBookingCompletedData", "/Class_Booking_Completed");

  // 4. Fetch Class Details
  const {
    data: ClassDetailsData,
    isLoading: ClassDetailsIsLoading,
    error: ClassDetailsError,
    refetch: ClassDetailsRefetch,
  } = useFetchData("ClassDetailsData", "/Class_Details");

  // 5. Fetch Class Payed Daily Status
  const {
    data: ClassBookingPaymentStatusData,
    isLoading: ClassBookingPaymentStatusIsLoading,
    error: ClassBookingPaymentStatusError,
    refetch: ClassBookingPaymentStatusRefetch,
  } = useFetchData(
    "ClassBookingPaymentStatusData",
    "/Class_Booking_Payment/DailyStatus"
  );

  // 6. Fetch Class Refund Daily Status
  const {
    data: ClassBookingRefundStatusData,
    isLoading: ClassBookingRefundStatusIsLoading,
    error: ClassBookingRefundStatusError,
    refetch: ClassBookingRefundStatusRefetch,
  } = useFetchData(
    "ClassBookingRefundStatusData",
    "/Class_Booking_Refund/DailyStatus"
  );

  // 7. Fetch Class Completed Daily Status
  const {
    data: ClassBookingCompletedStatusData,
    isLoading: ClassBookingCompletedStatusIsLoading,
    error: ClassBookingCompletedStatusError,
    refetch: ClassBookingCompletedStatusRefetch,
  } = useFetchData(
    "ClassBookingCompletedStatusData",
    "/Class_Booking_Completed/DailyStatus"
  );

  // 8. Fetch Terms Of Service
  const {
    data: UserData,
    isLoading: UserIsLoading,
    error: UserError,
    refetch: UserRefetch,
  } = useFetchData("UserData", `/Users?email=${user?.email}`);

  // Unified refetch function
  const refetchAll = async () => {
    await UserRefetch();
    await ClassDetailsRefetch();
    await ClassBookingRequestRefetch();
    await ClassBookingAcceptedRefetch();
    await ClassBookingRejectedRefetch();
    await ClassBookingCompletedRefetch();
    await ClassBookingRefundStatusRefetch();
    await ClassBookingPaymentStatusRefetch();
    await ClassBookingCompletedStatusRefetch();
  };

  const isLoading =
    UserIsLoading ||
    ClassDetailsIsLoading ||
    ClassBookingRequestIsLoading ||
    ClassBookingRejectedIsLoading ||
    ClassBookingAcceptedIsLoading ||
    ClassBookingCompletedIsLoading ||
    ClassBookingRefundStatusIsLoading ||
    ClassBookingPaymentStatusIsLoading ||
    ClassBookingCompletedStatusIsLoading;

  const error =
    UserError ||
    ClassDetailsError ||
    ClassBookingRequestError ||
    ClassBookingAcceptedError ||
    ClassBookingRejectedError ||
    ClassBookingCompletedError ||
    ClassBookingRefundStatusError ||
    ClassBookingPaymentStatusError ||
    ClassBookingCompletedStatusError;

  return {
    // Is Loading States
    isLoading,

    // Error States
    error,

    // Data
    UserData,
    ClassDetailsData,
    ClassBookingRequestData,
    ClassBookingAcceptedData,
    ClassBookingRejectedData,
    ClassBookingCompletedData,
    ClassBookingRefundStatusData,
    ClassBookingPaymentStatusData,
    ClassBookingCompletedStatusData,

    // Refetch All
    refetchAll,
  };
};

export default useClassManagementData;
