import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Tab Content
import UserTrainerTestimonials from "./UserTrainerTestimonials/UserTrainerTestimonials";
import useUserTrainerManagementData from "../../../Utility/useUserTrainerManagementData";
import UserTrainerActiveSession from "./UserTrainerActiveSession/UserTrainerActiveSession";
import UserTrainerSessionHistory from "./UserTrainerSessionHistory/UserTrainerSessionHistory";
import UserTrainerBookingSession from "./UserTrainerBookingSession/UserTrainerBookingSession";

// Import Hooks
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";
import UserSessionInvoice from "./UserSessionInvoice/UserSessionInvoice";
import UserTrainerAnnouncement from "./UserTrainerAnnouncement/UserTrainerAnnouncement";

// Import Background
import UserTrainerManagementBackground from "../../../assets/User-Trainer-Management-Background/UserTrainerManagementBackground.jpg";

// Import Icons
import Invoice from "../../../assets/UserTrainerManagement/invoice.png";
import Announcement from "../../../assets/UserTrainerManagement/announcement.png";
import Active_Trainer from "../../../assets/UserTrainerManagement/Active-Trainer.png";
import TrainerHistory from "../../../assets/UserTrainerManagement/Trainer-History.png";
import Trainer_Booking from "../../../assets/UserTrainerManagement/Trainer-Booking.png";
import Customer_Satisfaction from "../../../assets/UserTrainerManagement/customer-satisfaction.png";

// Tab Icons
const icons = [
  {
    src: Active_Trainer,
    alt: "Active Sessions",
    id: "User-Active-Session",
    label: "Active Session's",
  },
  {
    src: Announcement,
    alt: "Booking Request",
    id: "User-Booking-Session",
    label: "Booking Session's",
  },
  {
    src: Customer_Satisfaction,
    alt: "History",
    id: "User-Session-History",
    label: "Session's History",
  },
  {
    src: Invoice,
    alt: "Review",
    id: "User-Trainer-Review",
    label: "Trainer's Review",
  },
  {
    src: Trainer_Booking,
    alt: "Invoice",
    id: "User-Session-Invoice",
    label: "Session's Invoice",
  },
  {
    src: TrainerHistory,
    alt: "Trainer Announcements",
    id: "User-Trainer-Announcement",
    label: "Trainer Announcements",
  },
];

const UserTrainerManagement = () => {
  const { user } = useAuth();
  const {
    //  IsLoading
    UserBasicIsLoading,
    TrainerAnnouncementIsLoading,
    SessionRefundInvoicesIsLoading,
    TrainerStudentHistoryIsLoading,
    TrainersBookingRequestIsLoading,
    TrainersBookingHistoryIsLoading,
    SessionPaymentInvoicesIsLoading,
    TrainersBookingAcceptedIsLoading,

    // Errors
    UserBasicError,
    TrainerAnnouncementError,
    SessionRefundInvoicesError,
    TrainerStudentHistoryError,
    TrainersBookingRequestError,
    TrainersBookingHistoryError,
    SessionPaymentInvoicesError,
    TrainersBookingAcceptedError,

    // Fetched Data

    UserBasicData,
    TrainerAnnouncementData,
    SessionRefundInvoicesData,
    TrainerStudentHistoryData,
    TrainersBookingRequestData,
    TrainersBookingHistoryData,
    SessionPaymentInvoicesData,
    TrainersBookingAcceptedData,

    // Refetch
    refetchAll,
  } = useUserTrainerManagementData();

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
    window.scrollTo(0, 0);
  }, [activeTab, navigate]);

  // Listen to URL changes and update activeTab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlTab = params.get("tab") || "User-Active-Session";
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Load State
  if (
    UserBasicIsLoading ||
    TrainerAnnouncementIsLoading ||
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
    TrainerAnnouncementError ||
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
                refetch={refetchAll}
                TrainersBookingAcceptedData={TrainersBookingAcceptedData}
              />
            )}

            {/* User Booking Session Tab */}
            {activeTab === "User-Booking-Session" && (
              <UserTrainerBookingSession
                refetch={refetchAll}
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
                refetch={refetchAll}
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
            {/* User Trainer Review Tab */}
            {activeTab === "User-Trainer-Announcement" && (
              <UserTrainerAnnouncement
                TrainerAnnouncementData={TrainerAnnouncementData}
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
