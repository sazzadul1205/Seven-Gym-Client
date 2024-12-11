import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Title from "../../../Shared/Componenet/Title";

const galleryImages = [
  { id: 1, url: "https://via.placeholder.com/300x200", alt: "Gym Equipment 1" },
  { id: 2, url: "https://via.placeholder.com/300x200", alt: "Gym Equipment 2" },
  { id: 3, url: "https://via.placeholder.com/300x200", alt: "Gym Equipment 3" },
  { id: 4, url: "https://via.placeholder.com/300x200", alt: "Workout Area" },
  { id: 5, url: "https://via.placeholder.com/300x200", alt: "Yoga Space" },
  { id: 6, url: "https://via.placeholder.com/300x200", alt: "Strength Area" },
  { id: 7, url: "https://via.placeholder.com/300x200", alt: "Cardio Zone" },
  { id: 8, url: "https://via.placeholder.com/300x200", alt: "Swimming Pool" },
  {
    id: 9,
    url: "https://via.placeholder.com/300x200",
    alt: "Free Weights Area",
  },
  {
    id: 10,
    url: "https://via.placeholder.com/300x200",
    alt: "Fitness Classes",
  },
];



const GalleryPreview = () => {
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
              {galleryImages.map((image) => (
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
              {galleryImages.map((image) => (
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
