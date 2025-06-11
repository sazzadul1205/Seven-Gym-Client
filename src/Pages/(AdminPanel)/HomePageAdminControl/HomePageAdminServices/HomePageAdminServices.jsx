import { useState } from "react";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Icons
import { FaEdit, FaPlus, FaRegTrashAlt } from "react-icons/fa";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Modals
import HomePageAdminServicesAddModal from "./HomePageAdminServicesAddModal/HomePageAdminServicesAddModal";
import HomePageAdminServicesEditModal from "./HomePageAdminServicesEditModal/HomePageAdminServicesEditModal";

const HomePageAdminServices = ({ Refetch, HomeServicesSectionData }) => {
  const axiosPublic = useAxiosPublic();

  // Selected Services
  const [selectedServices, setSelectedServices] = useState(null);

  // Handle Delete
  const handleDeleteService = async (bannerId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This Service will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F72C5B",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosPublic.delete(`/Home_Services_Section/${bannerId}`);
      await Refetch();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Service has been removed.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Service could not be deleted.",
        confirmButtonColor: "#F72C5B",
      });
    }
  };

  return (
    <section>
      {/* Title */}
      <div className="bg-gray-400 py-2 border-t-2 flex items-center">
        {/* Left: Add Button */}
        <div className="flex-shrink-0 pl-3">
          <button
            id={`add-services-btn`}
            className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
            onClick={() => {
              document.getElementById("Add_Service_Modal").showModal();
            }}
          >
            <FaPlus className="text-green-500" />
          </button>
          <Tooltip
            anchorSelect={`#add-services-btn`}
            content="Add Services Section"
          />
        </div>

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Services Section ( Services {HomeServicesSectionData.length} )
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      {/* Content */}
      <div className="grid grid-cols-4">
        {HomeServicesSectionData.map((service) => (
          <div key={service.id || service.title} className="p-2">
            <div
              className="block transform transition duration-300 hover:scale-105 cursor-default"
              aria-label={`Learn more about ${service.title}`}
            >
              {/* Service Card */}
              <div className="bg-gradient-to-tr hover:bg-gradient-to-bl from-gray-200 to-gray-400 shadow-lg hover:shadow-2xl rounded-lg p-6 text-center h-[190px] w-full flex flex-col justify-between">
                {/* Service Icon */}
                <div className="flex justify-center items-center mb-4">
                  <img
                    src={service.icon}
                    alt={`${service.title} icon`}
                    className="w-12 h-12"
                    onClick={() => alert(`Redirect to - ${service.link}`)}
                  />
                </div>

                {/* Delete button top-left */}
                <>
                  <button
                    id={`delete-service-btn-${service._id}`}
                    className="absolute top-3 left-3 border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                    onClick={() => handleDeleteService(service._id)}
                  >
                    <FaRegTrashAlt className="text-red-500" />
                  </button>
                  <Tooltip
                    anchorSelect={`#delete-service-btn-${service._id}`}
                    content="Delete Service"
                  />
                </>

                {/* Edit button top-right */}
                <>
                  <button
                    id={`edit-service-btn-${service._id}`}
                    className="absolute top-3 right-3 border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                    onClick={() => {
                      setSelectedServices(service);
                      document.getElementById("Edit_Service_Modal").showModal();
                    }}
                  >
                    <FaEdit className="text-yellow-500" />
                  </button>
                  <Tooltip
                    anchorSelect={`#edit-service-btn-${service._id}`}
                    content="Edit Service"
                  />
                </>

                {/* Service Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-black">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Services Modal */}
      <dialog id="Add_Service_Modal" className="modal">
        <HomePageAdminServicesAddModal Refetch={Refetch} />
      </dialog>

      {/* Edit Services Modal */}
      <dialog id="Edit_Service_Modal" className="modal">
        <HomePageAdminServicesEditModal
          setSelectedServices={setSelectedServices}
          selectedServices={selectedServices}
          Refetch={Refetch}
        />
      </dialog>
    </section>
  );
};

// Prop Validations
HomePageAdminServices.propTypes = {
  Refetch: PropTypes.func.isRequired,
  HomeServicesSectionData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      link: PropTypes.string,
      // Add any other properties your service objects might have
    })
  ).isRequired,
};

export default HomePageAdminServices;
