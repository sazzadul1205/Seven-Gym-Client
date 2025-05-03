import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Icons
import { FaStar } from "react-icons/fa";
// Router
import { Link } from "react-router";

// TrainerDashboardTestimonials Component
const TrainerDashboardTestimonials = ({ TrainerDetails }) => {
  // Destructure testimonials from props with fallback to an empty array
  const { testimonials = [] } = TrainerDetails || {};

  // Slider settings for react-slick carousel
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
  };

  // Render star rating component
  const renderStars = (rating = 0) => (
    <div className="flex" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className={`text-yellow-500 ${
            i < rating ? "opacity-100" : "opacity-30"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full text-black">
      {/* Section Title */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Trainer Testimonials
      </h2>

      {/* Main Container: Testimonials + Quick Actions */}
      <div className="flex flex-col md:flex-row w-full gap-4">
        {/* ---------------------- Testimonials Section ---------------------- */}
        <div className="w-full md:w-3/4 min-w-0 bg-white shadow-2xl rounded-xl px-6 py-6 space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">
            What Clients Say
          </h2>

          {/* Divider Line */}
          <div className="p-[1px] bg-black" />

          {/* If testimonials exist, show slider, else fallback message */}
          {testimonials.length > 0 ? (
            <Slider {...sliderSettings} className="max-w-[1100px] pt-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-100 border border-gray-200 p-4 rounded-lg shadow-sm mx-2 h-[180px]"
                >
                  {/* Client Name */}
                  <h3 className="font-semibold text-lg text-gray-700 truncate">
                    {testimonial.clientName || "Anonymous"}
                  </h3>

                  {/* Star Rating */}
                  <div className="my-2">{renderStars(testimonial.rating)}</div>

                  {/* Testimonial Text */}
                  <p className="text-gray-600 text-sm line-clamp-4">
                    {testimonial.testimonial || "No feedback provided."}
                  </p>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-gray-500 text-center text-md">
              No testimonials available.
            </p>
          )}
        </div>

        {/* ---------------------- Quick Actions ---------------------- */}
        <div className="w-full md:w-1/4 bg-white shadow-inner rounded-xl p-4 space-y-4">
          {/* Quick Actions Header */}
          <h3 className="text-lg sm:text-xl font-bold text-center mb-2">
            Quick Actions
          </h3>

          {/* Action List Box */}
          <div className="bg-gray-50 rounded-lg p-4 text-gray-800 shadow-md space-y-1 text-sm sm:text-base">
            {/* Action Links */}
            {[
              {
                to: "/Trainer?tab=Trainer_Schedule",
                label: "Add New Session",
                color: "green",
              },
              {
                to: "/Trainer?tab=Trainer_Booking_Request",
                label: "Manage Bookings",
                color: "blue",
              },
              {
                to: "/Trainer?tab=Trainer_Schedule",
                label: "Update Availability",
                color: "yellow",
              },
              {
                to: "/Trainer?tab=Schedule_History",
                label: "View Detailed Reports",
                color: "purple",
              },
              {
                to: "/Trainer?tab=Trainer_Announcement_Board",
                label: "Help & Support",
                color: "red",
              },
            ].map((action, index) => (
              <Link
                key={index}
                to={action.to}
                className={`flex items-center gap-2 px-3 py-1 rounded transition-all duration-200 font-medium text-${action.color}-700 hover:bg-${action.color}-100 hover:text-${action.color}-800`}
              >
                {/* Bullet Dot */}
                <span className={`text-${action.color}-600 text-xl`}>•</span>

                {/* Link Label with Hover Animation */}
                <p className={`hover:ml-2 hover:text-${action.color}-600`}>
                  {action.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type-checking
TrainerDashboardTestimonials.propTypes = {
  TrainerDetails: PropTypes.shape({
    testimonials: PropTypes.arrayOf(
      PropTypes.shape({
        clientName: PropTypes.string,
        rating: PropTypes.number,
        testimonial: PropTypes.string,
      })
    ),
  }),
};

export default TrainerDashboardTestimonials;
