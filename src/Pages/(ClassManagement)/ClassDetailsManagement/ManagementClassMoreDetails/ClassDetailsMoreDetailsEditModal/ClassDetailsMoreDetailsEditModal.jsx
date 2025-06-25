import React from "react";
import { ImCross } from "react-icons/im";

const ClassDetailsMoreDetailsEditModal = ({ selectedClass }) => {
  console.log("classGoals:",selectedClass?.classGoals);
  console.log("fitnessBenefits:",selectedClass?.fitnessBenefits);
  console.log("feedbackMechanism:",selectedClass?.feedbackMechanism);
  console.log("classMilestones:",selectedClass?.classMilestones);

  return (
    <div
      id="Class_More_Details_Edit_Modal"
      className="modal-box max-w-3xl p-0 bg-gradient-to-b from-white to-gray-300 text-black"
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit : {selectedClass?.module} Class Key Features
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => {
            document.getElementById("Class_More_Details_Edit_Modal")?.close();
          }}
        />
      </div>

      {/* Show errors if any */}
      {(Object.keys(errors).length > 0 || modalError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md space-y-1 text-sm m-5">
          {errors.tag && <div>Tag is required.</div>}
          {modalError && <div>{modalError}</div>}
        </div>
      )}
    </div>
  );
};

export default ClassDetailsMoreDetailsEditModal;


