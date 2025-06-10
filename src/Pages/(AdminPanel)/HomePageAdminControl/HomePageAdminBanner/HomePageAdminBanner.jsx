import { useState } from "react";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Icons
import { FaEdit, FaPlus, FaRegTrashAlt } from "react-icons/fa";

// import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Modals
import HomePageAdminBannerAddModal from "./HomePageAdminBannerAddModal/HomePageAdminBannerAddModal";
import HomePageAdminBannerEditModal from "./HomePageAdminBannerEditModal/HomePageAdminBannerEditModal";

const HomePageAdminBanner = ({ Refetch, HomeBannerSectionData }) => {
  const axiosPublic = useAxiosPublic();

  // Selected Banner
  const [selectedBanner, setSelectedBanner] = useState(null);

  return (
    <section>
      {/* Title */}
      <div className="bg-gray-400 py-2 border-t-2 flex items-center">
        {/* Left: Add Button */}
        <div className="flex-shrink-0 pl-3">
          <button
            id={`add-banner-btn`}
            className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
            onClick={() =>
              document.getElementById("Add_Banner_Modal").showModal()
            }
          >
            <FaPlus className="text-green-500" />
          </button>
          <Tooltip anchorSelect={`#add-banner-btn`} content="Add Banner" />
        </div>

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Banner Section ( Banner {HomeBannerSectionData.length} )
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      {/* Banner Grid */}
      <div className="grid grid-cols-2 gap-6 p-2">
        {HomeBannerSectionData?.map((banner) => (
          <div
            key={banner._id}
            className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md border border-gray-200"
          >
            {/* Background Image */}
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />

            {/* Delete button top-left */}
            <>
              <button
                id={`delete-banner-btn-${banner._id}`}
                className="absolute top-3 left-3 border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                onClick={async () => {
                  const confirm = await Swal.fire({
                    title: "Are you sure?",
                    text: "This banner will be permanently deleted.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#F72C5B",
                    cancelButtonColor: "#d1d5db",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "Cancel",
                  });

                  if (confirm.isConfirmed) {
                    // If Success
                    try {
                      await axiosPublic.delete(
                        `/Home_Banner_Section/${banner._id}`
                      );
                      await Refetch();

                      Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: "Banner has been removed.",
                        showConfirmButton: false,
                        timer: 1000,
                      });

                      // If Unrestful
                    } catch (error) {
                      console.log(error);

                      Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: "Banner could not be deleted.",
                        confirmButtonColor: "#F72C5B",
                      });
                    }
                  }
                }}
              >
                <FaRegTrashAlt className="text-red-500" />
              </button>
              <Tooltip
                anchorSelect={`#delete-banner-btn-${banner._id}`}
                content="Delete Banner"
              />
            </>
            
            {/* Edit button top-right */}
            <>
              <button
                id={`edit-banner-btn-${banner._id}`}
                className="absolute top-3 right-3 border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                onClick={() => {
                  setSelectedBanner(banner);
                  document.getElementById("Edit_Banner_Modal").showModal();
                }}
              >
                <FaEdit className="text-yellow-500" />
              </button>
              <Tooltip
                anchorSelect={`#edit-banner-btn-${banner._id}`}
                content="Edit Banner"
              />
            </>

            {/* Overlay Card */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-black/60 text-white backdrop-blur-md rounded-xl p-5 text-center w-11/12 max-w-sm shadow-lg space-y-4 relative">
                {/* Title */}
                <h1 className="text-xl font-bold">{banner.title}</h1>

                {/* Description */}
                <p className="text-sm">{banner.description}</p>

                {/* Buttons */}
                <div className="flex justify-center">
                  <CommonButton
                    text={banner.buttonName}
                    clickEvent={(e) => {
                      e.preventDefault();
                      alert(`You are about to visit: ${banner.link}`);
                    }}
                    type="button"
                    bgColor="OriginalRed"
                    px="px-10"
                    py="py-2"
                    borderRadius="rounded-sm"
                    textColor="text-white"
                    className="text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Banner Modal */}
      <dialog id="Add_Banner_Modal" className="modal">
        <HomePageAdminBannerAddModal Refetch={Refetch} />
      </dialog>

      {/* Edit Banner Modal */}
      <dialog id="Edit_Banner_Modal" className="modal">
        <HomePageAdminBannerEditModal
          setSelectedBanner={setSelectedBanner}
          selectedBanner={selectedBanner}
          Refetch={Refetch}
        />
      </dialog>
    </section>
  );
};

// Prop Validation
HomePageAdminBanner.propTypes = {
  HomeBannerSectionData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      buttonName: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
  Refetch: PropTypes.func.isRequired,
};

export default HomePageAdminBanner;
