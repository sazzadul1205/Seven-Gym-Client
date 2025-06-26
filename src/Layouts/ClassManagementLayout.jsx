import { useState } from "react";
import { useNavigate } from "react-router";

// Import Icons
import { FaPowerOff } from "react-icons/fa";

// Assets
import worksheet from "../assets/ClassManagement/worksheet.png";

// Import Packages
import Swal from "sweetalert2";

// import Hooks
import useAuth from "../Hooks/useAuth";

// Import Shared
import Loading from "../Shared/Loading/Loading";
import CommonButton from "../Shared/Buttons/CommonButton";
import FetchingError from "../Shared/Component/FetchingError";

// Import Tabs Component
import ClassRequest from "../Pages/(ClassManagement)/ClassRequest/ClassRequest";

// import Utility
import useClassManagementData from "../Utility/useClassManagementData";
import ClassAccepted from "../Pages/(ClassManagement)/ClassAccepted/ClassAccepted";
import ClassRejected from "../Pages/(ClassManagement)/ClassRejected/ClassRejected";
import ClassCompleted from "../Pages/(ClassManagement)/ClassCompleted/ClassCompleted";
import ClassDetailsManagement from "../Pages/(ClassManagement)/ClassDetailsManagement/ClassDetailsManagement";
import ClassParticipants from "../Pages/(ClassManagement)/ClassParticipants/ClassParticipants";

const ClassManagementLayout = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [spinning, setSpinning] = useState(false);
  const [tabLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "Class_Details_Management";
  const [activeTab, setActiveTab] = useState(initialTab);

  const {
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
  } = useClassManagementData();

  const handleRefetch = () => {
    if (spinning) return;
    setSpinning(true);
    refetchAll();
    setTimeout(() => setSpinning(false), 1000);
  };

  const tabs = [
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
      Icon: worksheet,
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
      Icon: worksheet,
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
      Icon: worksheet,
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
      Icon: worksheet,
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
      Icon: worksheet,
      title: "Class Participants",
      content: (
        <ClassParticipants
          ClassBookingAcceptedData={ClassBookingAcceptedData}
          ClassDetailsData={ClassDetailsData}
          Refetch={handleRefetch}
        />
      ),
    },
  ];

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

  // Loading state
  if (isLoading) return <Loading />;

  // Error state
  if (error) return <FetchingError />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mx-auto flex flex-row justify-between gap-6 py-2 bg-gray-300 text-black px-1 md:px-5">
        {/* User info */}
        <div className="flex gap-2 items-center">
          {/* Avatar */}
          <img
            src={"https://i.ibb.co/LhkYdTFJ/blob.jpg"}
            alt="Class Manager"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          {/* Basic Info */}
          <div className="text-black">
            {/* Name */}
            <p className="font-semibold">{"i am the Class Manager"}</p>
            {/* Role */}
            <p className="text-sm font-light">{"Class Manager"}</p>
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

      {/*  Tabs Section */}
      <div className="flex min-h-screen mx-auto bg-gray-100 border-t border-gray-500">
        <div className="hidden lg:block w-1/5 bg-gray-200 text-black border-r border-gray-500">
          {/* Title */}
          <p className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2">
            Class Management Options
          </p>

          {/* Navigation Tab */}
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
            <p className="text-base font-semibold italic bg-gray-400 text-white px-1 lg:px-5 py-6">
              Class Management Options
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
    </div>
  );
};

export default ClassManagementLayout;
