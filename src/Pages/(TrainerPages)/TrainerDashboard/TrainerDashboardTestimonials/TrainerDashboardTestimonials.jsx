// Imp[ort Slider Data
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Icons
import { FaStar } from "react-icons/fa";

const TrainerDashboardTestimonials = ({ TrainerDetails }) => {
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

  return (
    <div className="w-full text-black">
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Trainer Testimonials
      </h2>

      {/* Testimonials & Quick Action */}
      <div className="flex flex-col md:flex-row w-full gap-2">
        {/* Testimonials */}
        <div className="w-3/4 bg-white shadow-2xl rounded-xl px-5 py-5">
          {/* Section Title */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Client Testimonials
          </h2>

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
                  <p className="text-gray-600 mt-2">
                    {testimonial.testimonial}
                  </p>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-gray-500 text-lg text-center">
              No testimonials available.
            </p>
          )}
        </div>
        <div className="w-1/4 bg-red-400 py-5 px-1"></div>
      </div>
    </div>
  );
};

export default TrainerDashboardTestimonials;
