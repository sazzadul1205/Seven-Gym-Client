import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";

const Welcome = () => {
  const [isVideoVisible, setIsVideoVisible] = useState(true);

  // Handle video show/hide toggle
  const toggleVideo = () => {
    setIsVideoVisible((prev) => !prev);
  };

  return (
    <div className="relative h-screen w-full text-white">
      {/* Background Video */}
      {isVideoVisible && (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/Y5RtQ4cawVk?autoplay=1&mute=1&loop=1&playlist=Y5RtQ4cawVk"
            title="Background Video"
            className="w-full h-full object-cover"
            allow="autoplay; fullscreen"
            frameBorder="0"
          ></iframe>
        </div>
      )}

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 px-6">
        {/* Hero Text */}
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-center mb-4">
          Achieve Your Fitness Goals with Us!
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-center mb-6 max-w-2xl">
          Join our community and transform your health with state-of-the-art
          facilities, personalized coaching, and a motivating environment.
        </p>

        {/* Call to Action (CTA) */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            href="/join-now"
            className="bg-blue-500 hover:bg-gradient-to-l from-blue-700 to-blue-400 text-white py-3 px-6 rounded-lg text-lg transition duration-300 flex items-center justify-between"
          >
            <span className="mr-5">Join Now</span>
            <FaChevronRight />
          </button>
          <button
            href="/classes"
            className="bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            View Classes
          </button>
        </div>

        {/* Video Toggle Button */}
        <button
          onClick={toggleVideo}
          className="mt-6 text-sm text-gray-400 hover:text-white underline"
        >
          {isVideoVisible ? "Hide Video" : "Show Video"}
        </button>
      </div>
    </div>
  );
};

export default Welcome;
