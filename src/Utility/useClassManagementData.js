import useFetchData from "./useFetchData";

const useClassManagementData = () => {
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

  // Unified refetch function
  const refetchAll = async () => {
    await ClassDetailsRefetch();
    await ClassBookingRequestRefetch();
    await ClassBookingAcceptedRefetch();
    await ClassBookingRejectedRefetch();
    await ClassBookingCompletedRefetch();
  };

  const isLoading =
    ClassDetailsIsLoading ||
    ClassBookingRequestIsLoading ||
    ClassBookingRejectedIsLoading ||
    ClassBookingAcceptedIsLoading ||
    ClassBookingCompletedIsLoading;

  const error =
    ClassDetailsError ||
    ClassBookingRequestError ||
    ClassBookingAcceptedError ||
    ClassBookingRejectedError ||
    ClassBookingCompletedError;

  return {
    // Is Loading States
    isLoading,

    // Error States
    error,

    // Data
    ClassDetailsData,
    ClassBookingRequestData,
    ClassBookingAcceptedData,
    ClassBookingRejectedData,
    ClassBookingCompletedData,


    // Refetch All
    refetchAll,
  };
};

export default useClassManagementData;
