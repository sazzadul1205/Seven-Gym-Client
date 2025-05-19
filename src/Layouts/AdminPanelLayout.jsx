// Import Icons
import { FaPowerOff } from "react-icons/fa";

// Import Shared Button
import CommonButton from "../Shared/Buttons/CommonButton";

// Profile Default Image
import ProfileDefault from "../assets/ProfileDefault.jpg";

import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

import Dashboard from "../assets/Trainer_Settings_Layout_Icons/Dashboard.png";
import coach from "../assets/AdminPanel/";
import users from "../assets/AdminPanel";

import AllTrainersManagement from "../Pages/(AdminPanel)/AllTrainersManagement/AllTrainersManagement";
import AllUserManagement from "../Pages/(AdminPanel)/AllUserManagement/AllUserManagement";

const AdminPanelLayout = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // Get initial tab from URL
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "Trainer_Dashboard";

  // State Management
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState(initialTab);

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

  const tabs = [
    // Trainer Dashboard Tab
    {
      id: "All_Users",
      Icon: Dashboard,
      title: "All Users",
      content: <AllUserManagement />,
    },
    // Trainer Dashboard Tab
    {
      id: "All_Trainers",
      Icon: Dashboard,
      title: "All Trainers",
      content: <AllTrainersManagement />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Admin Header */}
      <div className="flex justify-between items-center bg-gray-200 py-3 px-2 border-b-2 border-gray-300">
        {/* Trainer Profile Picture */}
        <div className="flex gap-2">
          <img
            src={ProfileDefault}
            alt="Trainer Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          <div className="text-black">
            <p className="font-semibold">Sazzadul Isloam Molla</p>
            <p className="text-sm font-light">Admin</p>
          </div>
        </div>

        {/* Log out button */}
        <div className="hidden md:flex w-full md:w-auto my-auto justify-end gap-2">
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

      {/* Admin Body */}
      <div className="flex bg-white">
        {/* Side Panel */}
        <div className="w-1/6 bg-linear-to-bl from-gray-300 to-gray-100 border-r border-gray-300 min-h-screen">
          {/* Title */}
          <p className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2">
            Admin Panel Options
          </p>

          {/* Options */}
          {tabs.map((tab) => (
            <p
              key={tab.id}
              className={`flex items-center gap-3 w-full text-left px-2 py-4 font-bold cursor-pointer text-black hover:text-gray-700 ${
                activeTab === tab.id ? "pl-5" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <img src={tab.Icon} alt="Tab Icon" className="w-5" />
              <p>{tab.title}</p>
            </p>
          ))}
        </div>

        {/* Content */}
        <div className="w-5/6"></div>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
