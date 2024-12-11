import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonialsData = [
  {
    id: 1,
    name: "Alice Johnson",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "This platform transformed my experience! The trainers are outstanding and truly care about my progress.",
    role: "Fitness Enthusiast",
  },
  {
    id: 2,
    name: "Michael Smith",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "I’ve seen incredible results in just a few months. The guidance and support are second to none!",
    role: "Yoga Practitioner",
  },
  {
    id: 3,
    name: "Emily Davis",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "Joining was the best decision I made this year. The trainers motivate and inspire me every session.",
    role: "Personal Training Client",
  },
  {
    id: 4,
    name: "Chris Brown",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "The app is user-friendly, and the trainers are amazing. I highly recommend it to everyone!",
    role: "Gym Member",
  },
  {
    id: 5,
    name: "Sophia Martinez",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "This platform has made my workouts enjoyable and effective. I couldn’t be happier with my results.",
    role: "Pilates Practitioner",
  },
  {
    id: 6,
    name: "James Wilson",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "The expertise and dedication of the trainers are remarkable. I feel healthier and stronger every day.",
    role: "CrossFit Athlete",
  },
  {
    id: 7,
    name: "Olivia Taylor",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "From the personalized training plans to the amazing community, everything has exceeded my expectations.",
    role: "Wellness Advocate",
  },
  {
    id: 8,
    name: "Ethan Clark",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "This platform is a game-changer! The variety of workouts and the motivation it provides are incredible.",
    role: "Strength Trainer",
  },
  {
    id: 9,
    name: "Isabella Miller",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "I love how the trainers adapt to my needs and encourage me to push my limits safely.",
    role: "Cardio Enthusiast",
  },
  {
    id: 10,
    name: "Liam Anderson",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "A truly transformative experience! The training plans and support have improved my lifestyle significantly.",
    role: "Health Seeker",
  },
  {
    id: 11,
    name: "Emma Roberts",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "I feel so much stronger and more confident. This platform is the best investment in my health I’ve made.",
    role: "Wellness Enthusiast",
  },
  {
    id: 12,
    name: "Noah Walker",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "The trainers’ passion and expertise are unmatched. I’ve achieved results I never thought possible.",
    role: "Bodybuilding Enthusiast",
  },
];

const Testimonials = () => {
  const sliderRef = React.useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleMouseEnter = () => {
    sliderRef.current.slickPause(); // Pause autoplay
  };

  const handleMouseLeave = () => {
    sliderRef.current.slickPlay(); // Resume autoplay
  };

  return (
    <div className="py-16 ">
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          What Our Client say about Us
        </h2>
        <div className="bg-white p-[1px] w-1/3 mx-auto"></div>

        {/* Testimonials Carousel */}
        <Slider ref={sliderRef} {...settings} className="mt-16">
          {testimonialsData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="px-4 relative" // Added relative positioning for stacking context
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-white shadow-lg rounded-lg p-6 text-left transform transition-all duration-300 ">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-[#F72C5B]"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
            </div>
          ))}
        </Slider>

        {/* Read More Stories Button */}
        <div className="text-center mt-8">
          <button className=" px-24 py-3 font-semibold bg-[#F72C5B] hover:bg-white text-white hover:text-[#F72C5B] items-end gap-5 justify-end mx-auto transform transition-all duration-300 ease-in-out hover:scale-105">
            <span>Read More Stories</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
