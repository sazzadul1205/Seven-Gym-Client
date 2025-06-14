// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Icons
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";

// Import Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Shared
import GalleryPageAdminAddModal from "./GalleryPageAdminAddModal/GalleryPageAdminAddModal";

const GalleryPageAdminControl = ({ Refetch, GalleryData }) => {
  const axiosPublic = useAxiosPublic();

  // Delete Gallery Image
  const handleDeleteGalleryImage = async (promoId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This Gallery Image will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F72C5B",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosPublic.delete(`/Gallery/${promoId}`);
      await Refetch();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Gallery Image has been removed.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Gallery Image could not be deleted.",
        confirmButtonColor: "#F72C5B",
      });
    }
  };

  return (
    <div className="text-black pb-5">
      {/* Header */}
      <div className="bg-gray-400 py-2 border-t-2 flex items-center">
        {/* Left: Add Button */}
        <div className="flex-shrink-0 pl-3">
          <button
            id="add-image-btn"
            className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
            onClick={() =>
              document.getElementById("Add_Gallery_Image_Modal")?.showModal()
            }
          >
            <FaPlus className="text-green-500" />
          </button>
          <Tooltip anchorSelect="#add-image-btn" content="Add New Image" />
        </div>

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Gallery Page Preview (Admin) [ Images {GalleryData.length} ]
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4 p-4">
        {GalleryData && GalleryData.length > 0 ? (
          GalleryData.map((item) => (
            <div
              key={item._id}
              className="relative overflow-hidden rounded-lg shadow-md"
            >
              <img
                src={item?.url}
                alt={item?.alt || "Gallery Image"}
                className="w-full h-full object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              {/* Delete Button */}
              <>
                <button
                  id={`delete-item-btn-${item._id}`}
                  className="absolute top-3 left-3 border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                  onClick={() => handleDeleteGalleryImage(item._id)}
                >
                  <FaRegTrashAlt className="text-red-500" />
                </button>
                <Tooltip
                  anchorSelect={`#delete-item-btn-${item._id}`}
                  content="Delete Image"
                />
              </>
            </div>
          ))
        ) : (
          <p className="text-center col-span-4 text-gray-600">
            No images found in the gallery.
          </p>
        )}
      </div>

      {/* Add New Gallery Modal */}
      <dialog id="Add_Gallery_Image_Modal" className="modal">
        <GalleryPageAdminAddModal Refetch={Refetch} />
      </dialog>
    </div>
  );
};

// Prop Validation
GalleryPageAdminControl.propTypes = {
  Refetch: PropTypes.func.isRequired,
  GalleryData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      alt: PropTypes.string,
    })
  ),
};

export default GalleryPageAdminControl;
