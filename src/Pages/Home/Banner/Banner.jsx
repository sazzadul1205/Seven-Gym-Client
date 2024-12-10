import { useState, useEffect } from "react";
import Banner1 from "../../../assets/Banners/1.jpg";
import Banner2 from "../../../assets/Banners/2.jpg";
import Banner3 from "../../../assets/Banners/3.jpg";
import Banner4 from "../../../assets/Banners/4.jpg";
import Banner5 from "../../../assets/Banners/5.jpg";

const Banner = () => {
  // In-page JSON with updated banner data
  const bannerData = [
    {
      image: Banner1,
      title: "Welcome to Our Platform",
      description: "Discover a world of opportunities with us.",
      buttonName: "Learn More",
      link: "/about",
    },
    {
      image: Banner2,
      title: "Explore Our Features",
      description: "Advanced tools to help you grow and succeed.",
      buttonName: "Features",
      link: "/features",
    },
    {
      image: Banner3,
      title: "Your Success, Our Goal",
      description: "Partnering with you for a brighter future.",
      buttonName: "Our Services",
      link: "/services",
    },
    {
      image: Banner4,
      title: "Join Us Today",
      description: "Be a part of our growing community.",
      buttonName: "Sign Up",
      link: "/signup",
    },
    {
      image: Banner5,
      title: "Achieve More with Us",
      description: "Take the next step towards your dreams.",
      buttonName: "Contact Us",
      link: "/contact",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Change banner every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerData.length, currentIndex]);

  // Navigation handlers
  const handleLeftClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bannerData.length - 1 : prevIndex - 1
    );
  };

  const handleRightClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Banner Image */}
      <div className="transition-all duration-500 ease-in-out">
        <img
          src={bannerData[currentIndex].image}
          alt={`Banner ${currentIndex + 1}`}
          className="w-full h-[400px] lg:h-[750px] object-cover"
        />
      </div>

      {/* Text and Button Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 text-center text-white px-6 py-8 md:w-[800px] md:h-[400px] md:mx-auto md:my-auto">
        <h1 className="text-2xl lg:text-4xl font-bold mb-4">
          {bannerData[currentIndex].title}
        </h1>
        <p className="text-base lg:text-lg mb-6">
          {bannerData[currentIndex].description}
        </p>
        <a
          href={bannerData[currentIndex].link}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded text-lg"
        >
          {bannerData[currentIndex].buttonName}
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

export default Banner;
