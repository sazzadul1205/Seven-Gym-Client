import React from "react";
import { ImCross } from "react-icons/im";

const OurMissionHeroSectionEditModal = () => {
  return (
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-1400 px-5 py-4">
        <h3 className="font-bold text-lg">Edit Page Background</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Our_Mission_Background_Edit_Modal").close()
          }
        />
      </div>
    </div>
  );
};

export default OurMissionHeroSectionEditModal;
