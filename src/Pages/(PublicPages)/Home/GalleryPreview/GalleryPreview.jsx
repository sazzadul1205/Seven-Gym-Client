import { Link } from "react-router";

import PropTypes from "prop-types";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Title from "../../../../Shared/Component/Title";

const GalleryPreview = ({ galleryData }) => {
  // Slider Configuration
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

  // Early return if galleryData is empty
  if (!galleryData || galleryData.length === 0) {
    return null;
  }

  return (
    <div className="py-10 bg-gradient-to-b from-black/20 to-black/40">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent="Our Gallery Preview" />
        </div>

        <div className="mt-11">
          {/* Top Slider - Moves in Reverse Direction */}
          <div className="overflow-hidden">
            <Slider
              {...sliderSettings}
              className="slider-left"
              style={{ transform: "scaleX(-1)" }} // Reverse direction
            >
              {galleryData.map((image) => (
                <div key={image._id}>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={image.url}
                      alt={image.alt || "Gallery image"}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Bottom Slider - Normal Direction */}
          <div className="overflow-hidden">
            <Slider {...sliderSettings} className="slider-right">
              {galleryData.map((image) => (
                <div key={image._id}>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={image.url}
                      alt={image.alt || "Gallery image"}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Button: View Full Gallery */}
        <div className="text-center mt-8">
          <Link to="/Gallery">
            <button className="bg-gradient-to-bl hover:bg-gradient-to-tr from-[#d1234f] to-[#fc003f] px-14 py-3 text-xl font-semibold text-white rounded-xl shadow-lg hover:shadow-2xl">
              View Full Gallery
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation to ensure correct props
GalleryPreview.propTypes = {
  galleryData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      alt: PropTypes.string,
    })
  ).isRequired,
};

export default GalleryPreview;
