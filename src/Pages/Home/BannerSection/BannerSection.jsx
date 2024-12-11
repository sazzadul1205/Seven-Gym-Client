import { useState, useEffect } from "react";

const bannerData = [
  {
    image: "https://i.ibb.co.com/7GjcQZz/Banner-01.jpg",
    title: "Welcome to Our Platform",
    description: "Discover a world of opportunities with us.",
    buttonName: "Learn More",
    link: "/about",
  },
  {
    image: "https://i.ibb.co.com/TtscQVb/Banner-02.jpg",
    title: "Explore Our Features",
    description: "Advanced tools to help you grow and succeed.",
    buttonName: "Features",
    link: "/features",
  },
  {
    image: "https://i.ibb.co.com/Twk0P8t/Banner-03.jpg",
    title: "Your Success, Our Goal",
    description: "Partnering with you for a brighter future.",
    buttonName: "Our Services",
    link: "/services",
  },
  {
    image: "https://i.ibb.co.com/3hsNGRR/Banner-04.jpg",
    title: "Join Us Today",
    description: "Be a part of our growing community.",
    buttonName: "Sign Up",
    link: "/signup",
  },
  {
    image: "https://i.ibb.co.com/9q9GGCD/Banner-05.jpg",
    title: "Achieve More with Us",
    description: "Take the next step towards your dreams.",
    buttonName: "Contact Us",
    link: "/contact",
  },
];

const BannerSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

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
      <div className="relative w-full h-[400px] lg:h-[750px]">
        {bannerData.map((banner, index) => (
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

export default BannerSection;
