import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loading from "../../../Shared/Loading/Loading";
import USUserImage from "./USUserImage/USUserImage";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router";
import USUserInfo from "./USUserInfo/USUserInfo";
import USAwards from "./USAwards/USAwards";

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
      Icon: "https://i.ibb.co.com/dmhH696/settings.png",
      title: "User Info Settings",
      content: <USUserInfo UsersData={UsersData} refetch={refetch} />,
    },
    {
      id: "tab3",
      Icon: "https://i.ibb.co.com/dmbrdkq/trophy.png",
      title: "Awards Settings",
      content: <USAwards UsersData={UsersData} refetch={refetch} />,
    },
    // Add more tabs as needed
  ];

  return (
    <div className="min-h-screen bg-white bg-gradient-to-br from-[#f72c5b8a] to-[#f72c5b65]">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 py-3 bg-gray-400">
        <Link to={`/User/${user?.email}/UserProfile`}>
          <button className="flex font-semibold items-center text-slate-100 hover:text-slate-300 gap-2 ml-5 px-5 text-2xl transition duration-300 transform hover:scale-110 hover:rotate-2 hover:shadow-2xl">
            <IoMdArrowRoundBack className="transition duration-500 transform hover:translate-x-2" />
            Back
          </button>
        </Link>
      </div>

      {/* Tabs Layout */}
      <div className="flex min-h-screen mx-auto bg-gray-100">
        {/* Tab Names */}
        <div className="w-1/5 bg-gray-200">
          <p className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2">
            User Settings Options
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
