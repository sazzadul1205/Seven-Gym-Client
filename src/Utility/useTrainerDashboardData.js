// import Packages
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useTrainerDashboardData = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // 1. Fetch Trainer Data
  const {
    data: TrainerData = [],
    isLoading: TrainerDataIsLoading,
    error: TrainerDataError,
    refetch: TrainerRefetch,
  } = useQuery({
    queryKey: ["TrainerData", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Trainers?email=${user?.email}`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!user?.email,
  });

  console.log(TrainerData);

  // 3. Fetch Trainer Schedule
  const {
    data: TrainerScheduleData = [],
    isLoading: TrainerScheduleIsLoading,
    error: TrainerScheduleError,
    refetch: TrainerScheduleRefetch,
  } = useQuery({
    queryKey: ["TrainerScheduleData", TrainerData?.name],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainers_Schedule/ByTrainerName?trainerName=${encodeURIComponent(
            TrainerData?.name
          )}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerData?.name,
  });

  // 4. Extract Schedule Profile
  const TrainerProfileScheduleData = TrainerScheduleData?.[0] || null;

  // 5. Fetch Class Types
  const {
    data: ClassTypesData = [],
    isLoading: ClassTypesDataIsLoading,
    error: ClassTypesDataError,
  } = useQuery({
    queryKey: ["TrainerClassTypes"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Trainer_Class_Information`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });

  // 6. Fetch Booking Request
  const {
    data: TrainerBookingRequestData = [],
    isLoading: TrainerBookingRequestIsLoading,
    error: TrainerBookingRequestError,
    refetch: TrainerBookingRequestRefetch,
  } = useQuery({
    queryKey: ["TrainerBookingRequestData", TrainerData?.name],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_Request/Trainer/${TrainerData?.name}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerData?.name,
  });

  // 7. Fetch Accepted Bookings
  const {
    data: TrainerBookingAcceptedData = [],
    isLoading: TrainerBookingAcceptedIsLoading,
    error: TrainerBookingAcceptedError,
    refetch: TrainerBookingAcceptedRefetch,
  } = useQuery({
    queryKey: ["TrainerBookingAcceptedData", TrainerData?.name],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_Accepted/Trainer/${TrainerData?.name}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerData?.name,
  });

  // 8. Fetch Booking History
  const {
    data: TrainerBookingHistoryData = [],
    isLoading: TrainerBookingHistoryIsLoading,
    error: TrainerBookingHistoryError,
    refetch: TrainerBookingHistoryRefetch,
  } = useQuery({
    queryKey: ["TrainerBookingHistoryData", TrainerData?._id],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_History/Trainer/${TrainerData?._id}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerData?._id,
  });

  // 9. Fetch Trainer-Student History
  const {
    data: TrainerStudentHistoryData = [],
    isLoading: TrainerStudentHistoryIsLoading,
    error: TrainerStudentHistoryError,
    refetch: TrainerStudentHistoryRefetch,
  } = useQuery({
    queryKey: ["TrainerStudentHistory", TrainerData?._id],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Student_History?trainerId=${TrainerData?._id}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerData?._id,
  });

  // 10. Fetch Daily Booking History Stats
  const {
    data: TrainerBookingHistoryDailyStatsData = [],
    isLoading: TrainerBookingHistoryDailyStatsIsLoading,
    error: TrainerBookingHistoryDailyStatsError,
    refetch: TrainerStudentHistoryDailyStatsRefetch,
  } = useQuery({
    queryKey: ["TrainerBookingHistoryDailyStats", TrainerData?._id],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_History/DailyStats?trainerId=${TrainerData?._id}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerData?._id,
  });

  // 11. Fetch Daily Accepted Stats
  const {
    data: TrainerBookingAcceptedDailyStatsData = [],
    isLoading: TrainerBookingAcceptedDailyStatsIsLoading,
    error: TrainerBookingAcceptedDailyStatsError,
    refetch: TrainerStudentAcceptedDailyStatsRefetch,
  } = useQuery({
    queryKey: ["TrainerBookingAcceptedDailyStats", TrainerData?._id],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_Accepted/DailyStats?trainerId=${TrainerData?._id}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerData?._id,
  });

  // 11. Fetch Daily Accepted Stats
  const {
    data: TrainerAnnouncementData = [],
    isLoading: TrainerAnnouncementIsLoading,
    error: TrainerAnnouncementError,
    refetch: TrainerAnnouncementRefetch,
  } = useQuery({
    queryKey: ["TrainerAnnouncement", TrainerData?._id],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Announcement?trainerID=${TrainerData?._id}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerData?._id,
  });

  // Unified refetch function
  const refetchAll = async () => {
    await TrainerRefetch();
    await TrainerScheduleRefetch();
    await TrainerAnnouncementRefetch();
    await TrainerBookingRequestRefetch();
    await TrainerBookingHistoryRefetch();
    await TrainerStudentHistoryRefetch();
    await TrainerBookingAcceptedRefetch();
    await TrainerStudentHistoryDailyStatsRefetch();
    await TrainerStudentAcceptedDailyStatsRefetch();
  };

  return {
    // IsLoading
    TrainerDataIsLoading,
    ClassTypesDataIsLoading,
    TrainerScheduleIsLoading,
    TrainerAnnouncementIsLoading,
    TrainerBookingRequestIsLoading,
    TrainerBookingHistoryIsLoading,
    TrainerStudentHistoryIsLoading,
    TrainerBookingAcceptedIsLoading,
    TrainerBookingHistoryDailyStatsIsLoading,
    TrainerBookingAcceptedDailyStatsIsLoading,

    // Error
    TrainerDataError,
    ClassTypesDataError,
    TrainerScheduleError,
    TrainerAnnouncementError,
    TrainerBookingRequestError,
    TrainerBookingHistoryError,
    TrainerStudentHistoryError,
    TrainerBookingAcceptedError,
    TrainerBookingHistoryDailyStatsError,
    TrainerBookingAcceptedDailyStatsError,

    // Fetched Data
    TrainerData,
    ClassTypesData,
    // TrainerProfileData,
    TrainerScheduleData,
    TrainerAnnouncementData,
    TrainerStudentHistoryData,
    TrainerBookingRequestData,
    TrainerBookingHistoryData,
    TrainerBookingAcceptedData,
    TrainerProfileScheduleData,
    TrainerBookingHistoryDailyStatsData,
    TrainerBookingAcceptedDailyStatsData,

    // Refetch
    refetchAll,
  };
};

export default useTrainerDashboardData;
