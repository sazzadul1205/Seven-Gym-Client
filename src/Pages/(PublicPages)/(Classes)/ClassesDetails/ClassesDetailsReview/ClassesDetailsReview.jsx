import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ClassesDetailsReview = ({ ThisModule }) => {
  // Slider settings for responsive reviews display
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
      {
        breakpoint: 1024, // Tablet view
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Mobile view
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Extract comments from module (handle undefined case)
  const comments = ThisModule?.comments || [];

  // Calculate average rating from comments
  const calculateAverageRating = (comments) => {
    if (comments.length === 0) return 0;
    const totalRating = comments.reduce(
      (acc, comment) => acc + (comment.rating || 0),
      0
    );
    return totalRating / comments.length;
  };

  const averageRating = calculateAverageRating(comments);

  // Function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {Array(fullStars)
          .fill(null)
          .map((_, index) => (
            <span key={`full-${index}`} className="text-yellow-500">
              ★
            </span>
          ))}
        {halfStar && <span className="text-yellow-500">★</span>}
        {Array(emptyStars)
          .fill(null)
          .map((_, index) => (
            <span key={`empty-${index}`} className="text-gray-400">
              ★
            </span>
          ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-5 bg-gradient-to-bl from-gray-200 to-gray-400 shadow-lg rounded-lg mt-8 mb-1">
      {/* Section Title */}
      <h3 className="text-2xl font-semibold text-gray-800 pb-2 border-b-2 border-gray-100">
        Class Reviews
      </h3>

      <div className="pt-2">
        {/* Average Rating Display */}
        <div className="flex items-center space-x-4 mb-3 py-1 bg-white border-2 border-gray-500 px-2 rounded-md">
          <div className="text-3xl font-bold text-yellow-500">
            {averageRating.toFixed(1)}
          </div>
          {renderStars(Math.round(averageRating))}
          <p className="text-gray-600">[{comments.length} reviews]</p>
        </div>

        {/* Review Slider or No Reviews Message */}
        {comments.length > 0 ? (
          <Slider {...sliderSettings} className="px-2">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="bg-gray-100 border border-gray-200 p-6 rounded-lg shadow-xs mx-2 h-[180px]"
              >
                <h3 className="font-semibold text-lg text-gray-700">
                  {comment.commenterName || "Anonymous"}
                </h3>
                <div className="my-2">{renderStars(comment.rating)}</div>
                <p className="text-gray-600 mt-2">
                  {comment.comment || "No comment provided."}
                </p>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-gray-500 text-lg text-center">
            No reviews available yet.
          </p>
        )}
      </div>
    </div>
  );
};

// PropTypes validation
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
