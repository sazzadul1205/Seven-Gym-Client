// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Slider
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Icons
import { IoSettings } from "react-icons/io5";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const ManagementClassTestimonial = ({ selectedClass }) => {
  const comments = selectedClass?.comments || [];

// Slider settings for react-slick
const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
};

  return (
    <section className="relative bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-10 rounded-none md:rounded-xl shadow-inner">
      {/* Settings Icon (Top Left) */}
      <>
        <div
          className="absolute top-2 right-2 bg-gray-600/90 p-3 rounded-full cursor-pointer "
          data-tooltip-id="Class_Testimonial_Edit"
          onClick={() =>
            document.getElementById("Class_Testimonials_Edit_Modal").showModal()
          }
        >
          <IoSettings className="text-red-500 text-3xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </div>
        <Tooltip
          id="Class_Testimonial_Edit"
          place="top"
          className="z-50"
          content="View Testimonials"
        />
      </>

      {/* Section Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 border-b-2 border-gray-100 pb-3 gap-y-3 md:gap-y-0">
        <h3 className="text-2xl text-white font-semibold">
          Class Testimonials
        </h3>
      </header>
      {/* Slider Container */}
      <div className="w-full max-w-6xl mx-auto pt-2 overflow-hidden">
        {comments.length > 0 ? (
          <Slider {...sliderSettings} className="px-2">
            {comments.map((comment, index) => (
              <div key={index} className="px-0 w-full mx-auto">
                <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm h-[180px] overflow-hidden flex flex-col justify-start">
                  <h4 className="font-semibold text-lg text-gray-800 py-1">
                    {comment.commenterName || "Anonymous"}
                  </h4>
                  <StarRating rating={comment.rating} />
                  <p className="text-black line-clamp-3 pt-3 text-sm">
                    {comment.comment || "No comment provided."}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-gray-500 text-center text-lg">
            No reviews available yet.
          </p>
        )}
      </div>
    </section>
  );
};

// Prop Validation
ManagementClassTestimonial.propTypes = {
  selectedClass: PropTypes.shape({
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        commenterName: PropTypes.string,
        rating: PropTypes.number,
        comment: PropTypes.string,
      })
    ),
  }),
};

export default ManagementClassTestimonial;

// Star rating component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-500" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-gray-400" />
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};
