import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

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

const ClassesDetailsReview = ({ ThisModule }) => {
  const comments = ThisModule?.comments || [];

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
    <section className="bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-32 rounded-none md:rounded-xl shadow-inner">
      {/* Section Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 border-b-2 border-gray-100 pb-3 gap-y-3 md:gap-y-0">
        <h3 className="text-2xl text-white font-semibold">
          Class Testimonials
        </h3>
      </header>

      <div className="pt-1">
        {/* Review List */}
        {comments.length > 0 ? (
          <Slider {...sliderSettings} className="px-0 md:px-2">
            {comments.map((comment, index) => (
              <div key={index} className="p-2">
                <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-sm h-[180px] overflow-hidden">
                  <h4 className="font-semibold text-lg text-gray-800 py-1">
                    {comment.commenterName || "Anonymous"}
                  </h4>
                  <StarRating rating={comment.rating} />
                  <p className="text-black line-clamp-3 pt-3">
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

ClassesDetailsReview.propTypes = {
  ThisModule: PropTypes.shape({
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        commenterName: PropTypes.string,
        rating: PropTypes.number,
        comment: PropTypes.string,
      })
    ),
  }),
};

export default ClassesDetailsReview;
