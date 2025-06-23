import { useState, useEffect } from "react";

// Import Packages
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router";

// Import Icons
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiArchiveDrawerFill } from "react-icons/ri";

// Import Hooks
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Tabs Component
import UserSettingsAward from "./UserSettingsAward/UserSettingsAward";
import UserRefundInvoices from "./UserRefundInvoices/UserRefundInvoices";
import UserSettingsWorkout from "./UserSettingsWorkout/UserSettingsWorkout";
import UserPaymentInvoices from "./UserPaymentInvoices/UserPaymentInvoices";
import UserSettingsSchedule from "./UserSettingsSchedule/UserSettingsSchedule";
import UserSettingsInformation from "./UserSettingsInformation/UserSettingsInformation";
import UserSettingsTestimonials from "./UserSettingsTestimonials/UserSettingsTestimonials";

// import Assets
import ClassPayment from "../../../assets/UserClassInvoices/Payment.png";
import ClassRefund from "../../../assets/UserClassInvoices/Refund.png";
import UserClassPaymentInvoices from "./UserClassPaymentInvoices/UserClassPaymentInvoices";
import UserClassRefundInvoices from "./UserClassRefundInvoices/UserClassRefundInvoices";

const UserSettings = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

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

  // Fetch user data
  const {
    data: UsersData,
    isLoading: UsersIsLoading,
    error: UsersError,
    refetch: UsersDataRefetch,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user?.email}`).then((res) => res.data),
  });

  // Fetch User Personal Schedule Data
  const {
    data: schedulesData = [],
    isLoading: scheduleDataIsLoading,
    error: scheduleDataError,
    refetch: schedulesDataRefetch,
  } = useQuery({
    queryKey: ["ScheduleData"],
    queryFn: async () => {
      try {
        const response = await axiosPublic.get(
          `/User_Schedule?email=${user?.email}`
        );
        return response.data; // Return data if the request succeeds
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return []; // Return an empty array if the data is not found
        }
        throw error; // Throw other errors (like network issues)
      }
    },
  });

  // Fetch trainer details
  const {
    data: UserTestimonialData,
    isLoading: UserTestimonialsILoading,
    error: UserTestimonialError,
    refetch: UserTestimonialRefetch,
  } = useQuery({
    queryKey: ["UserTestimonialsData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Testimonials?email=${user?.email}`);
      return res.data;
    },
  });

  // Fetch User Tier Upgrade Payment Data
  const {
    data: UserTierUpgradePaymentData,
    isLoading: UserTierUpgradePaymentIsLoading,
    error: UserTierUpgradePaymentError,
  } = useQuery({
    queryKey: ["UserTierUpgradePaymentData", user?.email],
    queryFn: async () => {
      if (!user?.email) return []; // Prevent query if email is undefined
      const res = await axiosPublic.get(
        `/Tier_Upgrade_Payment?email=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email, // Only run if email exists
  });

  // Fetch User Tier Upgrade Payment Data
  const {
    data: UserTierUpgradeRefundData,
    isLoading: UserTierUpgradeRefundIsLoading,
    error: UserTierUpgradeRefundError,
  } = useQuery({
    queryKey: ["UserTierUpgradeRefundData"],
    queryFn: async () => {
      if (!user?.email) return []; // Prevent query if email is undefined
      const res = await axiosPublic.get(
        `/Tier_Upgrade_Refund?email=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email, // Only run if email exists
  });

  // Fetch User Class Payment Data
  const {
    data: UserClassPaymentData,
    isLoading: UserClassPaymentIsLoading,
    error: UserClassPaymentError,
  } = useQuery({
    queryKey: ["UserClassPaymentData"],
    queryFn: async () => {
      if (!user?.email) return []; // Prevent query if email is undefined
      const res = await axiosPublic.get(
        `/Class_booking_Payment?email=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email, // Only run if email exists
  });

  // Fetch User Class Refund Data
  const {
    data: UserClassRefundData,
    isLoading: UserClassRefundIsLoading,
    error: UserClassRefundError,
  } = useQuery({
    queryKey: ["UserClassRefundData"],
    queryFn: async () => {
      if (!user?.email) return []; // Prevent query if email is undefined
      const res = await axiosPublic.get(
        `/Class_booking_Refund?email=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email, // Only run if email exists
  });

  // Ensure safe access
  const userSchedule = schedulesData?.[0] || null;

  // Tab data
  const tabs = [
    {
      id: "User_Info_Settings",
      Icon: "https://i.ibb.co.com/0yHdfd7c/User-Settings.png",
      title: "User Information Settings",
      content: (
        <UserSettingsInformation
          UsersData={UsersData}
          refetch={UsersDataRefetch}
        />
      ),
    },
    {
      id: "User_Award_Settings",
      Icon: "https://i.ibb.co.com/dmbrdkq/trophy.png",
      title: "User Award Settings",
      content: (
        <UserSettingsAward UsersData={UsersData} refetch={UsersDataRefetch} />
      ),
    },
    {
      id: "User_Workout_Settings",
      Icon: "https://i.ibb.co.com/nznGSDB/running.png",
      title: "User Workout Settings",
      content: (
        <UserSettingsWorkout UsersData={UsersData} refetch={UsersDataRefetch} />
      ),
    },
    {
      id: "User_Schedule_Settings",
      Icon: "https://i.ibb.co.com/C3WB5f3R/shedule.png",
      title: "User Schedule Settings",
      content: (
        <UserSettingsSchedule
          userSchedule={userSchedule}
          refetch={schedulesDataRefetch}
        />
      ),
    },
    {
      id: "User_Testimonials_Settings",
      Icon: "https://i.ibb.co.com/MkWZ1sPW/testimonial.png",
      title: "User Testimonial",
      content: (
        <UserSettingsTestimonials
          UsersData={UsersData}
          refetch={UserTestimonialRefetch}
          UserTestimonialData={UserTestimonialData}
        />
      ),
    },
    {
      id: "User_Payment_Invoices",
      Icon: "https://i.ibb.co.com/PGvSpC7S/Payed-Invoices.png",
      title: "User Payment Invoices",
      content: (
        <UserPaymentInvoices
          UserTierUpgradePayment={UserTierUpgradePaymentData}
        />
      ),
    },
    {
      id: "User_Refund_Invoices",
      Icon: "https://i.ibb.co.com/Q3b578xv/Refund-Invoices.png",
      title: "User Refund Invoices",
      content: (
        <UserRefundInvoices
          UserTierUpgradeRefundData={UserTierUpgradeRefundData}
        />
      ),
    },
    {
      id: "User_Class_Payment_Invoices",
      Icon: ClassPayment,
      title: "User Class Payment Invoices",
      content: (
        <UserClassPaymentInvoices UserClassPaymentData={UserClassPaymentData} />
      ),
    },
    {
      id: "User_Class_Refund_Invoices",
      Icon: ClassRefund,
      title: "User Class Refund Invoices",
      content: (
        <UserClassRefundInvoices UserClassRefundData={UserClassRefundData} />
      ),
    },
    // Add more tabs as needed
  ];

  // Loading state
  if (
    UsersIsLoading ||
    scheduleDataIsLoading ||
    UserClassRefundIsLoading ||
    UserTestimonialsILoading ||
    UserClassPaymentIsLoading ||
    UserTierUpgradePaymentIsLoading ||
    UserTierUpgradeRefundIsLoading
  )
    return <Loading />;

  // Error state
  if (
    UsersError ||
    scheduleDataError ||
    UserTestimonialError ||
    UserClassRefundError ||
    UserClassPaymentError ||
    UserTierUpgradePaymentError ||
    UserTierUpgradeRefundError
  ) {
    return <FetchingError />;
  }

  return (
    <div className="min-h-screen bg-white ">
      {/* Header Section */}
      <div className="mx-auto flex justify-between gap-6 py-2 bg-gray-400 px-5">
        {/* Back Button */}
        <button
          className="flex items-center gap-3 text-xl px-5 py-2 bg-gray-500 hover:bg-gray-500/80 rounded-lg cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack />
          Back
        </button>

        {/* Floating Drawer Button for Mobile */}
        <label
          htmlFor="user-settings-drawer"
          className="p-3 bg-blue-500 text-white rounded-full shadow-md cursor-pointer lg:hidden"
        >
          <RiArchiveDrawerFill size={20} />
        </label>
      </div>

      {/* Drawer for Mobile & Tablet View */}
      <div className="drawer z-50 lg:hidden">
        <input
          id="user-settings-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-side">
          <label
            htmlFor="user-settings-drawer"
            className="drawer-overlay"
          ></label>

          <div className="menu bg-gray-300 text-black border-r border-gray-500 min-h-full w-3/4 md:w-80 p-0">
            {/* Title */}
            <p className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2">
              User Settings Options
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    document.getElementById(
                      "user-settings-drawer"
                    ).checked = false; // Close the drawer
                  }}
                >
                  <img src={tab.Icon} alt="Tab Icon" className="w-5" />
                  {tab.title}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="flex min-h-screen mx-auto bg-gray-100 border-t border-gray-500">
        <div className="hidden lg:block w-1/5 bg-gray-200 text-black border-r border-gray-500">
          {/* Title */}
          <p className="text-xl font-semibold italic bg-gray-400 text-white px-5 py-2">
            User Settings Options
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
