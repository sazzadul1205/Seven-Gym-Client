/* eslint-disable react/prop-types */
import { ImCross } from "react-icons/im";

const AllTrainerScheduleModal = ({ closeModal, selectedSchedule }) => {
  console.log("selected Schedule :", selectedSchedule);

  return (
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black pb-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Trainer Schedule</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => closeModal()}
        />
      </div>
    </div>
  );
};

export default AllTrainerScheduleModal;
