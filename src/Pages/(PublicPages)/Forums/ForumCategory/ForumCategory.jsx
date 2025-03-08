import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";

const ForumCategory = ({
  Categories,
  setSelectedCategory,
  selectedCategory,
}) => {
  return (
    <div className="pt-8 px-4 pb-5">
      {/* Mobile view */}
      <div className="flex md:hidden lg:hidden">
        <Swiper
          spaceBetween={20}
          slidesPerView="2"
          className="flex" // Hide on larger screens
        >
          {["All", ...Categories]?.map((category, index) => (
            <SwiperSlide key={index}>
              <button
                onClick={() => setSelectedCategory(category)}
                className={`py-3  w-[150px] border-2 font-bold rounded-lg transition duration-300 text-sm ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white border-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {category}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Tablet view */}
      <div className="hidden md:flex lg:hidden">
        <Swiper
          spaceBetween={40}
          slidesPerView="5"
          className="flex" // Hide on larger screens
        >
          {["All", ...Categories]?.map((category, index) => (
            <SwiperSlide key={index}>
              <button
                onClick={() => setSelectedCategory(category)}
                className={`py-3  w-[150px] border-2 font-bold rounded-lg transition duration-300 text-sm ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white border-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {category}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop View */}
      <div className="hidden md:hidden lg:flex lg:flex-wrap lg:gap-4">
        {["All", ...Categories]?.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`py-3 px-4 w-[200px] border-2 font-bold rounded-lg transition duration-300 ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-white border-blue-500 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ForumCategory;
