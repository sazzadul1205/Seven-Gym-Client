import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Icons
import { FaPowerOff } from "react-icons/fa";
import { FaRegCircleDot } from "react-icons/fa6";

// Shared
import Loading from "../Shared/Loading/Loading";
import CommonButton from "../Shared/Buttons/CommonButton";
import FetchingError from "../Shared/Component/FetchingError";

// Assets
import add from "../assets/AdminPanel/add.png";
import users from "../assets/AdminPanel/users.png";
import coach from "../assets/AdminPanel/coach.png";
import weekly from "../assets/AdminPanel/weekly.png";
import invoice from "../assets/AdminPanel/invoice.png";
import booking from "../assets/AdminPanel/booking.png";
import gallery from "../assets/AdminPanel/gallery.png";
import homepage from "../assets/AdminPanel/homepage.png";
import costumer from "../assets/AdminPanel/costumer.png";
import dashboard from "../assets/AdminPanel/dashboard.png";
import satisfaction from "../assets/AdminPanel/satisfaction.png";
import trainerInvoice from "../assets/AdminPanel/trainerInvoice.png";
import communityPosts from "../assets/AdminPanel/communityPosts.png";

// Packages
import Swal from "sweetalert2";

// Hooks & Utilities
import useAuth from "../Hooks/useAuth";
import useAdminPanelData from "../Utility/useAdminPanelData";

// Tab Components
import AdminDashboard from "../Pages/(AdminPanel)/AdminDashboard/AdminDashboard";
import AllUserManagement from "../Pages/(AdminPanel)/AllUserManagement/AllUserManagement";
import AllTrainerBookings from "../Pages/(AdminPanel)/AllTrainerBookings/AllTrainerBookings";
import FeedbackManagement from "../Pages/(AdminPanel)/FeedbackManagement/FeedbackManagement";
import AllTrainerSchedule from "../Pages/(AdminPanel)/AllTrainerSchedule/AllTrainerSchedule";
import TierUpgradeInvoices from "../Pages/(AdminPanel)/TierUpgradeInvoices/TierUpgradeInvoices";
import HomePageAdminControl from "../Pages/(AdminPanel)/HomePageAdminControl/HomePageAdminControl";
import AllTrainersManagement from "../Pages/(AdminPanel)/AllTrainersManagement/AllTrainersManagement";
import TestimonialsManagement from "../Pages/(AdminPanel)/TestimonialsManagement/TestimonialsManagement";
import AllExtraPageManagement from "../Pages/(AdminPanel)/AllExtraPageManagement/AllExtraPageManagement";
import GalleryPageAdminControl from "../Pages/(AdminPanel)/GalleryPageAdminControl/GalleryPageAdminControl";
import TrainerSessionsInvoices from "../Pages/(AdminPanel)/TrainerSessionsInvoices/TrainerSessionsInvoices";
import CommunityPostsManagement from "../Pages/(AdminPanel)/CommunityPostsManagement/CommunityPostsManagement";
import AllClassBookings from "../Pages/(AdminPanel)/AllClassBookings/AllClassBookings";

const AdminPanelLayout = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const [spinning, setSpinning] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "Dashboard";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    navigate({ search: params.toString() }, { replace: true });
    window.scrollTo(0, 0);
  }, [activeTab, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlTab = params.get("tab") || "Dashboard";
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const {
    // Loading
    isLoading,

    // Error
    error,

    // Data
    UserData,
    GalleryData,
    AboutUsData,
    AllUsersData,
    FeedbackData,
    PromotionsData,
    GymFeaturesData,
    OurMissionsData,
    AllTrainersData,
    TestimonialsData,
    TermsOfServiceData,
    CommunityPostsData,
    TrainersScheduleData,
    HomeBannerSectionData,
    TierUpgradeRefundData,
    HomeWelcomeSectionData,
    TierUpgradePaymentData,
    HomeServicesSectionData,
    ClassBookingRequestData,
    TrainerSessionRefundData,
    TrainerSessionActiveData,
    ClassBookingRejectedData,
    ClassBookingAcceptedData,
    TrainerSessionPaymentData,
    ClassBookingCompletedData,
    DailyTierUpgradeRefundData,
    DailyTierUpgradePaymentData,
    TrainerSessionCompletedData,
    AllTrainerBookingRequestData,
    AllTrainerBookingHistoryData,
    AllTrainerBookingAcceptedData,
    TrainerSessionRefundStatusData,
    TrainerSessionActiveStatusData,
    AllTrainerBookingCompletedData,
    AllTrainerBookingCancelledData,
    TrainerSessionPaymentStatusData,
    TrainerBookingRequestStatusData,
    TrainerBookingAcceptedStatusData,
    TrainerSessionCompletedStatusData,
    TrainerBookingCompletedStatusData,
    TrainerBookingCancelledStatusData,
    refetchAll,
  } = useAdminPanelData();

  const handleRefetch = () => {
    if (spinning) return;
    setSpinning(true);
    refetchAll();
    setTimeout(() => setSpinning(false), 1000);
  };

  // console.log(UserData);

  const tabs = [
    {
      id: "Dashboard",
      Icon: dashboard,
      title: "Dashboard",
      content: (
        <AdminDashboard
          TrainerSessionCompletedStatusData={TrainerSessionCompletedStatusData}
          TrainerBookingCompletedStatusData={TrainerBookingCompletedStatusData}
          TrainerBookingCancelledStatusData={TrainerBookingCancelledStatusData}
          TrainerBookingAcceptedStatusData={TrainerBookingAcceptedStatusData}
          TrainerSessionPaymentStatusData={TrainerSessionPaymentStatusData}
          TrainerBookingRequestStatusData={TrainerBookingRequestStatusData}
          TrainerSessionRefundStatusData={TrainerSessionRefundStatusData}
          TrainerSessionActiveStatusData={TrainerSessionActiveStatusData}
          DailyTierUpgradePaymentData={DailyTierUpgradePaymentData}
          DailyTierUpgradeRefundData={DailyTierUpgradeRefundData}
          TestimonialsData={TestimonialsData}
          AllTrainersData={AllTrainersData}
          PromotionsData={PromotionsData}
          AllUsersData={AllUsersData}
          Refetch={refetchAll}
        />
      ),
    },
    {
      id: "All_Users",
      Icon: users,
      title: "All Users",
      content: (
        <AllUserManagement AllUsersData={AllUsersData} Refetch={refetchAll} />
      ),
    },
    {
      id: "All_Trainers",
      Icon: coach,
      title: "All Trainers",
      content: (
        <AllTrainersManagement
          AllTrainersData={AllTrainersData}
          Refetch={refetchAll}
        />
      ),
    },
    {
      id: "Tier_Upgrade_Invoices",
      Icon: invoice,
      title: "Tier Upgrade Invoices",
      content: (
        <TierUpgradeInvoices
          DailyTierUpgradePaymentData={DailyTierUpgradePaymentData}
          DailyTierUpgradeRefundData={DailyTierUpgradeRefundData}
          TierUpgradePaymentData={TierUpgradePaymentData}
          TierUpgradeRefundData={TierUpgradeRefundData}
          Refetch={refetchAll}
        />
      ),
    },
    {
      id: "Trainer_Sessions_Invoices",
      Icon: trainerInvoice,
      title: "Trainer Sessions Invoices",
      content: (
        <TrainerSessionsInvoices
          TrainerSessionActiveData={TrainerSessionActiveData}
          TrainerSessionRefundData={TrainerSessionRefundData}
          TrainerSessionPaymentData={TrainerSessionPaymentData}
          TrainerSessionCompletedData={TrainerSessionCompletedData}
          TrainerSessionRefundStatusData={TrainerSessionRefundStatusData}
          TrainerSessionActiveStatusData={TrainerSessionActiveStatusData}
          TrainerSessionPaymentStatusData={TrainerSessionPaymentStatusData}
          TrainerSessionCompletedStatusData={TrainerSessionCompletedStatusData}
        />
      ),
    },
    {
      id: "Trainer_Sessions_Bookings",
      Icon: booking,
      title: "Trainer Sessions Bookings",
      content: (
        <AllTrainerBookings
          AllTrainerBookingRequestData={AllTrainerBookingRequestData}
          AllTrainerBookingHistoryData={AllTrainerBookingHistoryData}
          AllTrainerBookingAcceptedData={AllTrainerBookingAcceptedData}
          AllTrainerBookingCompletedData={AllTrainerBookingCompletedData}
          AllTrainerBookingCancelledData={AllTrainerBookingCancelledData}
          TrainerBookingRequestStatusData={TrainerBookingRequestStatusData}
          TrainerBookingAcceptedStatusData={TrainerBookingAcceptedStatusData}
          TrainerBookingCompletedStatusData={TrainerBookingCompletedStatusData}
          TrainerBookingCancelledStatusData={TrainerBookingCancelledStatusData}
        />
      ),
    },
    {
      id: "Class_Bookings",
      Icon: booking,
      title: "Class Bookings",
      content: (
        <AllClassBookings
          AllTrainerBookingRequestData={AllTrainerBookingRequestData}
          AllTrainerBookingHistoryData={AllTrainerBookingHistoryData}
          AllTrainerBookingAcceptedData={AllTrainerBookingAcceptedData}
          AllTrainerBookingCompletedData={AllTrainerBookingCompletedData}
          AllTrainerBookingCancelledData={AllTrainerBookingCancelledData}
          TrainerBookingRequestStatusData={TrainerBookingRequestStatusData}
          TrainerBookingAcceptedStatusData={TrainerBookingAcceptedStatusData}
          TrainerBookingCompletedStatusData={TrainerBookingCompletedStatusData}
          TrainerBookingCancelledStatusData={TrainerBookingCancelledStatusData}
        />
      ),
    },
    {
      id: "Trainer_Schedule",
      Icon: weekly,
      title: "Trainer Schedule",
      content: (
        <AllTrainerSchedule TrainersScheduleData={TrainersScheduleData} />
      ),
    },
    {
      id: "Home_Page_View",
      Icon: homepage,
      title: "Home Page View",
      content: (
        <HomePageAdminControl
          Refetch={refetchAll}
          PromotionsData={PromotionsData}
          GymFeaturesData={GymFeaturesData}
          HomeBannerSectionData={HomeBannerSectionData}
          HomeWelcomeSectionData={HomeWelcomeSectionData}
          HomeServicesSectionData={HomeServicesSectionData}
        />
      ),
    },
    {
      id: "Gallery_Page_View",
      Icon: gallery,
      title: "Gallery Page View",
      content: (
        <GalleryPageAdminControl
          Refetch={refetchAll}
          GalleryData={GalleryData}
        />
      ),
    },
    {
      id: "Testimonials",
      Icon: costumer,
      title: "Testimonials",
      content: (
        <TestimonialsManagement
          Refetch={refetchAll}
          TestimonialsData={TestimonialsData}
        />
      ),
    },
    {
      id: "Community_Posts",
      Icon: communityPosts,
      title: "Community Posts",
      content: (
        <CommunityPostsManagement
          Refetch={refetchAll}
          CommunityPostsData={CommunityPostsData}
        />
      ),
    },
    {
      id: "Feedback",
      Icon: satisfaction,
      title: "Feedback",
      content: (
        <FeedbackManagement Refetch={refetchAll} FeedbackData={FeedbackData} />
      ),
    },
    {
      id: "All_Extra_Page_Management",
      Icon: add,
      title: "All Extra Page Management",
      content: (
        <AllExtraPageManagement
          Refetch={refetchAll}
          AboutUsData={AboutUsData}
          OurMissionsData={OurMissionsData}
          TermsOfServiceData={TermsOfServiceData}
        />
      ),
    },
  ];

  // Loading & Error Component
  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  // Handle SignOut
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

    if (!result.isConfirmed) return;

    setIsLoggingOut(true);
    try {
      await logOut();
      navigate("/");
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

  if (!UserData) {
    return <div>Loading user info...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-200 py-3 px-2 border-b-2 border-gray-300">
        {/* User info */}
        <div className="flex gap-2 items-center">
          {/* Avatar */}
          <img
            src={UserData?.profileImage || ""}
            alt="Admin Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          {/* Basic Info */}
          <div className="text-black">
            {/* Name */}
            <p className="font-semibold">
              {UserData?.fullName || "I Am Admin"}
            </p>
            {/* Role */}
            <p className="text-sm font-light">{UserData?.role || "Admin"}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex justify-end gap-2">
          {/* Refresh */}
          <button
            className="bg-gradient-to-bl from-yellow-300 to-yellow-600 hover:from-yellow-400 hover:to-yellow-700 p-2 rounded-lg cursor-pointer"
            onClick={handleRefetch}
          >
            <img
              src="https://i.ibb.co.com/Wp0ymPyY/refresh.png"
              alt="Refresh Icon"
              className={`w-[25px] h-[25px] ${spinning ? "animate-spin" : ""}`}
            />
          </button>

          {/* Logout */}
          <CommonButton
            text={isLoggingOut ? "Logging Out..." : "Log Out"}
            clickEvent={handleSignOut}
            bgColor="red"
            py="py-2"
            px="px-10"
            icon={<FaPowerOff />}
            isLoading={isLoggingOut}
            loadingText="Logging Out..."
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/6 border-r border-gray-300 bg-gradient-to-bl from-gray-300 to-gray-100 min-h-screen">
          {/* Title */}
          <p className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2">
            Admin Panel Options
          </p>

          {/* Navigation Tab */}
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => {
                if (tab.id !== activeTab) {
                  setTabLoading(true);
                  setTimeout(() => {
                    setActiveTab(tab.id);
                    setTabLoading(false);
                  }, 300);
                }
              }}
              className={`flex items-center gap-3 px-2 py-4 font-bold cursor-pointer text-black hover:text-gray-700 ${
                activeTab === tab.id ? "pl-5" : ""
              }`}
            >
              {activeTab === tab.id && (
                <FaRegCircleDot className="text-blue-500 text-xl" />
              )}
              <img src={tab.Icon} alt={`${tab.title} Icon`} className="w-5" />
              <span>{tab.title}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-5/6">
          {tabLoading ? (
            <div className="h-[80vh] flex justify-center items-center">
              <Loading />
            </div>
          ) : (
            tabs.map(
              (tab) =>
                activeTab === tab.id && (
                  <div key={tab.id} className="w-full">
                    {tab.content}
                  </div>
                )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
