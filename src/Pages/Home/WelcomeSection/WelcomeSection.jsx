import { FaChevronRight } from "react-icons/fa";

const overlayData = {
  videoUrl:
    "https://www.youtube.com/embed/Y5RtQ4cawVk?autoplay=1&mute=1&loop=1&playlist=Y5RtQ4cawVk",
  title: "Achieve Your Fitness Goals with Us!",
  description:
    "Join our community and transform your health with state-of-the-art facilities, personalized coaching, and a motivating environment.",
};

const WelcomeSection = () => {
  return (
    <div className="hidden md:flex relative h-screen w-full text-white ">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={overlayData.videoUrl}
          title="Background Video"
          className="w-full h-full object-cover" // Ensures the video fills the entire screen
          allow="autoplay; fullscreen"
          frameBorder="0"
        ></iframe>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 px-6">
        {/* Hero Text */}
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-center mb-4 max-w-3xl">
          {overlayData.title}
        </h1>
        <p className="text-sm sm:text-lg lg:text-xl text-center mb-6 max-w-2xl opacity-80 sm:opacity-90">
          {overlayData.description}
        </p>

        {/* Call to Action (CTA) Buttons */}
        <div className="flex gap-4">
          {/* Hardcoded buttons */}
          <a
            href="/classes"
            className="bg-transparent border border-white hover:bg-blue-500 hover:text-white text-white py-3 px-6 rounded-lg text-sm md:text-lg transition duration-300 flex items-center justify-between"
          >
            <span>View Classes</span>
          </a>

          <a
            href="/join-now"
            className="bg-blue-500 hover:bg-gradient-to-l from-blue-700 to-blue-400 text-white py-3 px-6 rounded-lg text-sm md:text-lg transition duration-300 flex items-center justify-between"
          >
            <span>Join Now</span>
            <FaChevronRight className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;