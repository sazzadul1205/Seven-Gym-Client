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
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import { FaArrowRight } from "react-icons/fa";

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
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // Functions to control slider behavior on hover
  const handleSliderPause = () => sliderRef.current?.slickPause();
  const handleSliderPlay = () => sliderRef.current?.slickPlay();

  return (
    <div className="py-10 bg-gradient-to-t from-black/40 to-black/70">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <Title titleContent="What Our Clients Say About Us" />

        {/* Testimonials Carousel */}
        {testimonialsData?.length > 0 ? (
          <Slider ref={sliderRef} {...settings} className="mt-2">
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
        <div className="flex justify-center mt-2">
          <Link to="/About/Testimonials">
            <CommonButton
              type="button"
              text="Read More Stories"
              bgColor="OriginalRed"
              px="px-14"
              py="py-3"
              textColor="text-white"
              borderRadius="rounded-xl"
              className=" shadow-lg hover:shadow-2xl"
              icon={<FaArrowRight />}
              iconPosition="after"
            />
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
