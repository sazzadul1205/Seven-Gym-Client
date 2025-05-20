import { useState } from "react";
import { useNavigate } from "react-router";

// Icons
import { FaLongArrowAltRight, FaPowerOff } from "react-icons/fa";

// Hooks
import useAuth from "../Hooks/useAuth";

// Shared Components
import CommonButton from "../Shared/Buttons/CommonButton";

// Assets
import ProfileDefault from "../assets/ProfileDefault.jpg";
import users from "../assets/AdminPanel/users.png";
import coach from "../assets/AdminPanel/coach.png";

// Tabs
import AllUserManagement from "../Pages/(AdminPanel)/AllUserManagement/AllUserManagement";
import AllTrainersManagement from "../Pages/(AdminPanel)/AllTrainersManagement/AllTrainersManagement";

// Packages
import Swal from "sweetalert2";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Shared/Loading/Loading";
import FetchingError from "../Shared/Component/FetchingError";

const AdminPanelLayout = () => {
  const { logOut } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Initial tab logic
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "All_Users";

  const [spinning, setSpinning] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 1. Fetch All Users
  const {
    data: AllUsersData,
    isLoading: AllUsersDataIsLoading,
    error: AllUsersDataError,
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

  // Handle Refetch Spin
  const handleRefetch = () => {
    if (spinning) return; // Prevent spam clicks
    setSpinning(true);
    refetchAll();

    // Stop spinning after 1 second (adjust as needed)
    setTimeout(() => setSpinning(false), 1000);
  };

  const tabs = [
    {
      id: "All_Users",
      Icon: users,
      title: "All Users",
      content: <AllUserManagement AllUsersData={AllUsersData} />,
    },
    {
      id: "All_Trainers",
      Icon: coach,
      title: "All Trainers",
      content: <AllTrainersManagement />,
    },
  ];

  // Unified refetch function
  const refetchAll = async () => {
    await AllUsersRefetch();
  };

  // Loading state
  if (AllUsersDataIsLoading) return <Loading />;

  // Error state
  if (AllUsersDataError) return <FetchingError />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-200 py-3 px-2 border-b-2 border-gray-300">
        <div className="flex gap-2 items-center">
          <img
            src={ProfileDefault}
            alt="Admin Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          <div className="text-black">
            <p className="font-semibold">Sazzadul Isloam Molla</p>
            <p className="text-sm font-light">Admin</p>
          </div>
        </div>
        <div className="hidden md:flex justify-end gap-2">
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
          <p className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2">
            Admin Panel Options
          </p>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-2 py-4 font-bold cursor-pointer text-black hover:text-gray-700 ${
                activeTab === tab.id ? "pl-5" : ""
              }`}
            >
              {activeTab === tab.id && (
                <FaLongArrowAltRight className="text-blue-500 text-xl" />
              )}
              <img src={tab.Icon} alt={`${tab.title} Icon`} className="w-5" />
              <span>{tab.title}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-5/6">
          {tabs.map(
            (tab) =>
              activeTab === tab.id && (
                <div key={tab.id} className="w-full">
                  {tab.content}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
