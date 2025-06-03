// import Packages
import { useQuery } from "@tanstack/react-query";

// Import Hooks
// import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useAdminPanelData = () => {
  //   const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // 1. Fetch All Users
  const {
    data: AllUsersData,
    isLoading: AllUsersIsLoading,
    error: AllUsersError,
    refetch: AllUsersRefetch,
  } = useQuery({
    queryKey: ["AllUsersData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Users`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 2. Fetch All Trainers
  const {
    data: AllTrainersData,
    isLoading: AllTrainersIsLoading,
    error: AllTrainersError,
    refetch: AllTrainersRefetch,
  } = useQuery({
    queryKey: ["AllTrainersData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Trainers`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 3. Fetch All Tier Upgrade Payments
  const {
    data: TierUpgradePaymentData,
    isLoading: TierUpgradePaymentIsLoading,
    error: TierUpgradePaymentError,
    refetch: TierUpgradePaymentRefetch,
  } = useQuery({
    queryKey: ["TierUpgradePaymentData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Tier_Upgrade_Payment`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 4. Fetch All Tier Upgrade Refund
  const {
    data: TierUpgradeRefundData,
    isLoading: TierUpgradeRefundIsLoading,
    error: TierUpgradeRefundError,
    refetch: TierUpgradeRefundRefetch,
  } = useQuery({
    queryKey: ["TierUpgradeRefundData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Tier_Upgrade_Refund`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 5. Fetch Daily Tier Upgrade Payment
  const {
    data: DailyTierUpgradePaymentData,
    isLoading: DailyTierUpgradePaymentIsLoading,
    error: DailyTierUpgradePaymentError,
    refetch: DailyTierUpgradePaymentRefetch,
  } = useQuery({
    queryKey: ["DailyTierUpgradePaymentData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Tier_Upgrade_Payment/DailyTotals`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 6. Fetch Daily Tier Upgrade Refund
  const {
    data: DailyTierUpgradeRefundData,
    isLoading: DailyTierUpgradeRefundIsLoading,
    error: DailyTierUpgradeRefundError,
    refetch: DailyTierUpgradeRefundRefetch,
  } = useQuery({
    queryKey: ["DailyTierUpgradeRefundData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Tier_Upgrade_Refund/DailyTotals`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 7. Fetch Trainer Session Payment
  const {
    data: TrainerSessionPaymentData,
    isLoading: TrainerSessionPaymentIsLoading,
    error: TrainerSessionPaymentError,
    refetch: TrainerSessionPaymentRefetch,
  } = useQuery({
    queryKey: ["TrainerSessionPaymentData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Trainer_Session_Payment`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 8. Fetch Trainer Session Refund
  const {
    data: TrainerSessionRefundData,
    isLoading: TrainerSessionRefundIsLoading,
    error: TrainerSessionRefundError,
    refetch: TrainerSessionRefundRefetch,
  } = useQuery({
    queryKey: ["TrainerSessionRefundData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Trainer_Session_Refund`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 9. Fetch Trainer Session Active
  const {
    data: TrainerSessionActiveData,
    isLoading: TrainerSessionActiveIsLoading,
    error: TrainerSessionActiveError,
    refetch: TrainerSessionActiveRefetch,
  } = useQuery({
    queryKey: ["TrainerSessionActiveData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Session_Completed_&_Active/ActiveSessions`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 10. Fetch Trainer Session Completed
  const {
    data: TrainerSessionCompletedData,
    isLoading: TrainerSessionCompletedIsLoading,
    error: TrainerSessionCompletedError,
    refetch: TrainerSessionCompletedRefetch,
  } = useQuery({
    queryKey: ["TrainerSessionCompletedData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Session_Completed_&_Active/CompletedSessions`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 11. Fetch Trainer Session Payed Status
  const {
    data: TrainerSessionPaymentStatusData,
    isLoading: TrainerSessionPaymentStatusIsLoading,
    error: TrainerSessionPaymentStatusError,
    refetch: TrainerSessionPaymentStatusRefetch,
  } = useQuery({
    queryKey: ["TrainerSessionPaymentStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Session_Payment/DailyStats`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 12. Fetch Trainer Session Refund Status
  const {
    data: TrainerSessionRefundStatusData,
    isLoading: TrainerSessionRefundStatusIsLoading,
    error: TrainerSessionRefundStatusError,
    refetch: TrainerSessionRefundStatusRefetch,
  } = useQuery({
    queryKey: ["TrainerSessionRefundStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Trainer_Session_Refund/DailyStats`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 13. Fetch Trainer Session Active Status
  const {
    data: TrainerSessionActiveStatusData,
    isLoading: TrainerSessionActiveStatusIsLoading,
    error: TrainerSessionActiveStatusError,
    refetch: TrainerSessionActiveStatusRefetch,
  } = useQuery({
    queryKey: ["TrainerSessionActiveStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Session_Completed_&_Active/ActiveSessions/DailyStatus`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 13. Fetch Trainer Session Completed Status
  const {
    data: TrainerSessionCompletedStatusData,
    isLoading: TrainerSessionCompletedStatusIsLoading,
    error: TrainerSessionCompletedStatusError,
    refetch: TrainerSessionCompletedStatusRefetch,
  } = useQuery({
    queryKey: ["TrainerSessionCompletedStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Session_Completed_&_Active/CompletedSessions/DailyStatus`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 14. Fetch All Trainer Booking Accepted
  const {
    data: AllTrainerBookingAcceptedData,
    isLoading: AllTrainerBookingAcceptedIsLoading,
    error: AllTrainerBookingAcceptedError,
    refetch: AllTrainerBookingAcceptedRefetch,
  } = useQuery({
    queryKey: ["AllTrainerBookingAcceptedData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Trainer_Booking_Accepted`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 15. Fetch All Trainer Booking History
  const {
    data: AllTrainerBookingHistoryData,
    isLoading: AllTrainerBookingHistoryIsLoading,
    error: AllTrainerBookingHistoryError,
    refetch: AllTrainerBookingHistoryRefetch,
  } = useQuery({
    queryKey: ["AllTrainerBookingHistoryData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Trainer_Booking_History`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 16. Fetch All Trainer Booking Request
  const {
    data: AllTrainerBookingRequestData,
    isLoading: AllTrainerBookingRequestIsLoading,
    error: AllTrainerBookingRequestError,
    refetch: AllTrainerBookingRequestRefetch,
  } = useQuery({
    queryKey: ["AllTrainerBookingRequestData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Trainer_Booking_Request`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // Unified refetch function
  const refetchAll = async () => {
    await AllUsersRefetch();
    await AllTrainersRefetch();
    await TierUpgradeRefundRefetch();
    await TierUpgradePaymentRefetch();
    await TrainerSessionRefundRefetch();
    await TrainerSessionActiveRefetch();
    await TrainerSessionPaymentRefetch();
    await DailyTierUpgradeRefundRefetch();
    await DailyTierUpgradePaymentRefetch();
    await TrainerSessionCompletedRefetch();
    await AllTrainerBookingHistoryRefetch();
    await AllTrainerBookingRequestRefetch();
    await AllTrainerBookingAcceptedRefetch();
    await TrainerSessionRefundStatusRefetch();
    await TrainerSessionActiveStatusRefetch();
    await TrainerSessionPaymentStatusRefetch();
    await TrainerSessionCompletedStatusRefetch();
  };

  return {
    // Is Loading States
    AllUsersIsLoading,
    AllTrainersIsLoading,
    TierUpgradeRefundIsLoading,
    TierUpgradePaymentIsLoading,
    TrainerSessionRefundIsLoading,
    TrainerSessionActiveIsLoading,
    TrainerSessionPaymentIsLoading,
    DailyTierUpgradeRefundIsLoading,
    TrainerSessionCompletedIsLoading,
    DailyTierUpgradePaymentIsLoading,
    AllTrainerBookingHistoryIsLoading,
    AllTrainerBookingRequestIsLoading,
    AllTrainerBookingAcceptedIsLoading,
    TrainerSessionRefundStatusIsLoading,
    TrainerSessionActiveStatusIsLoading,
    TrainerSessionPaymentStatusIsLoading,
    TrainerSessionCompletedStatusIsLoading,

    // Error States
    AllUsersError,
    AllTrainersError,
    TierUpgradeRefundError,
    TierUpgradePaymentError,
    TrainerSessionRefundError,
    TrainerSessionActiveError,
    TrainerSessionPaymentError,
    DailyTierUpgradeRefundError,
    TrainerSessionCompletedError,
    DailyTierUpgradePaymentError,
    AllTrainerBookingHistoryError,
    AllTrainerBookingRequestError,
    AllTrainerBookingAcceptedError,
    TrainerSessionRefundStatusError,
    TrainerSessionActiveStatusError,
    TrainerSessionPaymentStatusError,
    TrainerSessionCompletedStatusError,

    // Data States
    AllUsersData,
    AllTrainersData,
    TierUpgradeRefundData,
    TierUpgradePaymentData,
    TrainerSessionRefundData,
    TrainerSessionActiveData,
    TrainerSessionPaymentData,
    DailyTierUpgradeRefundData,
    DailyTierUpgradePaymentData,
    TrainerSessionCompletedData,
    AllTrainerBookingRequestData,
    AllTrainerBookingHistoryData,
    AllTrainerBookingAcceptedData,
    TrainerSessionRefundStatusData,
    TrainerSessionActiveStatusData,
    TrainerSessionPaymentStatusData,
    TrainerSessionCompletedStatusData,

    // Refetch Function
    refetchAll,
  };
};

export default useAdminPanelData;
