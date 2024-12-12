/* eslint-disable react/prop-types */
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Title from "../../../Shared/Componenet/Title";

const GalleryPreview = ({ galleryData }) => {
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
    <div className="py-16">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent={"Gallery Preview"} />
        </div>

        <div className="mt-11">
          {/* Top Slider */}
          <div className="">
            <Slider
              {...sliderSettings}
              className="slider-left"
              style={{ transform: "scaleX(-1)" }} // Reverse direction
            >
              {galleryData.map((image) => (
                <div key={image.id} className="">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Bottom Slider */}
          <div className="">
            <Slider {...sliderSettings} className="slider-right">
              {galleryData.map((image) => (
                <div key={image.id} className="">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Link to Full Gallery */}
        <div className="text-center mt-8">
          <button className=" px-12 md:px-24 py-3 font-semibold bg-[#F72C5B] hover:bg-white text-white hover:text-[#F72C5B] items-end gap-5 justify-end mx-auto transform transition-all duration-300 ease-in-out hover:scale-105">
            <span>View Full Gallery</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryPreview;
