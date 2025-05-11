import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

// Import Tabs
import TrainerLogs from "../Pages/(TrainerPages)/TrainerLogs/TrainerLogs";
import TrainerProfile from "../Pages/(TrainerPages)/TrainerProfile/TrainerProfile";
import TrainerSchedule from "../Pages/(TrainerPages)/TrainerSchedule/TrainerSchedule";
import TrainerDashboard from "../Pages/(TrainerPages)/TrainerDashboard/TrainerDashboard";
import TrainerTestimonials from "../Pages/(TrainerPages)/TrainerTestimonials/TrainerTestimonials";
import TrainerStudentHistory from "../Pages/(TrainerPages)/TrainerStudentHistory/TrainerStudentHistory";
import TrainerBookingRequest from "../Pages/(TrainerPages)/TrainerBookingRequest/TrainerBookingRequest";
import TrainerScheduleHistory from "../Pages/(TrainerPages)/TrainerScheduleHistory/TrainerScheduleHistory";
import TrainerAnnouncementBoard from "../Pages/(TrainerPages)/TrainerAnnouncementBoard/TrainerAnnouncementBoard";
import TrainerScheduleParticipant from "../Pages/(TrainerPages)/TrainerScheduleParticipant/TrainerScheduleParticipant";

// Import Icons
import { RiArchiveDrawerFill } from "react-icons/ri";

// Import Hooks
import Loading from "../Shared/Loading/Loading";
import FetchingError from "../Shared/Component/FetchingError";

// Import Data Fetch
import useTrainerDashboardData from "../Utility/useTrainerDashboardData";

// Import Icons
import Log from "../assets/Trainer_Settings_Layout_Icons/Log.png";
import User from "../assets/Trainer_Settings_Layout_Icons/User.png";
import Clock from "../assets/Trainer_Settings_Layout_Icons/Clock.png";
import Booking from "../assets/Trainer_Settings_Layout_Icons/Booking.png";
import Calendar from "../assets/Trainer_Settings_Layout_Icons/Calendar.png";
import Schedule from "../assets/Trainer_Settings_Layout_Icons/Schedule.png";
import AdsBoard from "../assets/Trainer_Settings_Layout_Icons/Ads-Board.png";
import Dashboard from "../assets/Trainer_Settings_Layout_Icons/Dashboard.png";
import UserSettings from "../assets/Trainer_Settings_Layout_Icons/User-Settings.png";
import CustomerReview from "../assets/Trainer_Settings_Layout_Icons/Customer-Review.png";

// Import Modals
import TrainerAddModal from "../Pages/(TrainerPages)/TrainerAddModal/TrainerAddModal";

// Import Component
import TrainerSettingsLayoutHeader from "../Pages/(TrainerPages)/TrainerSettingsLayoutHeader/TrainerSettingsLayoutHeader";
import CommonButton from "../Shared/Buttons/CommonButton";

const TrainerSettingsLayout = () => {
  const {
    // Refetch
    refetchAll,

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

    // Data
    TrainerData,
    ClassTypesData,
    TrainerProfileData,
    TrainerScheduleData,
    TrainerAnnouncementData,
    TrainerStudentHistoryData,
    TrainerBookingRequestData,
    TrainerBookingHistoryData,
    TrainerBookingAcceptedData,
    TrainerProfileScheduleData,
    TrainerBookingHistoryDailyStatsData,
    TrainerBookingAcceptedDailyStatsData,
  } = useTrainerDashboardData();

  // Use Cases Call
  const navigate = useNavigate();
  const location = useLocation();

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

  // Tabs List
  const tabs = [
    // Trainer Dashboard Tab
    {
      id: "Trainer_Dashboard",
      Icon: Dashboard,
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
      Icon: UserSettings,
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
      Icon: Calendar,
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
      Icon: Booking,
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
      Icon: Schedule,
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
      Icon: Clock,
      title: "Session History",
      content: (
        <TrainerScheduleHistory
          refetch={refetchAll}
          TrainerBookingHistoryData={TrainerBookingHistoryData}
          TrainerBookingAcceptedData={TrainerBookingAcceptedData}
        />
      ),
    },
    // Student Participant Tab
    {
      id: "Students_History",
      Icon: User,
      title: "Students History",
      content: (
        <TrainerStudentHistory
          TrainerStudentHistoryData={TrainerStudentHistoryData}
        />
      ),
    },
    // Trainer Testimonials
    {
      id: "Trainer_Testimonials",
      Icon: CustomerReview,
      title: "Trainer Testimonials",
      content: <TrainerTestimonials TrainerData={TrainerData} />,
    },
    // Trainer Logs
    {
      id: "Trainer_Logs",
      Icon: Log,
      title: "Trainer Logs",
      content: (
        <TrainerLogs
          TrainerBookingAccepted={TrainerBookingAcceptedData}
          TrainerBookingHistory={TrainerBookingHistoryData}
        />
      ),
    },
    // Trainer Announcement Board
    {
      id: "Trainer_Announcement_Board",
      Icon: AdsBoard,
      title: "Trainer Announcement Board",
      content: (
        <TrainerAnnouncementBoard
          refetchAll={refetchAll}
          TrainerProfileData={TrainerProfileData}
          TrainerAnnouncement={TrainerAnnouncementData}
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
    TrainerAnnouncementIsLoading ||
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
    TrainerAnnouncementError ||
    TrainerBookingRequestError ||
    TrainerBookingHistoryError ||
    TrainerStudentHistoryError ||
    TrainerBookingAcceptedError ||
    TrainerBookingHistoryDailyStatsError ||
    TrainerBookingAcceptedDailyStatsError
  )
    return <FetchingError />;

  return (
    <div className="min-h-screen bg-white ">
      {/* Trainer Settings Header */}
      <TrainerSettingsLayoutHeader
        refetchAll={refetchAll}
        TrainerProfileData={TrainerProfileData}
      />

      {/* Floating Drawer Button for Mobile */}
      <div
        htmlFor="trainer-settings-drawer"
        className="fixed lg:hidden top-20 left-0 bg-gray-500/70 shadow-md cursor-pointer z-50 p-2 "
      >
        <p className="bg-linear-to-bl from-blue-300 to-blue-600 p-4 rounded-full">
          <RiArchiveDrawerFill size={24} />
        </p>
      </div>

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
          {Array.isArray(TrainerData) && TrainerData.length === 0 ? (
            // Full-screen gradient background wrapper for centering the welcome card
            <div className="bg-gradient-to-tr from-gray-100 via-gray-200 to-gray-300 min-h-screen flex items-center justify-center px-0 md:px-4 py-0 md:py-8">
              {/* Card container with shadow, padding, and rounded corners */}
              <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-2xl w-full text-center space-y-6 border border-gray-200">
                {/* Title */}
                <h1 className="text-3xl font-extrabold text-gray-800">
                  Welcome, New Trainer!
                </h1>

                {/* Subtitle / Introductory message */}
                <p className="text-gray-700 text-base leading-relaxed">
                  Your trainer profile has not been set up yet. Let&apos;s fix
                  that so clients can start booking sessions with you.
                </p>

                {/* Additional guidance for the trainer */}
                <p className="text-gray-700 text-base leading-relaxed">
                  It only takes a few minutes to set up your profile. Add your
                  availability, services, and more to get started.
                </p>

                {/* Call-to-action button */}
                <div className="flex justify-center items-center w-full">
                  <CommonButton
                    text="Set Up Your Trainer Profile"
                    bgColor="blue"
                    textColor="text-white"
                    px="px-8"
                    py="py-3"
                    width="auto"
                    clickEvent={() =>
                      document.getElementById("Add_Trainer_Data").showModal()
                    }
                    className="text-sm md:text-md"
                  />
                </div>
              </div>
            </div>
          ) : (
            tabs.map(
              (tab) =>
                activeTab === tab.id && <div key={tab.id}>{tab.content}</div>
            )
          )}
        </div>
      </div>

      {/* Add Trainer Data Modal */}
      <dialog id="Add_Trainer_Data" className="modal">
        <TrainerAddModal />
      </dialog>
    </div>
  );
};

export default TrainerSettingsLayout;
