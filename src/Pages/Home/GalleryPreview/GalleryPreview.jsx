import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // No delay between slides
    cssEase: "linear",
  };

  return (
    <div className="py-16 ">
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Gallery Preview
        </h2>
        <div className="bg-white p-[1px] w-1/3 mx-auto"></div>

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
          <button className=" px-24 py-3 font-semibold bg-[#F72C5B] hover:bg-white text-white hover:text-[#F72C5B] items-end gap-5 justify-end mx-auto transform transition-all duration-300 ease-in-out hover:scale-105">
            <span>View Full Gallery</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryPreview;
