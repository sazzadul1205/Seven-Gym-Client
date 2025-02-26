/* eslint-disable react/prop-types */
import { useState } from "react";
import Title from "../../../../Shared/Component/Title";


const PromotionsSection = ({ promotionsData }) => {
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Function to handle opening the modal with the selected promotion's details
  const handleOpenModal = (promo) => {
    setSelectedPromo(promo);
    document.getElementById("my_modal_1").showModal();
  };

  return (
    <div className="py-16">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <div className="px-6">
          <Title titleContent={"Promotions & Offers"} />
        </div>

        {/* Promotions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-8 mt-6 md:mt-11 text-left px-1">
          {promotionsData.map((promo) => (
            <div
              key={promo._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="w-full h-56 object-cover"
              />
              <div className="flex-1 pt-2 px-3 md:px-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {promo.title}
                </h3>
                <p className="text-gray-600 mb-1">{promo.description}</p>
              </div>
              <div className="p-6">
                <button
                  onClick={() => handleOpenModal(promo)}
                  className="inline-block px-10 py-3 font-semibold text-white bg-[#F72C5B] hover:bg-white hover:text-[#F72C5B] border border-[#F72C5B] rounded-lg transition duration-300 transform hover:scale-105 w-full text-center"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          {selectedPromo ? (
            <>
              <img src={selectedPromo.imageUrl} alt="" />
              <h3 className="font-bold text-lg py-2">{selectedPromo.title}</h3>
              <p className="py-2">{selectedPromo.offerDetails}</p>

              <p className="py-2">
                <strong>Duration:</strong> {selectedPromo.promoDuration}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}

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
