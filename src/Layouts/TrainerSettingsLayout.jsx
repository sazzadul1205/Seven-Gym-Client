import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";

// Import Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Import Tabs
import TrainerProfile from "../Pages/(TrainerPages)/TrainerProfile/TrainerProfile";
import TrainerSchedule from "../Pages/(TrainerPages)/TrainerSchedule/TrainerSchedule";
import TrainerDashboard from "../Pages/(TrainerPages)/TrainerDashboard/TrainerDashboard";

// Import Icons
import { FaPowerOff } from "react-icons/fa";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoMdFemale, IoMdMale } from "react-icons/io";

// Import Hooks
import useAuth from "../Hooks/useAuth";
import Loading from "../Shared/Loading/Loading";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import FetchingError from "../Shared/Component/FetchingError";

// Import Button
import CommonButton from "../Shared/Buttons/CommonButton";

// Function to determine gender icon & label
const getGenderIcon = (gender) => {
  const genderData = {
    Male: {
      icon: <IoMdMale className="text-blue-500 font-bold" />,
      label: "Male",
    },
    Female: {
      icon: <IoMdFemale className="text-pink-500 font-bold" />,
      label: "Female",
    },
    Other: {
      icon: <MdOutlinePeopleAlt className="text-gray-500 font-bold" />,
      label: "Other",
    },
  };

  return (
    genderData[gender] || {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-2xl" />,
      label: "Not specified",
    }
  );
};

// Function to determine tier badge styles
const getTierBadge = (tier) => {
  const tierStyles = {
    Bronze:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-orange-300 to-orange-500 ring-2 ring-orange-700",
    Silver:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-300 to-gray-500 ring-2 ring-gray-700",
    Gold: "bg-gradient-to-bl hover:bg-gradient-to-tr from-yellow-300 to-yellow-500 ring-2 ring-yellow-700",
    Diamond:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-blue-300 to-blue-500 ring-2 ring-blue-700",
    Platinum:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-500 to-gray-700 ring-2 ring-gray-900",
  };

  return `px-14 py-2 mt-2 rounded-full text-sm font-semibold shadow-lg  ${
    tierStyles[tier] ||
    "bg-gradient-to-bl hover:bg-gradient-to-tr from-green-300 to-green-500"
  }`;
};

const TrainerSettingsLayout = () => {
  const { user, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Use Cases Call
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Extract tab parameter from URL
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "User_Info_Settings";

  // Tab Management
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update URL when activeTab changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    navigate({ search: params.toString() }, { replace: true });
    window.scrollTo(0, 0); // Scroll to top
  }, [activeTab, navigate]);

  // Fetch trainer data
  const {
    data: TrainerData = [],
    isLoading: TrainerDataIsLoading,
    error: TrainerDataError,
    refetch: refetchTrainerData,
  } = useQuery({
    queryKey: ["TrainerData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Trainers?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Extract trainer profile data
  const TrainerProfileData = TrainerData?.[0] || null;

  // Fetch trainer schedule data
  const {
    data: TrainerScheduleData = [],
    isLoading: TrainerScheduleIsLoading,
    error: TrainerScheduleError,
  } = useQuery({
    queryKey: ["TrainerScheduleData", TrainerProfileData?.name],
    queryFn: () =>
      axiosPublic
        .get(
          `/Trainers_Schedule/ByTrainerName?trainerName=${encodeURIComponent(
            TrainerProfileData?.name
          )}`
        )
        .then((res) => res.data),
    enabled: !!TrainerProfileData?.name,
  });

  // Fetch available class types
  const {
    data: ClassTypesData = [],
    isLoading: ClassTypesDataIsLoading,
    error: ClassTypesDataError,
  } = useQuery({
    queryKey: ["TrainerClassTypes"],
    queryFn: () =>
      axiosPublic.get(`/Trainers/classTypes`).then((res) => res.data),
  });

  // Get gender details (icon + label)
  const { icon } = getGenderIcon(TrainerProfileData?.gender);

  // Logout function
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await logOut();
      navigate("/"); // Redirects to the home page
      setTimeout(() => {
        window.location.reload(); // Force reload
      }, 100); // Short delay to ensure navigation happens first
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

  // Tabs List
  const tabs = [
    {
      id: "Trainer_Dashboard",
      Icon: "https://i.ibb.co.com/LhBG5FfY/dashboard.png",
      title: "Trainer Dashboard",
      content: <TrainerDashboard />,
    },
    {
      id: "Trainer_Profile",
      Icon: "https://i.ibb.co.com/0yHdfd7c/User-Settings.png",
      title: "Trainer Profile",
      content: (
        <TrainerProfile
          TrainerData={TrainerData}
          refetch={refetchTrainerData}
          TrainerScheduleData={TrainerScheduleData}
        />
      ),
    },
    {
      id: "Trainer_Schedule",
      Icon: "https://i.ibb.co.com/xSjNG396/calendar.png",
      title: "Trainer Schedule",
      content: (
        <TrainerSchedule
          TrainerData={TrainerData}
          ClassTypesData={ClassTypesData}
          TrainerScheduleData={TrainerScheduleData}
        />
      ),
    },
    // Add more tabs as needed
  ];

  // Loading state
  if (
    TrainerDataIsLoading ||
    TrainerScheduleIsLoading ||
    ClassTypesDataIsLoading
  )
    return <Loading />;

  // Error state
  if (TrainerDataError || TrainerScheduleError || ClassTypesDataError)
    return <FetchingError />;

  return (
    <div className="min-h-screen bg-white ">
      {/* Header Section */}
      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 py-2 bg-gray-300 text-black px-5">
        {/* Trainer image and basic info */}
        <div className="flex items-center space-x-4">
          {/* Trainer Profile Picture */}
          <img
            src={TrainerProfileData?.imageUrl}
            alt="Trainer Profile"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          {/* Trainer Name and Specialization */}
          <div>
            <div className="flex justify-center items-center gap-3">
              <h3 className="text-lg font-bold text-gray-700">
                {TrainerProfileData?.name}
              </h3>
              <span className="text-xl font-bold">{icon}</span>
            </div>
            <p className="text-sm text-gray-600">
              {TrainerProfileData?.specialization}
            </p>
          </div>
        </div>

        {/* Badge Display */}
        <div>
          <p
            className={`${getTierBadge(
              TrainerProfileData?.tier
            )} cursor-pointer`}
          >
            {TrainerProfileData?.tier || "Unknown Tier"}
          </p>
        </div>

        {/* Log out button */}
        <CommonButton
          text={isLoggingOut ? "Logging Out..." : "Log Out"}
          clickEvent={handleSignOut}
          bgColor="red"
          py="py-1"
          px="px-10"
          icon={<FaPowerOff />}
          isLoading={isLoggingOut}
          loadingText="Logging Out..."
        />
      </div>

      {/* Tabs Sections */}
      <div className="flex min-h-screen mx-auto bg-linear-to-b from-gray-100 to-gray-500 border-t border-gray-500">
        {/* Tab Names */}
        <div className="w-1/5 bg-gray-200 text-black border-r border-gray-500">
          {/* Top part */}
          <h3 className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2">
            Trainer Settings Options
          </h3>

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
        <div className="w-4/5">
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
