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
  // Memoize the category list to avoid re-calculation on every render
  const categoryList = useMemo(() => ["All", ...Categories], [Categories]);

  // Slider settings for responsive behavior and smooth transitions
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024, // Screen width below 1024px
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 600, // Screen width below 600px
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480, // Screen width below 480px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      {/* Section header */}
      <h3 className="font-semibold text-xl mb-4">Search By Category</h3>

      {/* React Slick Slider displaying the category buttons */}
      <Slider {...sliderSettings}>
        {categoryList.map((category) => (
          <div key={category} className="px-2">
            <button
              onClick={() => setSelectedCategory(category)}
              className={`w-full font-bold rounded-lg text-black transition duration-300 text-sm py-3 px-4 ${
                selectedCategory === category
                  ? "bg-linear-to-bl hover:bg-linear-to-tr from-blue-200 to-blue-500"
                  : "bg-white hover:bg-linear-to-tr from-blue-200 to-blue-500"
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
