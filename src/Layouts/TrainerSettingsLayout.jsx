import { useState, useEffect } from "react";

// Import Packages
import { useNavigate, useLocation } from "react-router";

// Import Icons
import { IoMdArrowRoundBack } from "react-icons/io";
import TrainerDashboard from "../Pages/(TrainerPages)/TrainerDashboard/TrainerDashboard";
import TrainerProfile from "../Pages/(TrainerPages)/TrainerProfile/TrainerProfile";
import TrainerSchedule from "../Pages/(TrainerPages)/TrainerSchedule/TrainerSchedule";

// Import Hooks

const TrainerSettingsLayout = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
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

  // Tab data
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
      content: <TrainerProfile />,
    },
    {
      id: "Trainer_Schedule",
      Icon: "https://i.ibb.co.com/xSjNG396/calendar.png",
      title: "Trainer Schedule",
      content: <TrainerSchedule />,
    },
    // Add more tabs as needed
  ];

  return (
    <div className="min-h-screen bg-white ">
      {/* Header Section */}
      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 py-2 bg-gray-400 px-5">
        {/* Back Button */}
        <button
          className="flex items-center gap-3 text-xl px-5 py-2 bg-gray-500 hover:bg-gray-500/80 rounded-lg cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack />
          Back
        </button>

        <h3></h3>
      </div>

      {/* Tabs Sections */}
      <div className="flex min-h-screen mx-auto bg-linear-to-b from-gray-100 to-gray-500 border-t border-gray-500">
        {/* Tab Names */}
        <div className="w-1/5 bg-gray-200 text-black border-r border-gray-500">
          <p className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2 ">
            Trainer Settings Options
          </p>
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
