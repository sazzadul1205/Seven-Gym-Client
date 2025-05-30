// import Packages
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useUserTrainerManagementData = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // 1. Fetch all Trainer Booking Request Request
  const {
    data: TrainersBookingRequestData = [],
    isLoading: TrainersBookingRequestIsLoading,
    error: TrainersBookingRequestError,
    refetch: TrainersBookingRequestRefetch,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["TrainersBookingRequestData", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_Request/Booker/${user.email}`
        );
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No bookings found — not a real error
          return [];
        }

        throw err;
      }
    },
  });

  // 2. Fetch all Trainer Booking History Request
  const {
    data: TrainersBookingHistoryData = [],
    isLoading: TrainersBookingHistoryIsLoading,
    error: TrainersBookingHistoryError,
    refetch: TrainersBookingHistoryRefetch,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["TrainersBookingHistoryData", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_History?email=${user.email}`
        );
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No bookings found — not a real error
          return [];
        }
        throw err;
      }
    },
  });

  // 3. Fetch all Trainer Booking History Request
  const {
    data: TrainersBookingAcceptedData = [],
    isLoading: TrainersBookingAcceptedIsLoading,
    error: TrainersBookingAcceptedError,
    refetch: TrainersBookingAcceptedRefetch,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["TrainersBookingAcceptedData", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_Accepted?email=${user.email}`
        );
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No bookings found — not a real error
          return [];
        }
        throw err;
      }
    },
  });

  // 4. Fetch User Trainer Profile
  const {
    data: TrainerStudentHistoryData = [],
    isLoading: TrainerStudentHistoryIsLoading,
    error: TrainerStudentHistoryError,
    refetch: TrainerStudentHistoryRefetch,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["TrainerStudentHistoryData", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Student_History/ByBooker?bookerEmail=${user?.email}`
        );
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No bookings found — not a real error
          return [];
        }
        throw err;
      }
    },
  });

  // 5. Fetch user basic data
  const {
    data: UserBasicData,
    isLoading: UserBasicIsLoading,
    error: UserBasicError,
    refetch: UserBasicRefetch,
  } = useQuery({
    queryKey: ["UserBasicData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Users/BasicProfile?email=${user?.email}`
      );
      return res.data;
    },
  });

  // 6. Fetch Session Payment Invoice
  const {
    data: SessionPaymentInvoicesData,
    isLoading: SessionPaymentInvoicesIsLoading,
    error: SessionPaymentInvoicesError,
    refetch: SessionPaymentInvoicesRefetch,
  } = useQuery({
    queryKey: ["SessionPaymentInvoices", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Trainer_Session_Payment?bookerEmail=${user?.email}`
      );
      return res.data;
    },
  });

  // 7. Fetch Session Refund Invoices Data
  const {
    data: SessionRefundInvoicesData,
    isLoading: SessionRefundInvoicesIsLoading,
    error: SessionRefundInvoicesError,
    refetch: SessionRefundInvoicesRefetch,
  } = useQuery({
    queryKey: ["SessionRefundInvoices", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Trainer_Session_Refund?bookerEmail=${user?.email}`
      );
      return res.data;
    },
  });

  // Ensure trainerIds is always defined
  const trainerIds = Array.isArray(TrainersBookingAcceptedData)
    ? [...new Set(TrainersBookingAcceptedData.map((b) => b.trainerId))]
    : [];

  // Build query string
  const queryString = trainerIds.map((id) => `trainerID=${id}`).join("&");

  // Hook must run unconditionally
  const {
    data: TrainerAnnouncementData,
    isLoading: TrainerAnnouncementIsLoading,
    error: TrainerAnnouncementError,
    refetch: TrainerAnnouncementRefetch,
  } = useQuery({
    queryKey: ["TrainerAnnouncement", trainerIds],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Trainer_Announcement?${queryString}`);
      return res.data;
    },
    enabled: trainerIds.length > 0,
  });

  //  Refetch All Everything
  const refetchAll = async () => {
    await UserBasicRefetch();
    await TrainerAnnouncementRefetch();
    await SessionRefundInvoicesRefetch();
    await TrainerStudentHistoryRefetch();
    await TrainersBookingRequestRefetch();
    await TrainersBookingHistoryRefetch();
    await SessionPaymentInvoicesRefetch();
    await TrainersBookingAcceptedRefetch();
  };

  return {
    //  IsLoading
    UserBasicIsLoading,
    TrainerAnnouncementIsLoading,
    SessionRefundInvoicesIsLoading,
    TrainerStudentHistoryIsLoading,
    TrainersBookingRequestIsLoading,
    TrainersBookingHistoryIsLoading,
    SessionPaymentInvoicesIsLoading,
    TrainersBookingAcceptedIsLoading,

    // Errors
    UserBasicError,
    TrainerAnnouncementError,
    SessionRefundInvoicesError,
    TrainerStudentHistoryError,
    TrainersBookingRequestError,
    TrainersBookingHistoryError,
    SessionPaymentInvoicesError,
    TrainersBookingAcceptedError,

    // Fetched Data

    UserBasicData,
    TrainerAnnouncementData,
    SessionRefundInvoicesData,
    TrainerStudentHistoryData,
    TrainersBookingRequestData,
    TrainersBookingHistoryData,
    SessionPaymentInvoicesData,
    TrainersBookingAcceptedData,

    // Refetch
    refetchAll,
  };
};

export default useUserTrainerManagementData;
