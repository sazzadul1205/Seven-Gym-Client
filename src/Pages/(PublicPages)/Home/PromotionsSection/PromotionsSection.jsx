import { useState } from "react";
import PropTypes from "prop-types";

import Title from "../../../../Shared/Component/Title";
import PromotionContentModal from "./PromotionContentModal/PromotionContentModal";
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const PromotionsSection = ({ promotionsData }) => {
  // State to track the selected promotion for the modal
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Function to open the modal and set the selected promotion
  const handleOpenModal = (promo) => {
    setSelectedPromo(promo);
    document.getElementById("Promotion_Content_Modal").showModal();
  };

  return (
    <div className="py-10 bg-gradient-to-t from-black/40 to-black/70">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent="Promotions & Offers" />
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-6 md:mt-11 px-3">
          {promotionsData
            .filter((promo) => promo.show)
            .map((promo) => (
              <div
                key={promo._id}
                className="bg-linear-to-br hover:bg-linear-to-tr from-gray-100 to-gray-300 rounded-lg shadow-lg overflow-hidden flex flex-col"
              >
                {/* Promotion Image */}
                <img
                  src={promo.imageUrl}
                  alt={promo.title || "Promotion Image"}
                  className="w-full h-56 object-cover"
                />

                {/* Promotion Details */}
                <div className="flex-1 p-4 border-t-2 border-black">
                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    {promo.title}
                  </h3>

                  {/* Description */}
                  <p className="text-black">{promo.description}</p>
                </div>

                {/* "Learn More" Button */}
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
            ))}
        </div>
      </div>

      {/* Promotion Details Modal */}
      <dialog id="Promotion_Content_Modal" className="modal">
        <PromotionContentModal promo={selectedPromo} />
      </dialog>
    </div>
  );
};

// PropTypes validation
PromotionsSection.propTypes = {
  promotionsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      promoDuration: PropTypes.string,
      offerDetails: PropTypes.string,
      promoCode: PropTypes.string,
    })
  ).isRequired,
};

export default PromotionsSection;
