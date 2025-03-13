import { useRef } from "react";
import { Link } from "react-router";

// Imports
import PropTypes from "prop-types";

// Slider Import
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Component Import
import Title from "../../../../Shared/Component/Title";

const Testimonials = ({ testimonialsData = [] }) => {



  
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
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } }, // Tablet view
      { breakpoint: 768, settings: { slidesToShow: 1 } }, // Mobile view
    ],
  };

  // Functions to control slider behavior on hover
  const handleSliderPause = () => sliderRef.current?.slickPause();
  const handleSliderPlay = () => sliderRef.current?.slickPlay();

  return (
    <div className="py-10 bg-gradient-to-t from-black/40 to-black/70">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Title */}
        <Title titleContent="What Our Clients Say About Us" />

        {/* Testimonials Carousel */}
        {testimonialsData?.length > 0 ? (
          <Slider ref={sliderRef} {...settings} className="mt-8">
            {testimonialsData.map(({ _id, imageUrl, name, role, quote }) => (
              <div
                key={_id}
                className="py-5"
                onMouseEnter={handleSliderPause}
                onMouseLeave={handleSliderPlay}
              >
                <div className="bg-white shadow-lg rounded-lg p-6 h-[200px] transition-transform transform hover:scale-105 ml-2">
                  {/* Client Info */}
                  <div className="flex items-center mb-4 border-b-2 border-black/70 pb-4">
                    <img
                      src={imageUrl}
                      alt={name || "Client Image"}
                      className="w-16 h-16 rounded-full border-2 border-[#F72C5B]"
                      loading="lazy"
                    />
                    <div className="ml-4 text-left">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {name || "Anonymous"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {role || "Client"}
                      </p>
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
          <p className="text-gray-400 mt-6">No testimonials available.</p>
        )}

        {/* Read More Stories Button */}
        <div className="mt-8">
          <Link to="/About/Testimonials">
            <button className="bg-linear-to-bl hover:bg-linear-to-tr from-[#d1234f] to-[#fc003f] px-14 py-3 text-xl font-semibold text-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
              Read More Stories
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

Testimonials.propTypes = {
  testimonialsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      name: PropTypes.string,
      role: PropTypes.string,
      quote: PropTypes.string,
    })
  ),
};

export default Testimonials;
