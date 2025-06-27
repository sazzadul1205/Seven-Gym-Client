import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Import Icons
import { FaPowerOff } from "react-icons/fa";

// Import Assets
import worksheet from "../assets/ClassManagement/worksheet.png";
import management from "../assets/ClassManagement/management.png";
import ProfileSettingsIcon from "../assets/ProfileSettingsIcon.png";
import IconClassRequest from "../assets/ClassManagement/ClassRequest.png";
import IconClassAccepted from "../assets/ClassManagement/ClassAccepted.png";
import IconClassRejected from "../assets/ClassManagement/ClassRejected.png";
import IconClassCompleted from "../assets/ClassManagement/ClassCompleted.png";
import IconClassParticipants from "../assets/ClassManagement/ClassParticipants.png";

// Import Packages
import Swal from "sweetalert2";

// Import Hooks
import useAuth from "../Hooks/useAuth";

// Import Shared
import Loading from "../Shared/Loading/Loading";
import CommonButton from "../Shared/Buttons/CommonButton";
import FetchingError from "../Shared/Component/FetchingError";

// Import Utility
import useClassManagementData from "../Utility/useClassManagementData";

// Import Tab Component
import ClassRequest from "../Pages/(ClassManagement)/ClassRequest/ClassRequest";
import ClassAccepted from "../Pages/(ClassManagement)/ClassAccepted/ClassAccepted";
import ClassRejected from "../Pages/(ClassManagement)/ClassRejected/ClassRejected";
import ClassCompleted from "../Pages/(ClassManagement)/ClassCompleted/ClassCompleted";
import ClassParticipants from "../Pages/(ClassManagement)/ClassParticipants/ClassParticipants";
import BasicProfileSettings from "../Pages/(UserPages)/BasicProfileSettings/BasicProfileSettings";
import ClassControlDashboard from "../Pages/(ClassManagement)/ClassControlDashboard/ClassControlDashboard";
import ClassDetailsManagement from "../Pages/(ClassManagement)/ClassDetailsManagement/ClassDetailsManagement";

const ClassManagementLayout = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [spinning, setSpinning] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "Class_Management_Dashboard";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    navigate({ search: params.toString() }, { replace: true });
    window.scrollTo(0, 0);
  }, [activeTab, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlTab = params.get("tab") || "Class_Management_Dashboard";
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const {
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
  } = useClassManagementData();

  const handleRefetch = () => {
    if (spinning) return;
    setSpinning(true);
    refetchAll();
    setTimeout(() => setSpinning(false), 1000);
  };

  const tabs = [
    {
      id: "Class_Management_Dashboard",
      Icon: management,
      title: "Class Management Dashboard",
      content: (
        <ClassControlDashboard
          Refetch={handleRefetch}
          ClassBookingRequestData={ClassBookingRequestData}
          ClassBookingAcceptedData={ClassBookingAcceptedData}
          ClassBookingRejectedData={ClassBookingRejectedData}
          ClassBookingCompletedData={ClassBookingCompletedData}
          ClassBookingRefundStatusData={ClassBookingRefundStatusData}
          ClassBookingPaymentStatusData={ClassBookingPaymentStatusData}
          ClassBookingCompletedStatusData={ClassBookingCompletedStatusData}
        />
      ),
    },
    {
      id: "Class_Details_Management",
      Icon: worksheet,
      title: "Class Details Management",
      content: (
        <ClassDetailsManagement
          ClassDetailsData={ClassDetailsData}
          Refetch={handleRefetch}
        />
      ),
    },
    {
      id: "Class_Request",
      Icon: IconClassRequest,
      title: "Class Request",
      content: (
        <ClassRequest
          ClassBookingRequestData={ClassBookingRequestData}
          Refetch={handleRefetch}
        />
      ),
    },
    {
      id: "Class_Accepted",
      Icon: IconClassAccepted,
      title: "Class Accepted",
      content: (
        <ClassAccepted
          ClassBookingAcceptedData={ClassBookingAcceptedData}
          Refetch={handleRefetch}
        />
      ),
    },
    {
      id: "Class_Rejected",
      Icon: IconClassRejected,
      title: "Class Rejected",
      content: (
        <ClassRejected
          ClassBookingRejectedData={ClassBookingRejectedData}
          Refetch={handleRefetch}
        />
      ),
    },
    {
      id: "Class_Completed",
      Icon: IconClassCompleted,
      title: "Class Completed",
      content: (
        <ClassCompleted
          ClassBookingCompletedData={ClassBookingCompletedData}
          Refetch={handleRefetch}
        />
      ),
    },
    {
      id: "Class_Participants",
      Icon: IconClassParticipants,
      title: "Class Participants",
      content: (
        <ClassParticipants
          ClassBookingAcceptedData={ClassBookingAcceptedData}
          ClassDetailsData={ClassDetailsData}
          Refetch={handleRefetch}
        />
      ),
    },
    {
      id: "Profile_Settings",
      Icon: ProfileSettingsIcon,
      title: "Profile Settings",
      content: (
        <BasicProfileSettings UsersData={UserData} Refetch={handleRefetch} />
      ),
    },
  ];

  // Loading state
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
      <div className="mx-auto flex flex-row justify-between gap-6 py-2 bg-gray-300 text-black px-1 md:px-5">
        {/* User info */}
        <div className="flex gap-2 items-center">
          {/* Avatar */}
          <img
            src={UserData?.profileImage || ""}
            alt="Manager Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />

          {/* Basic Info */}
          <div className="text-black">
            {/* Name */}
            <p className="font-semibold">
              {UserData?.fullName || "I Am Manager"}
            </p>
            {/* Role */}
            <p className="text-sm font-light">{UserData?.role || "Manager"}</p>
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
          <p className="text-xl font-semibold italic bg-gray-400 text-black px-5 py-4">
            Class Management Options
          </p>

          {/* Navigation Tab */}
          {tabs.map((tab) => (
            <p
              key={tab.id}
              className={`flex items-center gap-3 w-full text-left px-4 py-5 mt-2 font-bold cursor-pointer text-black ${
                activeTab === tab.id
                  ? "bg-linear-to-br from-blue-500 to-blue-300 text-black "
                  : "bg-linear-to-bl  from-gray-200 to-gray-300 hover:from-blue-400 hover:to-blue-200 hover:text-black"
              }`}
              onClick={() => {
                if (tab.id !== activeTab) {
                  setTabLoading(true);
                  setTimeout(() => {
                    setActiveTab(tab.id);
                    setTabLoading(false);
                  }, 300);
                }
              }}
            >
              <img src={tab.Icon} alt="Tab Icon" className="w-5" />
              {tab.title}
            </p>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-full md:w-5/6">
          {tabLoading ? (
            <div className="md:h-[80vh] flex justify-center items-center">
              <Loading />
            </div>
          ) : (
            tabs.map(
              (tab) =>
                activeTab === tab.id && <div key={tab.id}>{tab.content}</div>
            )
          )}
        </div>
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
            <p className="text-base font-semibold italic bg-gray-400 text-black px-1 lg:px-5 py-6">
              Class Management Options
            </p>

            <div className="space-y-2">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-3 w-full text-left px-4 py-4 font-bold cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-black border border-gray-500"
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
    </div>
  );
};

export default ClassManagementLayout;
