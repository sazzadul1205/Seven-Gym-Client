import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const BannerSection = ({ homeBannerData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Setting up the interval for auto-sliding the banners every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % homeBannerData.length);
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [homeBannerData.length]); // Added dependency on homeBannerData length for better control

  // Handle left button click to show previous banner
  const handleLeftClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? homeBannerData.length - 1 : prevIndex - 1
    );
  };

  // Handle right button click to show next banner
  const handleRightClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % homeBannerData.length);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Banner Image */}
      <div className="relative w-full h-[250px] sm:h-[400px] lg:h-[750px]">
        {homeBannerData.map((banner, index) => (
          <img
            key={index}
            src={banner.image}
            alt={`Banner ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Text and Button Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 text-center text-white px-6 py-8 sm:w-[600px] md:w-[800px] lg:h-[400px] md:h-[400px] md:mx-auto md:my-auto rounded-xl">
        <h1 className="text-xl lg:text-4xl font-bold mb-4">
          {homeBannerData[currentIndex].title}
        </h1>
        <p className="text-base lg:text-lg mb-6">
          {homeBannerData[currentIndex].description}
        </p>
        <a
          href={homeBannerData[currentIndex].link}
          className="bg-linear-to-br hover:bg-linear-to-tl from-red-400 to-red-600 text-white py-2 px-16 rounded-sm text-lg"
        >
          {homeBannerData[currentIndex].buttonName}
        </a>
      </div>

      {/* Left Navigation Button */}
      <button
        onClick={handleLeftClick}
        className="absolute top-0 left-0 h-full w-[10%] sm:w-[5%] bg-black hover:bg-[#f35f81] bg-opacity-50 hover:bg-opacity-20 flex items-center justify-center text-white text-3xl sm:text-4xl"
      >
        &#8592; {/* Left Arrow */}
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={handleRightClick}
        className="absolute top-0 right-0 h-full w-[10%] sm:w-[5%] bg-black hover:bg-[#f35f81] bg-opacity-50 hover:bg-opacity-20 flex items-center justify-center text-white text-3xl sm:text-4xl"
      >
        &#8594; {/* Right Arrow */}
      </button>
    </div>
  );
};

// PropTypes for validating the data structure of the prop
BannerSection.propTypes = {
  homeBannerData: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      buttonName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BannerSection;
