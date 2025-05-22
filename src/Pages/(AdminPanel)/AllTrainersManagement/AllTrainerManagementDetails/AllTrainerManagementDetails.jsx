/* eslint-disable react/prop-types */
import { ImCross } from "react-icons/im";

const AllTrainerManagementDetails = ({ trainer }) => {
  const closeModal = () => document.getElementById("Trainers_Details").close();
  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-200 text-black max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-300 bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-lg text-gray-900">
          Trainer {trainer?.name}&apos;s Details
        </h2>
        <ImCross
          className="hover:text-red-600 cursor-pointer"
          onClick={closeModal}
        />
      </div>
    </div>
  );
};

export default AllTrainerManagementDetails;
