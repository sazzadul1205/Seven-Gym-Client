import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

// Import Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Import Tabs
import TrainerProfile from "../Pages/(TrainerPages)/TrainerProfile/TrainerProfile";
import TrainerSchedule from "../Pages/(TrainerPages)/TrainerSchedule/TrainerSchedule";
import TrainerDashboard from "../Pages/(TrainerPages)/TrainerDashboard/TrainerDashboard";
import TrainerStudentHistory from "../Pages/(TrainerPages)/TrainerStudentHistory/TrainerStudentHistory";
import TrainerBookingRequest from "../Pages/(TrainerPages)/TrainerBookingRequest/TrainerBookingRequest";
import TrainerScheduleHistory from "../Pages/(TrainerPages)/TrainerScheduleHistory/TrainerScheduleHistory";
import TrainerScheduleParticipant from "../Pages/(TrainerPages)/TrainerScheduleParticipant/TrainerScheduleParticipant";

// Import Icons
import { FaPowerOff } from "react-icons/fa";
import { RiArchiveDrawerFill } from "react-icons/ri";

// Import Hooks
import useAuth from "../Hooks/useAuth";
import Loading from "../Shared/Loading/Loading";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import FetchingError from "../Shared/Component/FetchingError";

// Import Button
import CommonButton from "../Shared/Buttons/CommonButton";

// Import Utility
import { getGenderIcon } from "../Utility/getGenderIcon";
import { fetchTierBadge } from "../Utility/fetchTierBadge";

const TrainerSettingsLayout = () => {
  const { user, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Use Cases Call
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Refetch Spin state
  const [spinning, setSpinning] = useState(false);

  // Get initial tab from URL
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "Trainer_Dashboard";

  // Tab State
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update URL when activeTab changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    navigate({ search: params.toString() }, { replace: true });
    window.scrollTo(0, 0);
  }, [activeTab, navigate]);

  // Listen to URL changes and update activeTab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlTab = params.get("tab") || "Trainer_Dashboard";
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

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

  // 2. Extract Trainer Profile
  const TrainerProfileData = TrainerData?.[0] || null;

  // 3. Fetch Trainer Schedule
  const {
    data: TrainerScheduleData = [],
    isLoading: TrainerScheduleIsLoading,
    error: TrainerScheduleError,
    refetch: TrainerScheduleRefetch,
  } = useQuery({
    queryKey: ["TrainerScheduleData", TrainerProfileData?.name],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainers_Schedule/ByTrainerName?trainerName=${encodeURIComponent(
            TrainerProfileData?.name
          )}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerProfileData?.name,
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
        const res = await axiosPublic.get(`/Trainers/classTypes`);
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
    queryKey: ["TrainerBookingRequestData", TrainerProfileData?.name],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_Request/Trainer/${TrainerProfileData?.name}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerProfileData?.name,
  });

  // 7. Fetch Accepted Bookings
  const {
    data: TrainerBookingAcceptedData = [],
    isLoading: TrainerBookingAcceptedIsLoading,
    error: TrainerBookingAcceptedError,
    refetch: TrainerBookingAcceptedRefetch,
  } = useQuery({
    queryKey: ["TrainerBookingAcceptedData", TrainerProfileData?.name],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_Accepted/Trainer/${TrainerProfileData?.name}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerProfileData?.name,
  });

  // 8. Fetch Booking History
  const {
    data: TrainerBookingHistoryData = [],
    isLoading: TrainerBookingHistoryIsLoading,
    error: TrainerBookingHistoryError,
    refetch: TrainerBookingHistoryRefetch,
  } = useQuery({
    queryKey: ["TrainerBookingHistoryData", TrainerProfileData?._id],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_History/Trainer/${TrainerProfileData?._id}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerProfileData?._id,
  });

  // 9. Fetch Trainer-Student History
  const {
    data: TrainerStudentHistoryData = [],
    isLoading: TrainerStudentHistoryIsLoading,
    error: TrainerStudentHistoryError,
    refetch: TrainerStudentHistoryRefetch,
  } = useQuery({
    queryKey: ["TrainerStudentHistory", TrainerProfileData?._id],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Student_History?trainerId=${TrainerProfileData?._id}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerProfileData?._id,
  });

  // 10. Fetch Daily Booking History Stats
  const {
    data: TrainerBookingHistoryDailyStatsData = [],
    isLoading: TrainerBookingHistoryDailyStatsIsLoading,
    error: TrainerBookingHistoryDailyStatsError,
    refetch: TrainerStudentHistoryDailyStatsRefetch,
  } = useQuery({
    queryKey: ["TrainerBookingHistoryDailyStats", TrainerProfileData?._id],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_History/DailyStats?trainerId=${TrainerProfileData?._id}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerProfileData?._id,
  });

  // 11. Fetch Daily Accepted Stats
  const {
    data: TrainerBookingAcceptedDailyStatsData = [],
    isLoading: TrainerBookingAcceptedDailyStatsIsLoading,
    error: TrainerBookingAcceptedDailyStatsError,
    refetch: TrainerStudentAcceptedDailyStatsRefetch,
  } = useQuery({
    queryKey: ["TrainerBookingAcceptedDailyStats", TrainerProfileData?._id],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_Accepted/DailyStats?trainerId=${TrainerProfileData?._id}`
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!TrainerProfileData?._id,
  });

  // Unified refetch function
  const refetchAll = async () => {
    await TrainerRefetch();
    await TrainerScheduleRefetch();
    await TrainerBookingRequestRefetch();
    await TrainerBookingHistoryRefetch();
    await TrainerStudentHistoryRefetch();
    await TrainerBookingAcceptedRefetch();
    await TrainerStudentHistoryDailyStatsRefetch();
    await TrainerStudentAcceptedDailyStatsRefetch();
  };

  // Tabs List
  const tabs = [
    // Trainer Dashboard Tab
    {
      id: "Trainer_Dashboard",
      Icon: "https://i.ibb.co.com/LhBG5FfY/dashboard.png",
      title: "Trainer Dashboard",
      content: (
        <TrainerDashboard
          TrainerData={TrainerData}
          TrainerScheduleData={TrainerScheduleData}
          TrainerBookingHistory={TrainerBookingHistoryData}
          TrainerBookingAccepted={TrainerBookingAcceptedData}
          TrainerBookingHistoryDailyStats={TrainerBookingHistoryDailyStatsData}
          TrainerBookingAcceptedDailyStats={
            TrainerBookingAcceptedDailyStatsData
          }
        />
      ),
    },
    // Trainer Profile Tab
    {
      id: "Trainer_Profile",
      Icon: "https://i.ibb.co.com/0yHdfd7c/User-Settings.png",
      title: "Trainer Profile",
      content: (
        <TrainerProfile
          refetch={refetchAll}
          TrainerData={TrainerData}
          TrainerScheduleData={TrainerScheduleData}
        />
      ),
    },
    // Trainer Schedule Tab
    {
      id: "Trainer_Schedule",
      Icon: "https://i.ibb.co.com/xSjNG396/calendar.png",
      title: "Trainer Schedule",
      content: (
        <TrainerSchedule
          refetch={refetchAll}
          TrainerProfileData={TrainerProfileData}
          AvailableClassTypesData={ClassTypesData}
          TrainerProfileScheduleData={TrainerProfileScheduleData}
        />
      ),
    },
    // Trainer Booking Request Tab
    {
      id: "Trainer_Booking_Request",
      Icon: "https://i.ibb.co.com/YBcHM9vp/booking.png",
      title: "Trainer Booking Request",
      content: (
        <TrainerBookingRequest
          refetch={refetchAll}
          TrainerBookingRequestData={TrainerBookingRequestData}
        />
      ),
    },
    // Schedule Participant Tab
    {
      id: "Schedule_Participant",
      Icon: "https://i.ibb.co.com/hFTNrhbm/schedule.png",
      title: "Schedule Participant",
      content: (
        <TrainerScheduleParticipant
          refetch={refetchAll}
          TrainerProfileData={TrainerProfileData}
          TrainerBookingRequestData={TrainerBookingRequestData}
          TrainerProfileScheduleData={TrainerProfileScheduleData}
          TrainerBookingAcceptedData={TrainerBookingAcceptedData}
        />
      ),
    },
    // Schedule Participant Tab
    {
      id: "Schedule_History",
      Icon: "https://i.ibb.co.com/gM88HmKm/clock.png ",
      title: "Session History",
      content: (
        <TrainerScheduleHistory
          refetch={refetchAll}
          TrainerBookingHistoryData={TrainerBookingHistoryData}
          TrainerBookingAcceptedData={TrainerBookingAcceptedData}
        />
      ),
    },
    // Schedule Participant Tab
    {
      id: "Students_History",
      Icon: "https://i.ibb.co.com/RTpsgqvH/user.png ",
      title: "Students History",
      content: (
        <TrainerStudentHistory
          TrainerStudentHistoryData={TrainerStudentHistoryData}
        />
      ),
    },
    // Add more tabs as needed
  ];

  // Loading state
  if (
    TrainerDataIsLoading ||
    ClassTypesDataIsLoading ||
    TrainerScheduleIsLoading ||
    TrainerBookingRequestIsLoading ||
    TrainerBookingHistoryIsLoading ||
    TrainerStudentHistoryIsLoading ||
    TrainerBookingAcceptedIsLoading ||
    TrainerBookingHistoryDailyStatsIsLoading ||
    TrainerBookingAcceptedDailyStatsIsLoading
  )
    return <Loading />;

  // Error state
  if (
    TrainerDataError ||
    ClassTypesDataError ||
    TrainerScheduleError ||
    TrainerBookingRequestError ||
    TrainerBookingHistoryError ||
    TrainerStudentHistoryError ||
    TrainerBookingAcceptedError ||
    TrainerBookingHistoryDailyStatsError ||
    TrainerBookingAcceptedDailyStatsError
  )
    return <FetchingError />;

  // Logout function with confirmation
  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // Exit if user cancels

    setIsLoggingOut(true);
    try {
      await logOut();
      navigate("/"); // Redirect to home
      setTimeout(() => {
        window.location.reload(); // Force reload
      }, 100);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: `Error logging out: ${error.message}`,
        confirmButtonColor: "#d33",
        timer: 3000,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get gender details (icon + label)
  const { icon } = getGenderIcon(TrainerProfileData?.gender);

  // Handle Refetch Spin
  const handleClick = () => {
    if (spinning) return; // Prevent spam clicks
    setSpinning(true);
    refetchAll();

    // Stop spinning after 1 second (adjust as needed)
    setTimeout(() => setSpinning(false), 1000);
  };

  return (
    <div className="min-h-screen bg-white ">
      {/* Header Section */}
      <div className="mx-auto flex flex-row justify-between gap-6 py-2 bg-gray-300 text-black px-1 md:px-5">
        {/* Trainer image and basic info */}
        <div className="flex items-center space-x-4 w-3/4 md:w-auto">
          {/* Trainer Profile Picture */}
          <img
            src={TrainerProfileData?.imageUrl}
            alt="Trainer Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />

          {/* Trainer Name and Specialization */}
          <div className="py-1 w-full">
            {/* Trainer Data */}
            <div className="flex justify-start items-center gap-3">
              {/* Trainer Name */}
              <h3 className="text-lg font-bold text-gray-700">
                {TrainerProfileData?.name}
              </h3>

              {/* Trainer Icons */}
              <span className="text-xl font-bold">{icon}</span>
            </div>

            {/* Trainer Specialization */}
            <p className="text-sm text-gray-600">
              {TrainerProfileData?.specialization}
            </p>
          </div>
        </div>

        {/* Badge Display */}
        <div className="hidden md:flex items-center">
          {TrainerProfileData?.tier && (
            <span className={fetchTierBadge(TrainerProfileData.tier)}>
              {TrainerProfileData.tier} Tier
            </span>
          )}
        </div>

        {/* Log out button */}
        <div className="hidden md:flex w-full md:w-auto my-auto justify-end gap-2">
          <button
            className="bg-gradient-to-bl from-yellow-300 to-yellow-600 hover:from-yellow-400 hover:to-yellow-700 p-2 rounded-lg cursor-pointer"
            onClick={handleClick}
          >
            <img
              src="https://i.ibb.co.com/Wp0ymPyY/refresh.png"
              alt="Refresh Icon"
              className={`w-[25px] h-[25px] ${spinning ? "animate-spin" : ""}`}
            />
          </button>

          <CommonButton
            text={isLoggingOut ? "Logging Out..." : "Log Out"}
            clickEvent={handleSignOut}
            bgColor="red"
            py="py-3"
            px="px-10"
            icon={<FaPowerOff />}
            isLoading={isLoggingOut}
            loadingText="Logging Out..."
          />
        </div>

        {/* Log out button */}
        <div className="flex md:hidden w-1/4 md:w-auto my-auto justify-end">
          <CommonButton
            clickEvent={handleSignOut}
            bgColor="red"
            py="py-3"
            px="px-2"
            icon={<FaPowerOff />}
            isLoading={isLoggingOut}
            loadingText="Logging Out..."
          />
        </div>
      </div>

      {/* Floating Drawer Button for Mobile */}
      <label
        htmlFor="trainer-settings-drawer"
        className="fixed lg:hidden top-20 left-0 bg-gray-500/70 shadow-md cursor-pointer z-50 p-2 "
      >
        <p className="bg-linear-to-bl from-blue-300 to-blue-600 p-4 rounded-full">
          <RiArchiveDrawerFill size={24} />
        </p>
      </label>

      {/* Drawer for Mobile & Tablet View */}
      <div className="drawer z-50 lg:hidden">
        <input
          id="trainer-settings-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content">
          {/* Hidden drawer button, but still accessible */}
          <label
            htmlFor="trainer-settings-drawer"
            className="btn btn-primary drawer-button hidden"
          >
            Open drawer
          </label>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="trainer-settings-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu bg-gray-300 text-black border-r border-gray-500 min-h-full w-3/4 md:w-80 p-0">
            {/* Title */}
            <p className="text-xl font-semibold italic bg-gray-400 text-white px-1 lg:px-5 py-6">
              Trainer Settings Options
            </p>

            <div className="space-y-2">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-3 w-full text-left px-4 py-4 font-bold cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white border border-gray-500"
                      : "hover:bg-blue-300 border border-gray-500"
                  }`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    document.getElementById(
                      "trainer-settings-drawer"
                    ).checked = false; // Close the drawer
                  }}
                >
                  <img src={tab.Icon} alt="Tab Icon" className="w-5" />
                  {tab.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Sections */}
      <div className="flex min-h-screen mx-auto bg-gray-100 border-t border-gray-500">
        <div className="hidden lg:block w-1/5 bg-gray-200 text-black border-r border-gray-500">
          {/* Title */}
          <p className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2">
            Trainer Settings Options
          </p>

          {/* Tab's */}
          <div className="space-y-2">
            {tabs.map((tab) => (
              <p
                key={tab.id}
                className={`flex items-center gap-3 w-full text-left px-4 py-4 font-bold mt-2 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-linear-to-br from-blue-500 to-blue-300 text-white border border-gray-500"
                    : "bg-linear-to-bl border border-gray-400 from-gray-200 to-gray-300 hover:from-blue-400 hover:to-blue-200 hover:text-white"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <img src={tab.Icon} alt="Tab Icon" className="w-5" />
                {tab.title}
              </p>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {tabs.map(
            (tab) =>
              activeTab === tab.id && <div key={tab.id}>{tab.content}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerSettingsLayout;
