import { useRef } from "react";

// Import Packages
import { Tooltip } from "react-tooltip";
import PropTypes from "prop-types";

// import Icons
import { FaArrowLeft } from "react-icons/fa";

// Slider Import
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AdminDashboardTestimonialView = ({ TestimonialsData }) => {
  const sliderRef = useRef(null);

  // Slider settings for responsiveness and autoplay
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: true,
  };

  // Functions to control slider behavior on hover
  const handleSliderPause = () => sliderRef.current?.slickPause();
  const handleSliderPlay = () => sliderRef.current?.slickPlay();

  return (
    <div>
      {/* Header */}
      <div className="bg-gray-400 py-2 border-t-2 flex items-center">
        {/* Left: Add Button */}
        <div className="flex-shrink-0 pl-3">
          <button
            id="go-to-testimonials"
            className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
            onClick={() => alert("Fuck")}
          >
            <FaArrowLeft className="text-green-500" />
          </button>
          <Tooltip
            anchorSelect="#go-to-testimonials"
            content="Go To Testimonials"
          />
        </div>

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Testimonial&apos;s
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      {/* Testimonials Carousel */}
      {TestimonialsData?.length > 0 ? (
        <Slider ref={sliderRef} {...settings} className="px-5">
          {TestimonialsData.map(({ _id, imageUrl, name, role, quote }) => (
            <div
              key={_id}
              className="py-5"
              onMouseEnter={handleSliderPause}
              onMouseLeave={handleSliderPlay}
            >
              <div className="bg-linear-to-bl hover:bg-linear-to-bl from-gray-100 to-gray-300 rounded-2xl shadow hover:shadow-2xl h-[200px]  p-4 ml-2 ">
                {/* Client Info */}
                <div className="flex items-center mb-4 border-b-2 border-black/70 pb-4">
                  {/* Avatar */}
                  <img
                    src={imageUrl}
                    alt={name || "Client Image"}
                    className="w-16 h-16 rounded-full border-2 border-[#F72C5B]"
                    loading="lazy"
                  />

                  {/* Info */}
                  <div className="ml-4 text-left">
                    {/* Name */}
                    <h3 className="text-lg font-semibold text-gray-800">
                      {name || "Anonymous"}
                    </h3>
                    {/* Role */}
                    <p className="text-sm text-gray-600">{role || "Client"}</p>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <p className="text-gray-700 italic">
                  &quot;{quote || "No testimonial available."}&quot;
                </p>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-black font-bold mt-6 w-full text-center">
          No testimonials available.
        </p>
      )}
    </div>
  );
};

// Prop Validation
AdminDashboardTestimonialView.propTypes = {
  TestimonialsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      name: PropTypes.string,
      role: PropTypes.string,
      quote: PropTypes.string,
    })
  ),
};

export default AdminDashboardTestimonialView;
