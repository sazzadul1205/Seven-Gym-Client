import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loading from "../../../Shared/Loading/Loading";
import USUserImage from "./USUserImage/USUserImage";

const UserSettings = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [activeTab, setActiveTab] = useState("tab1"); // State to manage active tab

  // Fetch user data
  const {
    data: UsersData,
    isLoading: UsersLoading,
    error: UsersError,
    refetch,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user.email}`).then((res) => res.data),
  });

  if (UsersLoading) return <Loading />;
  if (UsersError) {
    console.error("Error fetching data:", UsersError);
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-3xl text-red-500 font-bold mb-8">
          Failed to load user settings.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Tab data
  const tabs = [
    {
      id: "tab1",
      Icon: "https://i.ibb.co.com/dmNkVLF/picture.png",
      title: "User Image Settings",
      content: <USUserImage UsersData={UsersData} refetch={refetch} />,
    },
    {
      id: "tab2",
      Icon: "https://i.ibb.co.com/dmNkVLF/picture.png",
      title: "Title 2",
      content: "Here is the content for Tab 2.",
    },
    {
      id: "tab3",
      Icon: "https://i.ibb.co.com/dmNkVLF/picture.png",
      title: "Title 3",
      content: "Here is the content for Tab 3.",
    },
    // Add more tabs as needed
  ];

  return (
    <div className="min-h-screen bg-white bg-gradient-to-br from-[#f72c5b8a] to-[#f72c5b65]">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 py-3 bg-gray-400"></div>
      {/* Tabs Layout */}
      <div className="flex min-h-screen mx-auto bg-gray-100 px-3">
        {/* Tab Names */}
        <div className="w-1/5 bg-gray-200 border-r border-l border-gray-500">
          <p className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2">
            User Settings
          </p>
          <>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-3 w-full text-left px-4 py-4 font-bold my-1 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-br from-blue-500 to-blue-300 text-white border border-gray-500"
                    : "bg-white hover:border-gray-500 hover:bg-gradient-to-br from-blue-400 to-blue-200 hover:text-white"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <img src={tab.Icon} alt={tab.Icon} className="w-5" />
                {tab.title}
              </button>
            ))}
          </>
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

export default UserSettings;
