/* eslint-disable react/prop-types */
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CDReview = ({ ThisModule }) => {
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
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Calculate the average rating from comments
  const calculateAverageRating = (comments) => {
    if (comments.length === 0) return 0;
    const totalRating = comments.reduce(
      (acc, comment) => acc + comment.rating,
      0
    );
    return totalRating / comments.length;
  };

  const averageRating = calculateAverageRating(ThisModule.comments);

  // Render star ratings
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

  // Handle undefined or empty comments
  const comments = ThisModule?.comments || [];
  const totalReviews = comments.length;

  return (
    <div className="max-w-7xl mx-auto p-6 py-8 bg-white rounded-xl shadow-xl mt-8">
      <div className="px-5">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Reviews ({totalReviews})
        </h3>

        {/* Average Rating Section */}
        {totalReviews > 0 && (
          <div className="flex items-center space-x-4 mb-8">
            <div className="text-3xl font-bold text-yellow-500">
              {averageRating?.toFixed(1) || 0}
            </div>
            {renderStars(averageRating || 0)}
            <p className="text-gray-600">({totalReviews} reviews)</p>
          </div>
        )}
      </div>

      {/* Review Slider */}
      {totalReviews > 0 ? (
        <div className="w-full">
          <Slider {...sliderSettings} className="px-2">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="bg-gray-100 border border-gray-200 p-4 rounded-lg shadow-xs h-[150px] mx-2"
              >
                <p className="text-lg font-medium text-gray-800">
                  {comment.commenterName}
                </p>
                <div className="my-2">{renderStars(comment.rating)}</div>
                <p className="text-gray-600 mt-2">{comment.comment}</p>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-10">
          No reviews available yet.
        </div>
      )}
    </div>
  );
};

export default CDReview;
