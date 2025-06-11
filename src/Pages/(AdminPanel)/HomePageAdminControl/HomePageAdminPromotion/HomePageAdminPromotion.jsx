import { useEffect, useState } from "react";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Icons
import {
  FaEdit,
  FaPlus,
  FaRegStar,
  FaRegTrashAlt,
  FaStar,
} from "react-icons/fa";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Shared
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Modals
import HomePageAdminPromotionAddModal from "./HomePageAdminPromotionAddModal/HomePageAdminPromotionAddModal";
import HomePageAdminPromotionEditModal from "./HomePageAdminPromotionEditModal/HomePageAdminPromotionEditModal";
import PromotionContentModal from "../../../(PublicPages)/Home/PromotionsSection/PromotionContentModal/PromotionContentModal";

const HomePageAdminPromotion = ({ Refetch, PromotionsData }) => {
  const axiosPublic = useAxiosPublic();

  // Local promotions state for instant UI updates
  const [promotions, setPromotions] = useState(PromotionsData || []);
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Sync local state if PromotionsData changes from parent
  useEffect(() => {
    setPromotions(PromotionsData || []);
  }, [PromotionsData]);

  // Open detail modal
  const handleOpenModal = (promo) => {
    setSelectedPromo(promo);
    document.getElementById("Promotion_Content_Modal")?.showModal();
  };

  // Delete promotion
  const handleDeletePromotion = async (promoId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This promotion will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F72C5B",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosPublic.delete(`/Promotion/${promoId}`);
      await Refetch();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Promotion has been removed.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Promotion could not be deleted.",
        confirmButtonColor: "#F72C5B",
      });
    }
  };

  // Toggle featured (show) status locally and on server
  const toggleShowStatus = async (promoId) => {
    // Find the promo to toggle
    const promoToToggle = promotions.find((promo) => promo._id === promoId);
    if (!promoToToggle) return;

    // Count how many are currently shown
    const currentlyShownCount = promotions.filter((p) => p.show).length;

    // If toggling from false to true and already 6 shown, warn and abort
    if (!promoToToggle.show && currentlyShownCount >= 6) {
      Swal.fire({
        icon: "warning",
        title: "Limit reached",
        text: "You cannot feature more than 6 promotions at the same time.",
        confirmButtonColor: "#F72C5B",
      });
      return; // abort toggle
    }

    // Optimistically update UI
    const newShowStatus = !promoToToggle.show;
    setPromotions((prevPromos) =>
      prevPromos.map((promo) =>
        promo._id === promoId ? { ...promo, show: newShowStatus } : promo
      )
    );

    try {
      // Call API to toggle on server
      const response = await axiosPublic.patch(
        `/Promotions/ToggleShow/${promoId}`
      );

      const { newStatus } = response.data;

      // If server status differs from optimistic one, fix it
      if (newStatus !== newShowStatus) {
        setPromotions((prevPromos) =>
          prevPromos.map((promo) =>
            promo._id === promoId ? { ...promo, show: newStatus } : promo
          )
        );
      }

      // Optionally refresh the whole list if needed
      await Refetch();
    } catch (error) {
      console.error("Failed to toggle show status:", error);

      // Revert UI change on failure
      setPromotions((prevPromos) =>
        prevPromos.map((promo) =>
          promo._id === promoId ? { ...promo, show: promoToToggle.show } : promo
        )
      );

      Swal.fire({
        icon: "error",
        title: "Failed to update promotion status",
        text: "Please try again later.",
        confirmButtonColor: "#F72C5B",
      });
    }
  };

  return (
    <section>
      {/* Header */}
      <div className="bg-gray-400 py-2 border-t-2 flex items-center">
        {/* Left: Add Button */}
        <div className="flex-shrink-0 pl-3">
          <button
            id="add-promotion-btn"
            className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
            onClick={() =>
              document.getElementById("Add_Promotion_Modal")?.showModal()
            }
          >
            <FaPlus className="text-green-500" />
          </button>
          <Tooltip
            anchorSelect="#add-promotion-btn"
            content="Add New Promotion"
          />
        </div>

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Promotions Section (Promotions: {promotions.length})
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      {/* Promotion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
        {promotions.map((promo) => (
          <div
            key={promo._id}
            className="relative bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg shadow-lg overflow-hidden flex flex-col "
          >
            {/* Image */}
            <img
              src={promo.imageUrl || "/default-image.jpg"}
              alt={promo.title || "Promotion Image"}
              className="w-full h-56 object-cover"
            />

            {/* Delete Button */}
            <>
              <button
                id={`delete-promo-btn-${promo._id}`}
                className="absolute top-3 left-3 border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                onClick={() => handleDeletePromotion(promo._id)}
              >
                <FaRegTrashAlt className="text-red-500" />
              </button>
              <Tooltip
                anchorSelect={`#delete-promo-btn-${promo._id}`}
                content="Delete Promotion"
              />
            </>

            {/* Show Status Star */}
            <>
              <button
                id={`show-status-btn-${promo._id}`}
                className="absolute top-3 left-1/2 transform -translate-x-1/2 border-2 border-gray-500/50 bg-gray-100/50 hover:bg-gray-100 rounded-full p-1 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                onClick={() => toggleShowStatus(promo._id)}
              >
                {promo?.show === true ? (
                  <FaStar className="text-yellow-500/50 hover:text-yellow-500 text-3xl" />
                ) : (
                  <FaRegStar className="text-yellow-500/50 hover:text-yellow-500 text-3xl" />
                )}
              </button>
              <Tooltip
                anchorSelect={`#show-status-btn-${promo._id}`}
                content={
                  promo?.show === true ? "Featured promotion" : "Click to promo"
                }
              />
            </>

            {/* Edit Button */}
            <>
              <button
                id={`edit-promo-btn-${promo._id}`}
                className="absolute top-3 right-3 border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                onClick={() => {
                  setSelectedPromo(promo);
                  document.getElementById("Edit_Promotion_Modal")?.showModal();
                }}
              >
                <FaEdit className="text-yellow-500" />
              </button>
              <Tooltip
                anchorSelect={`#edit-promo-btn-${promo._id}`}
                content="Edit Promotion"
              />
            </>

            {/* Content */}
            <div className="flex-1 p-4 border-t-2 border-black">
              <h3 className="text-xl font-semibold mb-2 text-black">
                {promo.title || "Untitled Promotion"}
              </h3>
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
        ))}
      </div>

      {/* Promotion Details Modal */}
      <dialog id="Promotion_Content_Modal" className="modal">
        <PromotionContentModal promo={selectedPromo} />
      </dialog>

      {/* Add New Promotion Modal */}
      <dialog id="Add_Promotion_Modal" className="modal">
        <HomePageAdminPromotionAddModal Refetch={Refetch} />
      </dialog>

      {/* Edit Promotion Modal */}
      <dialog id="Edit_Promotion_Modal" className="modal">
        <HomePageAdminPromotionEditModal
          setSelectedPromo={setSelectedPromo}
          selectedPromo={selectedPromo}
          Refetch={Refetch}
        />
      </dialog>
    </section>
  );
};

// Prop
HomePageAdminPromotion.propTypes = {
  Refetch: PropTypes.func.isRequired,
  PromotionsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      description: PropTypes.string,
      imageUrl: PropTypes.string,
      show: PropTypes.bool,
    })
  ).isRequired,
};

export default HomePageAdminPromotion;
