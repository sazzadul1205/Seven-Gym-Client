/* eslint-disable react/prop-types */
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Title from "../../../Shared/Componenet/Title";

const Testimonials = ({ testimonialsData }) => {
  const sliderRef = React.useRef(null);

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
      {
        breakpoint: 1024, // Tablet view: 2 testimonials
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Mobile view: 1 testimonial
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleMouseEnter = () => {
    sliderRef.current.slickPause(); // Pause autoplay
  };

  const handleMouseLeave = () => {
    sliderRef.current.slickPlay(); // Resume autoplay
  };

  return (
    <div className="py-16">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent={"What Our Clients Say About Us"} />
        </div>

        {/* Testimonials Carousel */}
        <Slider ref={sliderRef} {...settings} className="mt-6 md:mt-16 md:px-2">
          {testimonialsData.map((testimonial) => (
            <div
              key={testimonial._id}
              className="md:px-4 relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-white shadow-lg rounded-lg p-6 text-left transform transition-all duration-300 h-[200px]">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-[#F72C5B]"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
            </div>
          ))}
        </Slider>

        {/* Read More Stories Button */}
        <div className="text-center mt-8">
          <button className=" px-12 md:px-24 py-3 font-semibold bg-[#F72C5B] hover:bg-white text-white hover:text-[#F72C5B] items-end gap-5 justify-end mx-auto transform transition-all duration-300 ease-in-out hover:scale-105">
            <span>Read More Stories</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
