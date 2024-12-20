/* eslint-disable react/prop-types */
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Title from "../../../Shared/Componenet/Title";
import { Link } from "react-router";

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
        breakpoint: 1024, // Tablet view
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768, // Mobile view
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handleSliderPause = () => sliderRef.current.slickPause();
  const handleSliderPlay = () => sliderRef.current.slickPlay();

  return (
    <div className="py-16">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <Title titleContent="What Our Clients Say About Us" />

        {/* Testimonials Carousel */}
        <Slider ref={sliderRef} {...settings} className="mt-6 md:mt-16 md:px-2">
          {testimonialsData.map(({ _id, imageUrl, name, role, quote }) => (
            <div
              key={_id}
              className="md:px-4"
              onMouseEnter={handleSliderPause}
              onMouseLeave={handleSliderPlay}
            >
              <div className="bg-white shadow-lg rounded-lg p-6 h-[200px] transition-transform transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-16 h-16 rounded-full border-2 border-[#F72C5B]"
                  />
                  <div className="ml-4 text-left">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {name}
                    </h3>
                    <p className="text-sm text-gray-600">{role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">&quot;{quote}&quot;</p>
              </div>
            </div>
          ))}
        </Slider>

        {/* Read More Stories Button */}
        <div className="mt-8">
          <Link to={'/About/Testimonials'}>
            <button className="px-12 md:px-24 py-3 font-semibold bg-[#F72C5B] text-white hover:bg-white hover:text-[#F72C5B] rounded-lg transition-transform transform hover:scale-105">
              Read More Stories
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
