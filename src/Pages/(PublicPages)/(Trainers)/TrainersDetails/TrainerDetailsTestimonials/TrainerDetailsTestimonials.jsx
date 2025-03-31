import PropTypes from "prop-types";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaStar } from "react-icons/fa"; // Star icon for rating

const TrainerDetailsTestimonials = ({ TrainerDetails }) => {
  // Slider settings for smooth auto-scrolling testimonials
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 3, // Default number of slides shown
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // Continuous scroll effect
    cssEase: "linear",
    arrows: false,
    responsive: [
      {
        breakpoint: 1024, // Tablet view: 2 slides
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Mobile view: 1 slide
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Function to render stars based on the rating
  const renderStars = (rating) => (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className={`text-yellow-500 ${i < rating ? "filled" : "empty"}`}
        />
      ))}
    </div>
  );

  // Extracting testimonials for cleaner usage
  const { testimonials = [] } = TrainerDetails;

  // Calculate average rating, ensuring no division by zero
  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((acc, curr) => acc + curr.rating, 0) /
          testimonials.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="max-w-7xl mx-auto p-5 bg-gradient-to-bl from-gray-200 to-gray-400 shadow-lg rounded-lg mt-8 ">
      {/* Section Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
        Client Testimonials
      </h2>

      {/* Average Rating Display */}
      <div className="flex items-center space-x-4 mb-3 py-1 bg-white border-2 border-gray-500 px-2">
        <div className="text-3xl font-bold text-yellow-500">
          {averageRating}
        </div>
        {renderStars(Math.round(averageRating))}
        <p className="text-gray-600">[{testimonials.length} reviews]</p>
      </div>

      {/* Review Slider */}
      {testimonials.length > 0 ? (
        <Slider {...sliderSettings}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-100 border border-gray-200 p-6 rounded-lg shadow-xs mx-2 h-[180px]"
            >
              <h3 className="font-semibold text-lg text-gray-700">
                {testimonial.clientName}
              </h3>
              <div className="my-2">{renderStars(testimonial.rating)}</div>
              <p className="text-gray-600 mt-2">{testimonial.testimonial}</p>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-gray-500 text-lg text-center">
          No testimonials available.
        </p>
      )}
    </div>
  );
};

// Prop Types for type checking
TrainerDetailsTestimonials.propTypes = {
  TrainerDetails: PropTypes.shape({
    testimonials: PropTypes.arrayOf(
      PropTypes.shape({
        clientName: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        testimonial: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default TrainerDetailsTestimonials;
