import { useNavigate } from "react-router";

// Import Packages
import PropTypes from "prop-types";

// import icons
import communityPosts from "../../../assets/AdminPanel/communityPosts.png";
import trainerInvoice from "../../../assets/AdminPanel/trainerInvoice.png";
import satisfaction from "../../../assets/AdminPanel/satisfaction.png";
import dashboard from "../../../assets/AdminPanel/dashboard.png";
import homepage from "../../../assets/AdminPanel/homepage.png";
import costumer from "../../../assets/AdminPanel/costumer.png";
import training from "../../../assets/AdminPanel/training.png";
import invoice from "../../../assets/AdminPanel/invoice.png";
import booking from "../../../assets/AdminPanel/booking.png";
import gallery from "../../../assets/AdminPanel/gallery.png";
import weekly from "../../../assets/AdminPanel/weekly.png";
import users from "../../../assets/AdminPanel/users.png";
import coach from "../../../assets/AdminPanel/coach.png";
import add from "../../../assets/AdminPanel/add.png";

// import Components
import AdminDashboardTrainerBookingOverview from "./AdminDashboardTrainerBookingOverview/AdminDashboardTrainerBookingOverview";
import AdminDashboardTierUpgradeGraph from "./AdminDashboardTierUpgradeGraph/AdminDashboardTierUpgradeGraph";
import AdminDashboardTestimonialView from "./AdminDashboardTestimonialView/AdminDashboardTestimonialView";
import AdminDashboardPromotionView from "./AdminDashboardPromotionView/AdminDashboardPromotionView";
import AdminDashboardSessionGraph from "./AdminDashboardSessionGraph/AdminDashboardSessionGraph";
import AdminDashboardCards from "./AdminDashboardCards/AdminDashboardCards";

const AdminDashboard = ({
  TrainerBookingCompletedStatusData,
  TrainerBookingCancelledStatusData,
  TrainerSessionCompletedStatusData,
  TrainerBookingAcceptedStatusData,
  ClassBookingCompletedStatusData,
  TrainerBookingRequestStatusData,
  TrainerSessionPaymentStatusData,
  TrainerSessionRefundStatusData,
  TrainerSessionActiveStatusData,
  ClassBookingPaymentStatusData,
  ClassBookingRefundStatusData,
  DailyTierUpgradePaymentData,
  DailyTierUpgradeRefundData,
  TestimonialsData,
  AllTrainersData,
  PromotionsData,
  AllUsersData,
}) => {
  const navigate = useNavigate();

  // Function to navigate to different admin tabs
  const handleNavigate = (tabId) => {
    navigate(`/Admin?tab=${tabId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Quick link cards data for navigation
  const quickLinks = [
    { id: "Dashboard", title: "Dashboard", icon: dashboard },
    { id: "All_Users", title: "All Users", icon: users },
    { id: "All_Trainers", title: "All Trainers", icon: coach },
    {
      id: "Tier_Upgrade_Invoices",
      title: "Tier Upgrade Invoices",
      icon: invoice,
    },
    {
      id: "Trainer_Sessions_Invoices",
      title: "Trainer Sessions Invoices",
      icon: trainerInvoice,
    },
    {
      id: "Trainer_Sessions_Bookings",
      title: "Trainer Bookings",
      icon: booking,
    },
    {
      id: "Class_Bookings",
      title: "Class Bookings",
      icon: training,
    },
    { id: "Trainer_Schedule", title: "Trainer Schedule", icon: weekly },
    { id: "Home_Page_View", title: "Home Page View", icon: homepage },
    { id: "Gallery_Page_View", title: "Gallery Page View", icon: gallery },
    { id: "Testimonials", title: "Testimonials", icon: costumer },
    { id: "Community_Posts", title: "Community Posts", icon: communityPosts },
    { id: "Feedback", title: "Feedback", icon: satisfaction },
    { id: "All_Extra_Page_Management", title: "Extra Pages", icon: add },
  ];

  return (
    <div className="text-black">
      {/* Section: Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Admin Dashboard
        </h3>
      </div>

      {/* Section: Summary Cards */}
      <AdminDashboardCards
        AllUsersData={AllUsersData}
        AllTrainersData={AllTrainersData}
        DailyTierUpgradeRefundData={DailyTierUpgradeRefundData}
        DailyTierUpgradePaymentData={DailyTierUpgradePaymentData}
        ClassBookingRefundStatusData={ClassBookingRefundStatusData}
        ClassBookingPaymentStatusData={ClassBookingPaymentStatusData}
        TrainerSessionRefundStatusData={TrainerSessionRefundStatusData}
        TrainerSessionActiveStatusData={TrainerSessionActiveStatusData}
        TrainerSessionPaymentStatusData={TrainerSessionPaymentStatusData}
        ClassBookingCompletedStatusData={ClassBookingCompletedStatusData}
        TrainerSessionCompletedStatusData={TrainerSessionCompletedStatusData}
      />

      {/* Section: Tier Upgrade Stats Graph */}
      <AdminDashboardTierUpgradeGraph
        DailyTierUpgradePaymentData={DailyTierUpgradePaymentData}
        DailyTierUpgradeRefundData={DailyTierUpgradeRefundData}
      />

      {/* Section: Trainer Booking Stats Graph */}
      <AdminDashboardSessionGraph
        TrainerBookingRequestStatusData={TrainerBookingRequestStatusData}
        TrainerBookingAcceptedStatusData={TrainerBookingAcceptedStatusData}
        TrainerBookingCompletedStatusData={TrainerBookingCompletedStatusData}
        TrainerBookingCancelledStatusData={TrainerBookingCancelledStatusData}
      />

      {/* Section: Booking Overview Table */}
      <AdminDashboardTrainerBookingOverview
        TrainerBookingRequestStatusData={TrainerBookingRequestStatusData}
        TrainerBookingAcceptedStatusData={TrainerBookingAcceptedStatusData}
        TrainerBookingCompletedStatusData={TrainerBookingCompletedStatusData}
        TrainerBookingCancelledStatusData={TrainerBookingCancelledStatusData}
      />

      {/* Section: Promotions Carousel */}
      <AdminDashboardPromotionView PromotionsData={PromotionsData} />

      {/* Section: Testimonials Carousel */}
      <AdminDashboardTestimonialView TestimonialsData={TestimonialsData} />

      {/* Section: Quick Links Grid */}
      <>
        <div className="relative bg-gray-400 px-4 py-3 text-white rounded-t flex items-center justify-center">
          <h3 className="text-lg font-semibold text-center">Admin Overview</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 py-2 px-5">
          {quickLinks.map((link) => (
            <div
              key={link.id}
              onClick={() => handleNavigate(link.id)}
              className="flex flex-col items-center justify-center p-4 bg-white border rounded-xl shadow hover:shadow-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <img
                src={link.icon}
                alt={link.title}
                className="w-10 h-10 mb-2"
              />
              <p className="text-sm font-medium text-gray-700 text-center">
                {link.title}
              </p>
            </div>
          ))}
        </div>
      </>
    </div>
  );
};

// Prop Validation
AdminDashboard.propTypes = {
  TrainerBookingCompletedStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  TrainerBookingCancelledStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  TrainerSessionCompletedStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  TrainerBookingAcceptedStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  TrainerBookingRequestStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  TrainerSessionPaymentStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  TrainerSessionRefundStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  TrainerSessionActiveStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  ClassBookingCompletedStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  ClassBookingPaymentStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  ClassBookingRefundStatusData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  DailyTierUpgradePaymentData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  DailyTierUpgradeRefundData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  TestimonialsData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  AllTrainersData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  PromotionsData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  AllUsersData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default AdminDashboard;
