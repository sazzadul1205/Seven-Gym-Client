import { useMemo } from "react";
import PropTypes from "prop-types";

// Import slick-carousel CSS if not imported globally
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ForumCategory = ({
  Categories = [],
  setSelectedCategory,
  selectedCategory,
}) => {
  // Memoize the category list to avoid unnecessary re-calculations
  const categoryList = useMemo(() => ["All", ...Categories], [Categories]);

  // Slider settings for responsive behavior
  const sliderSettings = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1280, // Large screens
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024, // Tablets and small desktops
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // Small tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Mobile screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      {/* Section Header */}
      <h3 className="font-semibold text-lg sm:text-xl mb-4 text-center sm:text-left">
        Search By Category
      </h3>

      {/* React Slick Slider displaying the category buttons */}
      <Slider {...sliderSettings}>
        {categoryList.map((category) => (
          <div key={category} className="px-2">
            <button
              onClick={() => setSelectedCategory(category)}
              className={`w-full font-bold rounded-lg text-sm py-3 px-4 transition duration-300 
                ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                    : "bg-white text-black hover:bg-gradient-to-r from-blue-200 to-blue-500"
                }`}
            >
              {category}
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

ForumCategory.propTypes = {
  Categories: PropTypes.arrayOf(PropTypes.string),
  setSelectedCategory: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
};

export default ForumCategory;
