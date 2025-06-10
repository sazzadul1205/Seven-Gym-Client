import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";

const PromotionContentModal = ({ promo }) => {
  if (!promo) return null; // Ensure promo data exists before rendering

  return (
    <div className="modal-box p-0 rounded-md relative bg-white text-black">
      {/* Close Button (Top-Left Over Image) */}
      <form method="dialog">
        <button
          className="absolute top-2 right-2 bg-black/60 text-white p-3 rounded-full hover:bg-red-500 transition duration-300 cursor-pointer"
          onClick={() =>
            document.getElementById("Promotion_Content_Modal").close()
          }
          type="reset"
        >
          <ImCross size={14} />
        </button>
      </form>

      {/* Promotion Image */}
      <div className="border-b border-black">
        <img
          src={promo.imageUrl}
          alt={promo.title}
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Promotion Content */}
      <div className="px-6 py-2">
        {/* Promotion Title */}
        <h3 className="text-2xl font-bold py-2">{promo.title}</h3>

        {/* Promotion Offer Details */}
        <p className="text-gray-700 py-2">{promo.offerDetails}</p>

        {/* Promo Duration */}
        <p className="py-2 text-sm text-gray-600">
          <strong>Duration:</strong> {promo.promoDuration}
        </p>

        {/* Promo Code (if available) */}
        {promo.promoCode && (
          <div className="py-2">
            <p className="text-sm">
              <strong>Promo Code:</strong>{" "}
              <span className="font-mono bg-gray-200 px-2 py-1 rounded-sm text-red-600">
                {promo.promoCode}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes validation
PromotionContentModal.propTypes = {
  promo: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    offerDetails: PropTypes.string.isRequired,
    promoDuration: PropTypes.string.isRequired,
    promoCode: PropTypes.string,
  }),
};

export default PromotionContentModal;
