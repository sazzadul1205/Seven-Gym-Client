import useFetchData from "./useFetchData";

const useClassManagementData = () => {
  // 1. All Users
  const {
    data: ClassBookingRequestData,
    isLoading: ClassBookingRequestIsLoading,
    error: ClassBookingRequestError,
    refetch: ClassBookingRequestRefetch,
  } = useFetchData("ClassBookingRequestData", "/Class_Booking_Request");

  // Unified refetch function
  const refetchAll = async () => {
    await ClassBookingRequestRefetch();
  };

  const isLoading = ClassBookingRequestIsLoading;

  const error = ClassBookingRequestError;

  return {
    // Is Loading States
    isLoading,

    // Error States
    error,

    // Data
    ClassBookingRequestData,

    // Refetch All
    refetchAll,
  };
};

export default useClassManagementData;
