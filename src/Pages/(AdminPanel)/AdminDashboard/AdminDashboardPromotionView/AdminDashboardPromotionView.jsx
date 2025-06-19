import { useState } from "react";

// Import Packages
import { Tooltip } from "react-tooltip";
import PropTypes from "prop-types";

// import Slider
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Icons
import { FaArrowLeft } from "react-icons/fa";

// import Common Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Modal
import PromotionContentModal from "../../../(PublicPages)/Home/PromotionsSection/PromotionContentModal/PromotionContentModal";

const AdminDashboardPromotionView = ({ PromotionsData }) => {
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Filter only promotions with show === true
  const promotions =
    PromotionsData?.filter((promo) => promo?.show === true) || [];

  // Slider settings (adjust as needed)
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: true,
  };

  // Open detail modal
  const handleOpenModal = (promo) => {
    setSelectedPromo(promo);
    document.getElementById("Promotion_Content_Modal")?.showModal();
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gray-400 py-2 border-t-2 flex items-center">
        {/* Left: Add Button */}
        <div className="flex-shrink-0 pl-3">
          <button
            id="go-to-promotion"
            className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
            onClick={() => alert("Fuck")}
          >
            <FaArrowLeft className="text-green-500" />
          </button>
          <Tooltip anchorSelect="#go-to-promotion" content="Go To Promotion" />
        </div>

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Active Promotion&apos;s
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      {/* Promotion Slider */}
      {promotions.length > 0 ? (
        <div className="relative p-4">
          <Slider {...settings}>
            {promotions.map((promo) => (
              <div key={promo._id} className="px-2">
                <div className="bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
                  {/* Image */}
                  <img
                    src={promo.imageUrl || "/default-image.jpg"}
                    alt={promo.title || "Promotion Image"}
                    className="w-full h-56 object-cover"
                  />

                  {/* Content */}
                  <div className="flex-1 p-4 border-t-2 border-black">
                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-2 text-black">
                      {promo.title || "Untitled Promotion"}
                    </h3>

                    {/* Description */}
                    <p className="text-black">
                      {promo.description || "No description provided."}
                    </p>
                  </div>

                  {/* Learn More Button */}
                  <div className="p-4">
                    <CommonButton
                      clickEvent={() => handleOpenModal(promo)}
                      text="Learn More"
                      bgColor="OriginalRed"
                      textColor="text-white"
                      borderRadius="rounded-xl"
                      py="py-3"
                      className="border-2 transition duration-300 w-full"
                      defaultDirection="bg-gradient-to-tl"
                      hoverDirection="hover:bg-gradient-to-br"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="text-center text-gray-600 p-4">
          No active promotions to display.
        </div>
      )}

      {/* Promotion Details Modal */}
      <dialog id="Promotion_Content_Modal" className="modal">
        <PromotionContentModal promo={selectedPromo} />
      </dialog>
    </>
  );
};

// Prop Validation
AdminDashboardPromotionView.propTypes = {
  PromotionsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      description: PropTypes.string,
      imageUrl: PropTypes.string,
      show: PropTypes.bool,
    })
  ),
};

export default AdminDashboardPromotionView;
