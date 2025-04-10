import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";

// Background
import UserTrainerManagementBackground from "../../../assets/User-Trainer-Management-Background/UserTrainerManagementBackground.jpg";

// Components
import UserTrainerActiveSession from "./UserTrainerActiveSession/UserTrainerActiveSession";
import UserTrainerSessionHistory from "./UserTrainerSessionHistory/UserTrainerSessionHistory";
import UserTrainerBookingSession from "./UserTrainerBookingSession/UserTrainerBookingSession";
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Tab Definitions
const icons = [
  {
    id: "User-Active-Session",
    label: "Active Session's",
    alt: "Active Sessions",
    src: "https://i.ibb.co/gF6qkSKF/Active-Trainer.png",
  },
  {
    id: "User-Booking-Session",
    label: "Booking Session's",
    alt: "Booking Request",
    src: "https://i.ibb.co/LdVXnyDK/Trainer-Booking.png",
  },
  {
    id: "User-Session-History",
    label: "Session's History",
    alt: "History",
    src: "https://i.ibb.co/SXM5XxWG/Trainer-History.png",
  },
];

const UserTrainerManagement = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get("tab");
  const defaultTab = icons.find((icon) => icon.id === urlTab)
    ? urlTab
    : "User-Booking-Session";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Sync URL with activeTab
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    navigate({ search: params.toString() }, { replace: true });
    window.scrollTo(0, 0);
  }, [activeTab, navigate]);

  // Fetch Booking Request
  const {
    data: TrainersBookingRequestData = [],
    isLoading: isBookingLoading,
    error: bookingError,
    refetch: refetchBooking,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["TrainersBookingRequestData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Trainers_Booking_Request/Booker/${user.email}`
      );
      return res.data || [];
    },
    retry: false,
  });

  // Fetch Booking History
  const {
    data: TrainersBookingHistoryData = [],
    isLoading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["TrainersBookingHistoryData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Trainer_Booking_History?email=${user.email}`
      );
      return res.data || [];
    },
    retry: false,
  });

  const refetch = () => {
    refetchBooking();
    refetchHistory();
  };

  if (isBookingLoading || isHistoryLoading) return <Loading />;
  if (bookingError || historyError) return <FetchingError />;

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${UserTrainerManagementBackground})` }}
    >
      <div className="bg-gradient-to-b from-gray-500/50 to-gray-800/50 min-h-screen">
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
          {/* Sidebar Icons */}
          <div className="flex flex-row md:flex-col items-center bg-white/40">
            {icons.map(({ src, alt, id, label }) => (
              <TooltipIcon
                key={id}
                src={src}
                alt={alt}
                id={id}
                label={label}
                onClick={() => setActiveTab(id)}
                isActive={activeTab === id}
              />
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 text-black bg-[#f6eee3] border-[10px] border-[#A1662F] min-h-screen">
            {activeTab === "User-Active-Session" && (
              <UserTrainerActiveSession />
            )}
            {activeTab === "User-Booking-Session" && (
              <UserTrainerBookingSession
                TrainersBookingRequestData={TrainersBookingRequestData}
                refetch={refetch}
              />
            )}
            {activeTab === "User-Session-History" && (
              <UserTrainerSessionHistory
                TrainersBookingHistoryData={TrainersBookingHistoryData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrainerManagement;

// Tooltip Icon
const TooltipIcon = ({ src, alt, id, label, onClick, isActive }) => (
  <>
    <div
      data-tooltip-id={id}
      onClick={onClick}
      className={`${
        isActive ? "bg-[#c4a07f]" : "bg-[#A1662F]"
      } hover:bg-[#c4a07f] w-16 h-16 flex items-center justify-center shadow-md hover:scale-105 transition-transform border-b md:border-r md:border-b-0 cursor-pointer`}
    >
      <img src={src} alt={alt} className="w-6 h-6" />
    </div>
    <Tooltip
      id={id}
      place="right"
      effect="solid"
      style={{ backgroundColor: "#c4a07f" }}
    >
      <p className="bg-[#c4a07f] text-black py-1 px-2 font-semibold">{label}</p>
    </Tooltip>
  </>
);

TooltipIcon.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};
