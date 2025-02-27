/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import Title from "../../../../Shared/Component/Title";

const PromotionsSection = ({ promotionsData }) => {
  // State to track the selected promotion
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Ref for the modal element to avoid direct DOM manipulation
  const modalRef = useRef(null);

  // Function to open the modal with the selected promotion details
  const handleOpenModal = (promo) => {
    setSelectedPromo(promo);
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  return (
    <div className="py-10 bg-gradient-to-t from-black/20 to-black/40">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent="Promotions & Offers" />
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-6 md:mt-11 px-3">
          {promotionsData.map((promo) => (
            <div
              key={promo._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              {/* Promotion Image */}
              <img
                src={promo.imageUrl}
                alt={promo.title || "Promotion Image"}
                className="w-full h-56 object-cover"
              />

              {/* Promotion Details */}
              <div className="flex-1 p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {promo.title}
                </h3>
                <p className="text-gray-600">{promo.description}</p>
              </div>

              {/* "Learn More" Button */}
              <div className="p-4">
                <button className="w-full border-2 border-red-500 hover:bg-gradient-to-br from-[#d1234f] to-[#eb0b43] py-2 font-semibold rounded-xl hover:text-white">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotion Details Modal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          {selectedPromo ? (
            <>
              {/* Modal Content */}
              <img
                src={selectedPromo.imageUrl}
                alt={selectedPromo.title || "Promotion Image"}
                className="w-full rounded-lg"
              />
              <h3 className="font-bold text-lg py-2">{selectedPromo.title}</h3>
              <p className="py-2">{selectedPromo.offerDetails}</p>
              <p className="py-2">
                <strong>Duration:</strong> {selectedPromo.promoDuration}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}

          {/* Close Button */}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PromotionsSection;
