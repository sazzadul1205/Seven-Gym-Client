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

  // Unified refetch function
  const refetchAll = async () => {
    await ClassBookingRequestRefetch();
    await ClassBookingAcceptedRefetch();
  };

  const isLoading =
    ClassBookingRequestIsLoading || ClassBookingAcceptedIsLoading;

  const error = ClassBookingRequestError || ClassBookingAcceptedError;

  return {
    // Is Loading States
    isLoading,

    // Error States
    error,

    // Data
    ClassBookingRequestData,
    ClassBookingAcceptedData,

    // Refetch All
    refetchAll,
  };
};

export default useClassManagementData;
