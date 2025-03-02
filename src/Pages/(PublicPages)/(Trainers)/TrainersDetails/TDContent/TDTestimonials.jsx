/* eslint-disable react/prop-types */
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar } from "react-icons/fa"; // Star icon for rating

const TDTestimonials = ({ TrainerDetails }) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
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
  // Function to render stars based on the rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`inline-block text-yellow-500 ${
            i <= rating ? "filled" : "empty"
          }`}
        />
      );
    }
    return stars;
  };

  console.log(TrainerDetails);

  return (
    <div className="max-w-[6xl] mx-auto p-5 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Client Testimonials
      </h2>

      {/* Average Rating */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="text-3xl font-bold text-yellow-500">
          {(
            TrainerDetails.testimonials.reduce(
              (acc, curr) => acc + curr.rating,
              0
            ) / TrainerDetails.testimonials.length
          ).toFixed(1)}{" "}
          {/* Display the average rating */}
        </div>
        <div className="flex">
          {renderStars(
            TrainerDetails.testimonials.reduce(
              (acc, curr) => acc + curr.rating,
              0
            ) / TrainerDetails.testimonials.length
          )}
        </div>
        <p className="text-gray-600">
          ({TrainerDetails.testimonials.length} reviews)
        </p>
      </div>

      {/* Review Slider */}
      <Slider {...sliderSettings}>
        {TrainerDetails.testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-gray-100 border border-gray-200 p-6 rounded-lg shadow-xs mx-2 h-[180px]"
          >
            <h3 className="font-semibold text-lg text-gray-700">
              {testimonial.clientName}
            </h3>
            <div className="my-2 flex">{renderStars(testimonial.rating)}</div>
            <p className="text-gray-600">{testimonial.testimonial}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TDTestimonials;
