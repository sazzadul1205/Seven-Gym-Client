/* eslint-disable react/prop-types */
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CDReview = ({ ThisModule, averageRating, renderStars }) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 3, // Default number of slides shown
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // No delay between slides
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

  return (
    <div className="max-w-7xl mx-auto p-1 py-5 bg-white shadow-lg rounded-lg mt-8">
      <div className="px-5">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Reviews ({ThisModule.comments.length})
        </h3>

        {/* Average Rating */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="text-3xl font-bold text-yellow-500">
            {averageRating.toFixed(1)} {/* Display the average rating */}
          </div>
          {renderStars(averageRating)}{" "}
          {/* Display stars based on average rating */}
          <p className="text-gray-600">
            ({ThisModule.comments.length} reviews)
          </p>
        </div>
      </div>

      {/* Review Slider */}
      <div className="w-full">
        <Slider {...sliderSettings} className="px-2">
          {ThisModule.comments.map((comment, index) => (
            <div
              key={index}
              className="bg-gray-100 border border-gray-200 p-4 rounded-lg shadow-sm h-[150px] mx-2"
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
    </div>
  );
};

export default CDReview;
