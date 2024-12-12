/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const BannerSection = ({ homeBannerData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % homeBannerData.length);
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleLeftClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? homeBannerData.length - 1 : prevIndex - 1
    );
  };

  const handleRightClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % homeBannerData.length);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Banner Image */}
      <div className="relative w-full h-[400px] lg:h-[750px]">
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
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 text-center text-white px-6 py-8 md:w-[800px] md:h-[400px] md:mx-auto md:my-auto">
        <h1 className="text-xl lg:text-4xl font-bold mb-4">
          {homeBannerData[currentIndex].title}
        </h1>
        <p className="text-base lg:text-lg mb-6">
          {homeBannerData[currentIndex].description}
        </p>
        <a
          href={homeBannerData[currentIndex].link}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded text-lg"
        >
          {homeBannerData[currentIndex].buttonName}
        </a>
      </div>

      {/* Left Navigation Button */}
      <button
        onClick={handleLeftClick}
        className="absolute top-0 left-0 h-full w-[3%] bg-black hover:bg-[#f35f81] bg-opacity-50 hover:bg-opacity-20 flex items-center justify-center text-white text-3xl"
      >
        &#8592;
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={handleRightClick}
        className="absolute top-0 right-0 h-full w-[3%] bg-black hover:bg-[#f35f81] bg-opacity-50 hover:bg-opacity-20 flex items-center justify-center text-white text-3xl"
      >
        &#8594;
      </button>
    </div>
  );
};

export default BannerSection;
