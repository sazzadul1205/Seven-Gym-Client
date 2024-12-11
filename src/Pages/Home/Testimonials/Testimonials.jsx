import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Title from "../../../Shared/Componenet/Title";

const testimonialsData = [
  {
    name: "Alice Johnson",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "This platform transformed my experience! The trainers are outstanding and truly care about my progress.",
    role: "Fitness Enthusiast",
  },
  {
    name: "Michael Smith",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "I’ve seen incredible results in just a few months. The guidance and support are second to none!",
    role: "Yoga Practitioner",
  },
  {
    name: "Emily Davis",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "Joining was the best decision I made this year. The trainers motivate and inspire me every session.",
    role: "Personal Training Client",
  },
  {
    name: "Chris Brown",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "The app is user-friendly, and the trainers are amazing. I highly recommend it to everyone!",
    role: "Gym Member",
  },
  {
    name: "Sophia Martinez",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "This platform has made my workouts enjoyable and effective. I couldn’t be happier with my results.",
    role: "Pilates Practitioner",
  },
  {
    name: "James Wilson",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "The expertise and dedication of the trainers are remarkable. I feel healthier and stronger every day.",
    role: "CrossFit Athlete",
  },
  {
    name: "Olivia Taylor",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "From the personalized training plans to the amazing community, everything has exceeded my expectations.",
    role: "Wellness Advocate",
  },
  {
    name: "Ethan Clark",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "This platform is a game-changer! The variety of workouts and the motivation it provides are incredible.",
    role: "Strength Trainer",
  },
  {
    name: "Isabella Miller",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "I love how the trainers adapt to my needs and encourage me to push my limits safely.",
    role: "Cardio Enthusiast",
  },
  {
    name: "Liam Anderson",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "A truly transformative experience! The training plans and support have improved my lifestyle significantly.",
    role: "Health Seeker",
  },
  {
    name: "Emma Roberts",
    imageUrl: "https://i.ibb.co/Tryb0YT/User.jpg",
    quote:
      "I feel so much stronger and more confident. This platform is the best investment in my health I’ve made.",
    role: "Wellness Enthusiast",
  },
  {
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
    arrows: false,
    responsive: [
      {
        breakpoint: 1024, // Tablet view: 2 testimonials
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Mobile view: 1 testimonial
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
    <div className="py-16">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent={"What Our Clients Say About Us"} />
        </div>

        {/* Testimonials Carousel */}
        <Slider ref={sliderRef} {...settings} className="mt-6 md:mt-16 md:px-2">
          {testimonialsData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="md:px-4 relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-white shadow-lg rounded-lg p-6 text-left transform transition-all duration-300 h-[200px]">
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
          <button className=" px-12 md:px-24 py-3 font-semibold bg-[#F72C5B] hover:bg-white text-white hover:text-[#F72C5B] items-end gap-5 justify-end mx-auto transform transition-all duration-300 ease-in-out hover:scale-105">
            <span>Read More Stories</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
