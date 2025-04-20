import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@tanstack/react-query";

// Import Background
import UserTrainerManagementBackground from "../../../assets/User-Trainer-Management-Background/UserTrainerManagementBackground.jpg";

// Import Tab Content
import UserTrainerTestimonials from "./UserTrainerTestimonials/UserTrainerTestimonials";
import UserTrainerActiveSession from "./UserTrainerActiveSession/UserTrainerActiveSession";
import UserTrainerSessionHistory from "./UserTrainerSessionHistory/UserTrainerSessionHistory";
import UserTrainerBookingSession from "./UserTrainerBookingSession/UserTrainerBookingSession";

// Import Hooks
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";
import UserSessionInvoice from "./UserSessionInvoice/UserSessionInvoice";

// Tab Icons
const icons = [
  {
    src: "https://i.ibb.co/gF6qkSKF/Active-Trainer.png",
    alt: "Active Sessions",
    id: "User-Active-Session",
    label: "Active Session's",
  },
  {
    src: "https://i.ibb.co/LdVXnyDK/Trainer-Booking.png",
    alt: "Booking Request",
    id: "User-Booking-Session",
    label: "Booking Session's",
  },
  {
    src: "https://i.ibb.co/SXM5XxWG/Trainer-History.png",
    alt: "History",
    id: "User-Session-History",
    label: "Session's History",
  },
  {
    src: "https://i.ibb.co.com/w2GjrCs/customer-satisfaction.png",
    alt: "Review",
    id: "User-Trainer-Review",
    label: "Trainer's Review",
  },
  {
    src: "https://i.ibb.co.com/LD1shHFP/invoice.png",
    alt: "Invoice",
    id: "User-Session-Invoice",
    label: "Session's Invoice",
  },
];

const UserTrainerManagement = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Use Cases Call
  const navigate = useNavigate();
  const location = useLocation();

  // Extract tab parameter from URL
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "User-Booking-Session";

  // Tab Management
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update URL when activeTab changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    navigate({ search: params.toString() }, { replace: true });
    window.scrollTo(0, 0); // Scroll to top
  }, [activeTab, navigate]);

  // Fetch all Trainer Booking Request Request
  const {
    data: TrainersBookingRequestData = [],
    isLoading: TrainersBookingRequestIsLoading,
    error: TrainersBookingRequestError,
    refetch: TrainersBookingRequestRefetch,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["TrainersBookingRequestData", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_Request/Booker/${user.email}`
        );
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No bookings found — not a real error
          return [];
        }

        throw err;
      }
    },
  });

  // Fetch all Trainer Booking History Request
  const {
    data: TrainersBookingHistoryData = [],
    isLoading: TrainersBookingHistoryIsLoading,
    error: TrainersBookingHistoryError,
    refetch: TrainersBookingHistoryRefetch,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["TrainersBookingHistoryData", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_History?email=${user.email}`
        );
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No bookings found — not a real error
          return [];
        }
        throw err;
      }
    },
  });

  // Fetch all Trainer Booking History Request
  const {
    data: TrainersBookingAcceptedData = [],
    isLoading: TrainersBookingAcceptedIsLoading,
    error: TrainersBookingAcceptedError,
    refetch: TrainersBookingAcceptedRefetch,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["TrainersBookingAcceptedData", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Booking_Accepted?email=${user.email}`
        );
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No bookings found — not a real error
          return [];
        }
        throw err; // Re-throw other errors (e.g., 500, 401, etc.)
      }
    },
  });

  // Fetch User Trainer Profile
  const {
    data: TrainerStudentHistoryData = [],
    isLoading: TrainerStudentHistoryIsLoading,
    error: TrainerStudentHistoryError,
    refetch: TrainerStudentHistoryRefetch,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["TrainerStudentHistoryData", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Trainer_Student_History/ByBooker?bookerEmail=${user?.email}`
        );
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No bookings found — not a real error
          return [];
        }
        throw err; // Re-throw other errors (e.g., 500, 401, etc.)
      }
    },
  });

  // Fetch user basic data
  const {
    data: UserBasicData,
    isLoading: UserBasicIsLoading,
    error: UserBasicError,
    refetch: UserBasicRefetch,
  } = useQuery({
    queryKey: ["UserBasicData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Users/BasicProfile?email=${user?.email}`
      );
      return res.data;
    },
  });

  // Fetch Session Payment Invoice
  const {
    data: SessionPaymentInvoicesData,
    isLoading: SessionPaymentInvoicesIsLoading,
    error: SessionPaymentInvoicesError,
    refetch: SessionPaymentInvoicesRefetch,
  } = useQuery({
    queryKey: ["SessionPaymentInvoices", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Trainer_Session_Payment?bookerEmail=${user?.email}`
      );
      return res.data;
    },
  });

  // Fetch Session Refund Invoices Data
  const {
    data: SessionRefundInvoicesData,
    isLoading: SessionRefundInvoicesIsLoading,
    error: SessionRefundInvoicesError,
    refetch: SessionRefundInvoicesRefetch,
  } = useQuery({
    queryKey: ["SessionPaymentInvoices", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Trainer_Session_Payment?bookerEmail=${user?.email}`
      );
      return res.data;
    },
  });

  // Refetch Everything
  const refetch = async () => {
    await UserBasicRefetch?.();
    await TrainerStudentHistoryRefetch?.();
    await SessionRefundInvoicesRefetch?.();
    await TrainersBookingHistoryRefetch?.();
    await TrainersBookingRequestRefetch?.();
    await SessionPaymentInvoicesRefetch?.();
    await TrainersBookingAcceptedRefetch?.();
  };

  // Load State
  if (
    UserBasicIsLoading ||
    SessionRefundInvoicesIsLoading ||
    TrainerStudentHistoryIsLoading ||
    TrainersBookingRequestIsLoading ||
    TrainersBookingHistoryIsLoading ||
    SessionPaymentInvoicesIsLoading ||
    TrainersBookingAcceptedIsLoading
  )
    return <Loading />;

  // Error State
  if (
    UserBasicError ||
    SessionRefundInvoicesError ||
    TrainerStudentHistoryError ||
    TrainersBookingRequestError ||
    TrainersBookingHistoryError ||
    SessionPaymentInvoicesError ||
    TrainersBookingAcceptedError
  )
    return <FetchingError />;

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${UserTrainerManagementBackground})` }}
    >
      <div className="bg-gradient-to-b from-gray-500/50 to-gray-800/50 min-h-screen">
        <div className="flex flex-col md:flex-row  mx-auto max-w-7xl ">
          {/* Sidebar with icons */}
          <div className="flex flex-row md:flex-col items-center space-x-1 md:pt-2 bg-white/40">
            {icons.map(({ src, alt, id, label }) => (
              <TooltipIcon
                key={id}
                src={src}
                alt={alt}
                id={id}
                label={label}
                onClick={() => setActiveTab(id)} // Set active tab on click
                isActive={activeTab === id} // Highlight active tab
              />
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 text-black bg-[#f6eee3] border-[10px] border-[#A1662F] min-h-screen">
            {/* User Active Session Tab */}
            {activeTab === "User-Active-Session" && (
              <UserTrainerActiveSession
                refetch={refetch}
                TrainersBookingAcceptedData={TrainersBookingAcceptedData}
              />
            )}

            {/* User Booking Session Tab */}
            {activeTab === "User-Booking-Session" && (
              <UserTrainerBookingSession
                refetch={refetch}
                TrainersBookingRequestData={TrainersBookingRequestData}
              />
            )}
            {/* User Session History Tab */}
            {activeTab === "User-Session-History" && (
              <UserTrainerSessionHistory
                TrainersBookingHistoryData={TrainersBookingHistoryData || {}}
              />
            )}
            {/* User Trainer Review Tab */}
            {activeTab === "User-Trainer-Review" && (
              <UserTrainerTestimonials
                refetch={refetch}
                UserEmail={user?.email}
                UserBasicData={UserBasicData}
                TrainerStudentHistoryData={TrainerStudentHistoryData}
              />
            )}
            {/* User Trainer Review Tab */}
            {activeTab === "User-Session-Invoice" && (
              <UserSessionInvoice
                SessionRefundInvoicesData={SessionRefundInvoicesData}
                SessionPaymentInvoicesData={SessionPaymentInvoicesData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrainerManagement;

// Tool Tips for Icons
const TooltipIcon = ({ src, alt, id, label, onClick, isActive }) => (
  <>
    <div
      key={id}
      data-tooltip-id={id}
      onClick={onClick}
      className={`${
        isActive ? "bg-[#c4a07f]" : "bg-[#A1662F]"
      } hover:bg-[#c4a07f] text-black w-16 h-16 flex items-center justify-center shadow-md hover:scale-105 transition-transform border-r border-amber-100 cursor-pointer`}
    >
      <img src={src} alt={alt} className="w-6 h-6" />
    </div>
    <Tooltip
      id={id}
      place="right"
      effect="solid"
      style={{ backgroundColor: "#c4a07f" }}
    >
      <p className="bg-[#c4a07f] text-black py-1 px-0 font-semibold">{label}</p>
    </Tooltip>
  </>
);

// Prop Type Validation for TooltipIcon
TooltipIcon.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};
